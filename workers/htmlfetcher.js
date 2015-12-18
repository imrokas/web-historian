var archive = require('../helpers/archive-helpers');
var CronJob = require('cron').CronJob;
var _ = require('underscore');
var fs = require('fs');


module.exports = function(){
  var job = new CronJob('59 * * * * *', function(){
    archive.readListOfUrls(function(urls){
      // var urlsList = [];
      _.each(urls, function(url){
        archive.isUrlArchived(url, function(is){
          if(!is){
            archive.downloadUrls([url]);
          }
        });
      });
      fs.writeFile(archive.paths.list, '', function(err){
        if(err){
        }
      })
    });
  }, null, true, 'America/Los_Angeles', null, true);
  console.log('starting cron job');
}




