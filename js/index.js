import {h, app, Router} from 'hyperapp'
import axios from 'axios'
import marked from 'marked'
import {Main} from './Main'
import {PreviousEvents} from './PreviousEvents'
import {addMemberUrl} from './config'
import {isEmail} from './helpers'
import './startup'

app({
  state: {
    value: '',
    isValid: false,
    showWarning: false,
    showSuccess: false,
    showError: false,
    showSpinner: false,
    html: '',
  },
  view: [
    ['/', (state, actions) => <Main state={state} add={actions.add} />],
    [
      '/previous-events',
      (state, actions) =>
        <PreviousEvents
          html={state.html}
          loading={state.showSpinner}
          a={actions}
        />,
    ],
    ['*', (state, actions) => actions.router.go('/')],
  ],
  actions: {
    setValue: (state, actions, value) => ({
      value,
      isValid: isEmail(value),
    }),
    add: (state, actions) => {
      actions.hideErrorMessage()

      if (state.isValid) {
        actions.toggleSpinner()

        return axios
          .post(addMemberUrl, {email: state.value})
          .then(res => {
            if (res.status === 200 || res.status === 201) {
              actions.showSuccessMessage()
            } else {
              actions.showErrorMessage()
            }
            actions.toggleSpinner()
          })
          .catch(() => {
            actions.showErrorMessage()
            actions.toggleSpinner()
          })
      }
    },
    setHtml: (state, actions, data) => ({html: data}),
    showSuccessMessage: () => ({showSuccess: true}),
    showErrorMessage: () => ({errorMessage: true}),
    hideErrorMessage: () => ({errorMessage: false}),
    toggleSpinner: state => ({showSpinner: !state.showSpinner}),
  },
  events: {
    route: (s, actions, data) => {
      if (data.match.includes('previous-events')) {
        actions.toggleSpinner()
        const dev = () => window.location.host.startsWith('localhost')
        const rootUrl = dev()
          ? '://localhost:3000'
          : 's://www.webdevandsausages.org'

        return axios(`http${rootUrl}/events.md`, {responseType: 'text'})
          .then(res => marked(res.data))
          .then(html => {
            actions.toggleSpinner()
            actions.setHtml(html)
          })
          .catch(e => {
            actions.toggleSpinner()
            actions.setHtml('<h2>An error occurring loading the markdown</h2>')
          })
      }
    },
  },
  mixins: [Router],
})
