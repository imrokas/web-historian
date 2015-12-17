var archive = require('../helpers/archive-helpers');
var CronJob = require('cron').CronJob;
var _ = require('underscore');
var fs = require('fs');


module.exports = function(){
  var job = new CronJob('* * * * *', function(){
    archive.readListOfUrls(function(urls){
      _.each(urls, function(url){
        fs.appendFile(archive.paths.archivedSites + '/downloading.txt', url);
        archive.isUrlArchived(url, function(is){
          if(!is){
            archive.downloadUrls(url);
          }
        });
      });
      fs.writeFile(archive.paths.list, '', function(err){
        if(err){
        }
      })
    });
  }, null, true, 'America/Los_Angeles');
  job.start();
  console.log('starting cron job');
}




