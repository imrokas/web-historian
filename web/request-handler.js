var path = require('path');
var fs = require('fs');
var url = require('url');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css'
}
var actions = {
  'GET': function(request, response){

  },
  'POST': function(request, repsonse){

  }
}
var handlePaths = function(req, res){
  var pathname = url.parse(req.url).pathname;
  pathname = pathname === '/' ? pathname + 'index.html' : pathname;
  var pathInfo = path.parse(pathname);
  if(pathInfo.ext === '.html' || pathInfo.ext === '.css'){
    //looking for the file in public folder
    var filename = path.join(archive.paths.siteAssets, pathname);
    fileExists(req, res, filename, getContent);
  }else if(pathInfo.ext !== '.ico'){
    var filename = path.join(archive.paths.archivedSites, pathname);
    fileExists(req, res, filename, getContent);
  } 
}
var fileExists = function(req, res, filename, callback){
  fs.access(filename, fs.F_OK, function(err){
    if(err){
      // Call error return function
      error(req, res, "file not found");
    }
    // pass filename to callback
    callback(req, res, filename);
  })
}
var getContent = function(req, res, filename){
  fs.readFile(filename, 'utf-8', function(err, data){
    if(err){
      error(req, res, 'cannot read file');
    }
    res.writeHead(200, {'Content-Type': mimeTypes[path.parse(filename).ext]});
    res.end(data);
  });
}
var error = function(req, res, message){
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end(message);
}
exports.handleRequest = function (req, res) {
  handlePaths(req, res);
  // res.end(archive.paths.list);
};
