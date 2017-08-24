import {isEmail} from './helpers'

export default {
  setValue: (state, actions, value) => ({
    value,
    isValid: isEmail(value),
  }),
    add: (state, actions) => {
    actions.request.post({resource: 'members', payload: {email: state.value}})
  },
    setHtml: (state, actions, {html}) => ({html}),
    showSuccessMessage: () => ({showSuccess: true}),
    showErrorMessage: () => ({errorMessage: true}),
    hideErrorMessage: () => ({errorMessage: false}),
    toggleSpinner: state => ({showSpinner: !state.showSpinner}),
}
