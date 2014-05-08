var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


exports.readListOfUrls = function(callback){
  //read the sites.txt list of url
  //callback on array of urls
  fs.readFile(this.paths.list, function(err, data) {
    if (err) {
      throw err;
    } else {
      var dataArray = data.toString().split('\n');
      callback(dataArray);
    }
  });
};

exports.isUrlInList = function(url, callback){
  //checks url with list of urls
  //returns true/false
  this.readListOfUrls(function(urlList){
    if (callback) {
      callback(_(urlList).contains(url));
    }
  });
};

exports.addUrlToList = function(url, callback){
  //adds url to list of urls
  fs.appendFile(this.paths.list, url + '\n', callback);
};

exports.isURLArchived = function(url){
  //check if url is archived in sites directory
  //returns true/false
  //we don't need this because integrated into GET requests in request-handler
};

exports.downloadUrls = function(){
  //chron's method
};
