import {h} from 'hyperapp'

export const PreviousEvents = ({html, a}) =>
  <div>
    <div className="top-small">
      <div className="previous-events-title-container">
        <h1 className="previous-events-page-title">Previous Events</h1>
      </div>
    </div>
    <div className="btm-small">
      <div className="previous-events-markdown">
        <aside onupdate={e => (e.innerHTML = html)} />
      </div>
    </div>
  </div>
