import {
  ADD_MEMBER_URL,
  PREVIOUS_EVENTS_URL
} from '../consts'
import axios from 'axios'

const urls = {
  members: () => ADD_MEMBER_URL,
  events: () => PREVIOUS_EVENTS_URL,
}

const request = method => async ({resource, payload = {}}) => {
  const hasPayload = method === 'put' || method === 'post'
  const url = urls[resource]()

  let request = hasPayload ? axios[method](url, payload) : axios[method](url, {responseType: 'text'})

  try {
    const {status, data} = await request
    return {status, data}
  } catch (error) {
    return {error}
  }
}

const get = request('get')
const post = request('post')

export default () => emit => ({
  actions: {
    request: {
      get: async (state, actions, {resource, process}) => {
        actions.toggleSpinner()
        const {data} = await get({resource})

        if (data) {
          const html = await process(data)

          actions.toggleSpinner()
          actions.setHtml({html})
        } else {
          actions.toggleSpinner()
          actions.setHtml('<h2>An error occurring loading the markdown</h2>')
        }
      },

      post: async (state, actions, {resource, payload}) => {
        actions.hideErrorMessage()

        if (state.isValid) {
          actions.toggleSpinner()

          const {status} = await post({resource, payload})

          if (status === 200 || status === 201) {
            actions.showSuccessMessage()
          } else {
            actions.showErrorMessage()
          }
          actions.toggleSpinner()
        }
      },
    },
  },
})
