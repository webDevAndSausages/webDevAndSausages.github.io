This is the [Web Dev And Sausages homepage](www.webdevandsausages.org) for a meetup in Tampere, Finland for web developers and sausages lovers.

### Contributions

We welcome PRs.

If you are a WD&Ss presenter updating information about your talk (thanks!) in the [Previous Events](https://www.webdevandsausages.org/previous-events) page,
all you need to do is update `events.md`. If you have addition materials to add, please make a PR to our [archive](https://github.com/webDevAndSausages/archivedMeetupStuff) and
link to it in `events.md`.

For other code contributions to the frontend, you can `npm start` should be enough and make sure you run `npm run build` before making your PR to
minify the bundle. In terms of code style, running the code through [prettier](https://github.com/prettier/prettier) with
`--no-semi --single-quote --bracket-spacing false --trailing-comma es5` flags, will do the job.

If you want to fix or add something to the firebase functions and db, you will need to install the firebase-cli and create your own
firebase project to test out your code. You will also need to run `firebase:config:set` if you want to check the slack integration
or google spreadsheet function.

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
