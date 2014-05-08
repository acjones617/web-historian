var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');
var _ = require('underscore');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var pathName = url.parse(req.url).pathname;

  if (pathName === '/') {
    if (req.method === 'GET') {
      fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
        if (err) {
          throw err;
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data);
        }
      });
    }
  } else if (pathName === '/styles.css') {
    if (req.method === 'GET') {
      fs.readFile(archive.paths.siteAssets + pathName, function(err, data) {
        if (err) {
          throw err;
        } else {
          res.writeHead(200, {'Content-Type': 'text/css'});
          res.end(data);
        }
      });
    }
  } else {
    if (req.method === 'GET') {
      fs.readFile(archive.paths.archivedSites + '/' + pathName, function(err, data) {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data);
        }
      });
    }
  }

  if (req.method === 'POST') {
    var msg = '';
    req.on('data', function(data){
      msg += data;
      if (msg.length > 1e6){
        req.connection.destroy();
      }
    });
    req.on('end', function(){

      fs.readFile(archive.paths.list, function(err, data) {
        if (err) {
          throw err;
        } else {

          var dataArray = data.toString().split('\n');

          msg = msg.split('=')[1];
          if (_(dataArray).contains(msg)){
            // if the file exists in sites folder
            fs.readFile(archive.paths.archivedSites + '/' + msg, function(err, data) {
              if (err) {
                // else direct to loading page
                fs.readFile(archive.paths.siteAssets + '/loading.html', function(err, data) {
                  if (err) {
                    throw err;
                  } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                  }
                });
              } else {
                // append filename to url,
                res.setHeader('Location', '/' + msg);
                console.log(data);
                // and redirect
                res.writeHead(302, {'Content-Type': 'text.html'});
                res.end();
              }

            });
          } else {
            // direct to loading page and append sitename to sites.txt
            //
          }

        }
      });
    });

//  res.end(archive.paths.list);
  }
};
