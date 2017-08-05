const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})
const got = require('got')
const moment = require('moment')

admin.initializeApp(functions.config().firebase)

const DB = admin.database().ref('members')

const emailRegex = /^.+@.+\..+$/i
const isEmail = value => emailRegex.test(value)

// URL: https://us-central1-webdevandsausages.cloudfunctions.net/addMember
exports.addMember = functions.https.onRequest((req, res) => {
  console.log(req.method)
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
      DB.once('value').then(snapshot => {
        const members = snapshot.val()
        const matchingEmail = Object.keys(members).filter(member => {
          return members[member].email === email
        })

        if (matchingEmail.length !== 0) {
          return res.status(200).send('already saved')
        }

        const data = {
          email,
          registeredOn: date,
          active: true
        }

        //TODO: use promise api to verify success?
        DB.push(data)
        notifySlack(email)
        res.status(200).send('success')
      })
    }
  })
})


function notifySlack(email){
  const body = {text: `${email} joined the mailing list!`}
  got.post(functions.config().slack.url, {
    body,
    json: true
  }).then(res => {
    console.log("slack notified")
  }).catch(console.error)
}

