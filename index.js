import {h, app} from 'hyperapp'
import axios from 'axios'
import {links, addMemberUrl} from './config'
import {
  selectValue,
  isEmail,
  firstUpper
} from './helpers'


const title = () => (
  <h1>Meetup for <u>web developers</u><br />and sausage lovers</h1>
);

const socialMediaLinks = () => (
  <div className="social-media">
    {Object.keys(links).map(key => (
      <a href={links[key]} target="_blank">
        <img
          className={`social-media-icon ${key}`}
          src={`images/${key}.svg`}
          alt={firstUpper(key)}
        />
      </a>
    ))}
  </div>
);

const logo = () => (
  <div className="top-logo">
    <img
      className="animated bounceInDown"
      src="images/logo.svg"
      alt="Web Dev &amp; Sausages"
    />
  </div>
)

app({
  state: {
    value: '',
    isValid: false,
    showWarning: false,
    showSuccess: false,
    showError: false
  },
  view: (state, {setValue, add}) => (
    <div>
      <div className="top-bg" />
      <div className="bottom-bg">
        {title()}
        <span className="next-meetup">
          <span className="date">17.8.2017</span><br />
          Web Dev & Sausages vol.4
          <br />
          @ <a href="http://wapice.com/" target="_blank">
            <img
              className="wapice-logo"
              src="images/wapice-logo.svg"
              alt="Wapice"
            />
          </a>
          <a class="sign-up-link" href="https://ssl.eventilla.com/webdevandsausagesvol4">&gt; Sign up &amp; more info &lt;</a>
        </span>
        <h1 className="mailing-list-title">Join our mailing list <br />
         to hear about upcoming events:</h1>
        <div className="mailing-list-input">
          <input
            autofocus
            type="text"
            value={state.value}
            oninput={e => setValue(selectValue(e))}
            onkeyup={e => e.keyCode === 13 ? add() : ''}
            className={state.isValid ? 'valid' : 'invalid'}
          />
          <button onclick={add} disabled={state.isValid === false}>
            +
          </button>
        </div>
        {state.showSuccess && <h1>Cool, now you are in the loop!</h1>}
        {state.showError && <h1>Oh this is embarrassing, something went wrong. Try again.</h1>}
        {socialMediaLinks()}
      </div>
      {logo()}
    </div>
  ),
  actions: {
    setValue: (state, actions, value) => ({
      value,
      isValid: isEmail(value)
    }),
    add: (state, actions) => {
      actions.hideErrorMessage()
      if (state.isValid) {
        return axios.post(addMemberUrl, {email: state.value})
          .then(res => {
            if (res.status === 200) {
              actions.showSuccessMessage()
            } else {
             actions.showErrorMessage()
           }
        })
      }
    },
    showSuccessMessage: () => ({showSuccess: true}),
    showErrorMessage: () => ({errorMessage: true}),
    hideErrorMessage: () => ({errorMessage: false})
  }
})
