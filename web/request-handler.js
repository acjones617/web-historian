var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var pathName = url.parse(req.url).pathname;
  if (pathName === '/') {
    if (req.method === 'GET') {
      fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
        //console.log('GETTINg Here', err, JSON.stringify(data.toString()));
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
        // console.log('GETTINg Here', err, JSON.stringify(data.toString()));
        if (err) {
          throw err;
        } else {
          res.writeHead(200, {'Content-Type': 'text/css'});
          res.end(data);
        }
      });
    }
  }



//  res.end(archive.paths.list);
};
