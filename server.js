const browserSync = require('browser-sync').create()
const url = require('url')
const fs = require('fs')
const path = require('path')

const defaultFile = 'index.html'
const folder = path.resolve(__dirname, "./")

browserSync.init({
  files: ['css/*.css', 'bundle.js', 'index.html'],
  server: {
    baseDir: './',
    middleware: function(req, res, next) {
      let fileName = url.parse(req.url)
      fileName = fileName.href.split(fileName.search).join('')
      const fileExists = fs.existsSync(folder + fileName)
      if (!fileExists && fileName.indexOf('browser-sync-client') < 0) {
        req.url = '/' + defaultFile
      }
      return next()
    },
  },
})


