var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('http-request');
var Q = require("q");

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

var readFile = Q.denodeify(fs.readFile);
var readdir = Q.denodeify(fs.readdir);


exports.readListOfUrls = function(){
  //read the sites.txt list of url
  //callback on array of urls
  var promise = readFile(this.paths.list)
    .then(function(content) {
      var dataArray = content.toString().split('\n');
      return dataArray;
    }
    .catch(function(err) {
      throw err;
    }));
  return promise;
};

exports.isUrlInList = function(url){
  //checks url with list of urls
  //returns true/false
  return _(this.readListOfUrls()).contains(url);
};

exports.addUrlToList = function(url,){
  //adds url to list of urls
  fs.appendFile(this.paths.list, url + '\n');
};

exports.isURLArchived = function(url, callback){
  //check if url is archived in sites directory
  //returns true/false

  var promise = readdir(this.paths.archiveSites)
    .then(function(content) {
      return _(content).contains(url);
    })
    .catch(function(err) {
      return err;
    });

  return promise;
};

exports.downloadUrls = function(){
  //chron's method
  this.readListOfUrls()
    .then(function(urlList){
      _(urlList.slice(0, urlList.length - 1)).each(function(url){
        return this.isURLArchived(url);
      })
      .then(function(truthy){
        if (!truthy){
          httpRequest.get({
            url: url,
            progress: function (current, total) {
              console.log('downloaded %d bytes from %d', current, total);
            }
          }, this.paths.archivedSites + '/' + url, function(err,response){
            if (err) {
              console.log(err);
            }
          });
        }
      }.bind(this));
    }.bind(this));
};


// exports.readListOfUrls = function(callback){
//   //read the sites.txt list of url
//   //callback on array of urls
//   fs.readFile(this.paths.list, function(err, data) {
//     if (err) {
//       throw err;
//     } else {
//       var dataArray = data.toString().split('\n');
//       callback(dataArray);
//     }
//   });
// };

// exports.isUrlInList = function(url, callback){
//   //checks url with list of urls
//   //returns true/false
//   this.readListOfUrls(function(urlList){
//     if (callback) {
//       callback(_(urlList).contains(url));
//     }
//   });
// };

// exports.addUrlToList = function(url, callback){
//   //adds url to list of urls
//   fs.appendFile(this.paths.list, url + '\n', callback);
// };

// exports.isURLArchived = function(url, callback){
//   //check if url is archived in sites directory
//   //returns true/false
//   fs.readdir(this.paths.archivedSites, function(err, files) {
//     callback(_(files).contains(url));
//   });

// };

// exports.downloadUrls = function(){
//   //chron's method
//   this.readListOfUrls(function(urlList){
//     _(urlList.slice(0, urlList.length - 1)).each(function(url){
//       this.isURLArchived(url, function(truthy){
//         if (!truthy){
//           httpRequest.get({
//             url: url,
//             progress: function (current, total) {
//               console.log('downloaded %d bytes from %d', current, total);
//             }
//           }, this.paths.archivedSites + '/' + url, function(err,response){
//             if (err) {
//               console.log(err);
//             }
//           });
//         }
//       }.bind(this));
//     }.bind(this));
//   }.bind(this));
// };
