This is the [Web Dev And Sausages homepage](www.webdevandsausages.org) for a meetup in Tampere, Finland for web developers and sausages lovers.

### Contributions

We welcome PRs.

If you are a WD&S presenter who is updating information about your talk in the [Previous Events](https://www.webdevandsausages.org/previous-events) page (thanks!), all you need to do is update `events.md`.
If you have addition materials (pdfs, markdown, code), please make a PR to our [archive](https://github.com/webDevAndSausages/archivedMeetupStuff) and link to it from `events.md`.

For other code contributions to the frontend, `npm start` will get you started. Make sure you run `npm run build` before making your PR to minify the bundle. In terms of code style, running the code through [prettier](https://github.com/prettier/prettier) with
`--no-semi --single-quote --bracket-spacing false --trailing-comma es5` flags, will do the job.

If you want to fix or add something to the firebase functions and/or database, you will need to install the firebase-cli and create your own [firebase project](https://firebase.google.com/) to test out your code. You may need to add configuration to
your firebase instance with `firebase:config:set` if you want to check the slack integration
or google spreadsheet functionality.

```
{
  "slack": {
    "url": YOUR_URL
  },
  "googleapi": {
    "client_secret": YOUR_SECRET,
    "client_id": YOUR_ID
  }
}

```

### Ideas for improvement

  - link/page for event pictures
  - more detail in the Previous Events page
  - feedback/suggestions input
  - improvements to mobile
  - offline support / service worker
  - improve UI design
