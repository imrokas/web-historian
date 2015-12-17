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
  'GET': function(req, res){
    handleGET(req, res);
  },
  'POST': function(req, res){
    var url = '';
    var filename;
    req.on('data', function(data){
      url += data;
    }).on('end', function() {
      if(url[0] === '{'){
        url = JSON.parse(url).url;
        console.log(url);
      }else{
        url = url.slice(url.indexOf('=')+1);
      }
      filename = path.join(archive.paths.archivedSites, '/', url);
      fileExists(req, res, filename, function(req, res, filename){
        var url = filename.split('/');
        url = url[url.length-1];
        res.writeHead(302, {'Location': '/' + url});
        res.end();
      }, true);
    });
  }
};

var saveUrl = function(req, res, filename) {
  var url = filename.split('/');
  url = url[url.length - 1];
  fs.appendFile(archive.paths.list, url+'\n', function(err){
    fs.readFile(archive.paths.list, 'utf-8', function(err,data){
      console.log(data);
    });
    if(err) {
      console.log('Failed to append');
    }
    res.writeHead(302, {'Location': '/loading.html'});
    console.log('redirect');
    res.end();
  });
};

var handleGET = function(req, res){
  var pathname = url.parse(req.url).pathname;
  pathname = pathname === '/' ? pathname + 'index.html' : pathname;
  var pathInfo = path.parse(pathname);
  if(pathInfo.ext === '.html' || pathInfo.ext === '.css'){
    //looking for the file in public folder
    var filename = path.join(archive.paths.siteAssets, pathname);
    fileExists(req, res, filename, getContent);
  }else if(pathInfo.ext === '.ico'){
    // res.writeHead(200, {'Content-Type': 'image/x-icon'});
    res.end();
  }else{
    var filename = path.join(archive.paths.archivedSites, pathname);
    fileExists(req, res, filename, getContent);
  } 
};
var fileExists = function(req, res, filename, callback, postFlag){
  fs.access(filename, fs.F_OK, function(err){
    if(postFlag && err) {
      saveUrl(req, res, filename);
    }else if(err && !postFlag){
      // Call error return function
      error(req, res, "file not found");
    }else if(!err){
      console.log('callback to getContent, ', filename);
      // pass filename to callback
      callback(req, res, filename);
    }
  });
};
var getContent = function(req, res, filename){
  fs.readFile(filename, 'utf-8', function(err, data){
    if(err){
      error(req, res, 'cannot read file');
    }
    res.writeHead(200, {'Content-Type': mimeTypes[path.parse(filename).ext]});
    res.end(data);
  });
};
var error = function(req, res, message){
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end(message);
};
exports.handleRequest = function (req, res) {
  actions[req.method](req, res);
  // res.end(archive.paths.list);
};
