import {h} from 'hyperapp'
import {Main} from './Main'
import {PreviousEvents} from './PreviousEvents'

export default [
  [
    '/',
    (state, actions) =>
      <Main state={state} add={actions.add} setValue={actions.setValue} />,
  ],
  [
    '/previous-events',
    (state, actions) =>
      <PreviousEvents html={state.html} loading={state.showSpinner} />,
  ],
  ['*', () => <div className='not-found'>404</div>]
]


