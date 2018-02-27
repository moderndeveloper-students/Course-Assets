'use strict';﻿
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    jsonfile = require('jsonfile'),
    Busboy = require('busboy'),
    path = require('path'),
    os = require('os'),
    fs = require('fs');

gulp.task('connect', function () {
    connect.server({
        root: './',
        port: 8000,
        middleware: function (connect, opt) {
            return [
              function middleware(req, res, next) {
                  // urls to respond to
                  let urls = {
                      '/response.json': __dirname + '/chapter8/response.json',
                      '/signin': __dirname + '/chapter8/loginresponse.json',
                      '/get_request': __dirname + '/chapter8/getresponse.json',
                      '/get_request?test_data': __dirname + '/chapter8/getresponse.json',
                      '/create_account': __dirname + '/chapter8/createaccount.json'
                  };
                  let match = false;

                  function respond(jsonFileUrl) {
                      // set json response header
                      res.setHeader('Content-type', 'application/json');
                      jsonfile.readFile(jsonFileUrl, function (err, obj) {
                          if (err) { console.log(err); }

                          res.writeHead(200, { 'Connection': 'close', 'Access-Control-Allow-Origin': '*' });

                          // stringify json from .json file
                          res.end(JSON.stringify(obj));
                      });
                  }

                  if (req.url === '/upload') {
                      let busboy = new Busboy({ headers: req.headers });

                      busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                          let destinationFile = path.join(__dirname + '/uploadedFiles', '/', filename);

                          if (fs.existsSync(destinationFile)) {
                              // delete file if it exists
                              fs.unlinkSync(destinationFile);
                          }

                          // create uploaded file in filesystem
                          file.pipe(fs.createWriteStream(destinationFile));
                      });

                      busboy.on('finish', function () {
                          match = true;
                          respond(__dirname + '/chapter8/uploadresponse.json');
                      });

                      return req.pipe(busboy);
                  }

                  Object.keys(urls).forEach(function (url) {
                      if (req.url === url) {
                          match = true;
                          respond(urls[url]);
                      }
                  });

                  if (!match) {
                      next();
                  }
              }
            ];
        }
    });
});

gulp.task('setup', function () {
    // create test file for uploading
    require('child_process').exec('fsutil file createnew uploadFile 1073741824', function (err) {
        if (err) return console.log(err);
        console.log('Test upload file created');
    });

    // create uploads directory
    let destination = __dirname + '/uploadedFiles';
    if (!fs.existsSync(destination)) {
        // create upload directory if doesn't exist
        fs.mkdirSync(destination, 0o0777);
        console.log('Upload directory created');
    }
});
