import {h} from 'hyperapp'

export const PreviousEvents = ({html, loading, a}) =>
  <div>
    <header className="top-small">
      <div className="previous-events-title-container">
        <h1 className="previous-events-page-title">Previous Events</h1>
      </div>
    </header>
    <main className="btm-small">
      <article className="previous-events-markdown">
        {loading &&
          <div className="markdown-loading">
            <div className="spinner"/>
          </div>
        }
        <article onupdate={e => (e.innerHTML = html)} />
      </article>
    </main>
  </div>
