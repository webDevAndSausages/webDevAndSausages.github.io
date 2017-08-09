import {h} from 'hyperapp'
import {links} from './config'
import {selectValue, firstUpper} from './helpers'

const Title = () =>
  <h1>
    Meetup for <u>web developers</u>
    <br />and sausage lovers
  </h1>

const PreviousEventsLink = () =>
  <div className="previous-events">
    <a href="previous-events" className="previous-events-link">
      Previous Events
    </a>
  </div>

const SocialMediaLinks = () =>
  <div className="social-media">
    {Object.keys(links).map((key, i) =>
      <a key={i} href={links[key]} target="_blank">
        <img
          className={`social-media-icon ${key}`}
          src={`images/${key}.svg`}
          alt={firstUpper(key)}
        />
      </a>
    )}
  </div>

const Logo = () =>
  <div className="top-logo">
    <img
      className="animated bounceInDown"
      src="images/logo.svg"
      alt="Web Dev &amp; Sausages"
    />
  </div>

export const Main = ({state, add}) =>
  <div>
    <header className="top-bg" />
    <main className="bottom-bg">
      <Title />
      <span className="next-meetup">
        <span className="date">17.8.2017</span>
        <br />
        Web Dev & Sausages vol.4
        <br />
        @{' '}
        <a href="http://wapice.com/" target="_blank">
          <img
            className="wapice-logo"
            src="images/wapice-logo.svg"
            alt="Wapice"
          />
        </a>
        <a
          className="sign-up-link"
          href="https://ssl.eventilla.com/event/m4Pdo"
        >
          &gt; Sign up & more info &lt;
        </a>
      </span>
      <h1 className="mailing-list-title">
        Join our mailing list <br />
        to hear about upcoming events:
      </h1>
      <aside className="mailing-list-input">
        <input
          type="text"
          value={state.value}
          oninput={e => setValue(selectValue(e))}
          onkeyup={e => (e.keyCode === 13 ? add() : '')}
          className={state.isValid ? 'valid' : 'invalid'}
        />
        <button onclick={add} disabled={state.isValid === false}>
          {state.showSpinner ? <div className="spinner" /> : '+'}
        </button>
      </aside>
      {state.showSuccess && <h1>Cool, now you are in the loop!</h1>}
      {state.showError &&
      <h1>Oh this is embarrassing, something went wrong. Try again.</h1>}
      <SocialMediaLinks />
      <PreviousEventsLink />
    </main>
    <Logo />
  </div>