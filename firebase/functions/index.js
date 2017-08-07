const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})
const got = require('got')
const moment = require('moment')
const googleAuth = require('google-auth-library')
const google = require('googleapis')

admin.initializeApp(functions.config().firebase)

const DB = admin.database()
const DB_TOKEN_PATH = 'api_tokens'
const MEMBERS_PATH = 'members'

// email validators
const emailRegex = /^.+@.+\..+$/i
const isEmail = value => emailRegex.test(value)

// config for goolgeAuthApi
const FUNCTIONS_CLIENT_ID = functions.config().googleapi.client_id
const FUNCTIONS_SECRET_KEY = functions.config().googleapi.client_secret
const FUNCTIONS_REDIRECT =
  'https://us-central1-webdevandsausages.cloudfunctions.net/OauthCallback'

let oauthTokens = null

const auth = new googleAuth()
const functionsOauthClient = new auth.OAuth2(
  FUNCTIONS_CLIENT_ID,
  FUNCTIONS_SECRET_KEY,
  FUNCTIONS_REDIRECT
)

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

// visit the URL for this Function to obtain tokens
exports.authGoogleAPI = functions.https.onRequest((req, res) => {
  const redirectUrl = functionsOauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  })

  res.redirect(redirectUrl)
})

// after you grant access, you will be redirected to the URL for this Function
// this Function stores the tokens to your Firebase database

exports.OauthCallback = functions.https.onRequest((req, res) => {
  const code = req.query.code
  functionsOauthClient.getToken(code, (err, tokens) => {
    // Now tokens contains an access_token and an optional refresh_token. Save them.

    if (err) {
      return res.status(400).send(err)
    }
    return DB.ref(DB_TOKEN_PATH)
      .set(tokens)
      .then(() => res.status(200).send('OK'))
  })
})

// checks if oauthTokens have been loaded into memory, and if not, retrieves them
function getAuthorizedClient() {
  return new Promise((resolve, reject) => {
    if (oauthTokens) {
      return resolve(functionsOauthClient)
    }

    DB.ref(DB_TOKEN_PATH)
      .once('value')
      .then(snapshot => {
        oauthTokens = snapshot.val()
        functionsOauthClient.setCredentials(oauthTokens)
        return resolve(functionsOauthClient)
      })
      .catch(() => reject())
  })
}

// accepts an append request, returns a Promise to append it, enriching it with auth
function appendPromise(requestWithoutAuth) {
  return new Promise((resolve, reject) => {
    getAuthorizedClient()
      .then(client => {
        const sheets = google.sheets('v4')
        const request = requestWithoutAuth
        request.auth = client

        sheets.spreadsheets.values.append(request, (err, response) => {
          if (err) {
            console.log(`The API returned an error: ${err}`)
            return reject()
          }

          return resolve(response)
        })
      })
      .catch(() => reject())
  })
}

const GOOGLE_SHEET_ID = '1jnATckAl0Mb3vjkGf7SEQ0wDBR0q4AVnry1ZxrPrhxw'

exports.appendRecordToSpreadsheet = functions.database
  .ref(`${MEMBERS_PATH}/{ITEM}`)
  .onWrite(event => {
    const newRecord = event.data.current.val()

    notifySlack(newRecord.email)

    return appendPromise({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'A:C',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[newRecord.email, newRecord.active, newRecord.registeredOn]],
      },
    })
  })

// called from client with email to add to mailing list
exports.addMember = functions.https.onRequest((req, res) => {
  if (req.method === 'PUT' || req.method === 'PATCH') {
    res.status(403).send('Forbidden!')
  }

  cors(req, res, () => {
    const email = req.body.email
    const isValid = isEmail(email)
    const date = moment().format()

    // simple validation
    if (!email || !isValid) {
      res.status(400).send('failure')
    } else {
      // check if already saved
      DB.ref('members').once('value').then(snapshot => {
        const members = snapshot.val() || {}
        const matchingEmail = Object.keys(members).filter(member => {
          return members[member].email === email
        })

        if (matchingEmail.length !== 0) {
          return res.status(200).send('already saved')
        }

        const data = {
          email,
          registeredOn: date,
          active: true,
        }

        DB.ref('members')
          .push(data)
          .then(() => {
            res.status(201).send('success')
          })
          .catch(() => {
            res.status(500).send('oops')
          })
      })
    }
  })
})

function notifySlack(email) {
  const body = {text: `${email} joined the mailing list!`}
  got
    .post(functions.config().slack.url, {
      body,
      json: true,
    })
    .then(res => {
      console.log('slack notified')
    })
    .catch(console.error)
}
