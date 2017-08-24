import 'babel-polyfill'
import {h, app} from 'hyperapp'
import {Router} from '@hyperapp/router'
import marked from 'marked'
import Requests from './mixins/Requests'
import view from './view'
import actions from './actions'
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
  view,
  actions,
  events: {
    route: (s, actions, data) => {
      if (data.match.includes('previous-events')) {
        actions.request.get({resource: 'events', process: marked})
      }
    },
  },
  mixins: [
    Router,
    Requests()
  ],
})


