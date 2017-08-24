import {h} from 'hyperapp'

export const PreviousEvents = ({loading, html}) =>
  <div>
    <header className="top-small">
      <pre>{JSON.stringify(html, null, 4)}</pre>
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
        {html && <article oncreate={e => (e.innerHTML = html)} />}
      </article>
    </main>
  </div>
