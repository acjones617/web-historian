var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, pathName, contentType, status) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  fs.readFile(asset + pathName, function(err, data) {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(status || 200, {'Content-Type': contentType});
      res.end(data);
    }
  });
};

// As you progress, keep thinking about what helper functions you can put here!

exports.redirectToArchive = function(res, url){
  fs.readFile(archive.paths.archivedSites + '/' + url, function(err, data) {
    if (err) {
      // else direct to loading page
      this.serveAssets(res, archive.paths.siteAssets, '/loading.html', 'text/html', 302);
    } else {
      // append filename to url,
      res.setHeader('Location', '/' + url);
      // and redirect
      res.writeHead(302, {'Content-Type': 'text.html'});
      res.end();
    }

  }.bind(this));
};
