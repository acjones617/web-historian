var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers.js');
var url = require('url');
var fs = require('fs');
var _ = require('underscore');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var pathName = url.parse(req.url).pathname;

  if (req.method === 'GET') {
    if (pathName === '/') {
      http.serveAssets(res, archive.paths.siteAssets, '/index.html', 'text/html');
    } else if (pathName === '/styles.css') {
      http.serveAssets(res, archive.paths.siteAssets, pathName, 'text/css');
    } else {
      http.serveAssets(res, archive.paths.archivedSites, '/' + pathName, 'text/html');
    }
  }

  if (req.method === 'POST'){
    var msg = '';
    req.on('data', function(data){
      msg += data;
      if (msg.length > 1e6){
        req.connection.destroy();
      }
    });
    req.on('end', function(){
      msg = msg.split('=')[1];
      archive.isUrlInList(msg, function(truthy){
        if (truthy){
          http.redirectToArchive(res, msg);
        } else {
          archive.addUrlToList(msg);
          http.serveAssets(res, archive.paths.siteAssets, '/loading.html', 'text/html', 302);
        }
      });
    });
  }
};
