var mongoose = require('mongoose');
var blacklist = require('./PackTrack/blacklist.js');
var configs = require('./config.js');
var model = require('./blacklistSchema.js').getModel();

function importStuff(){
    var badSites = blacklist.badSites;
    function importNext(){
        if(badSites.length === 0) return mongoose.disconnect();
        var badSite = new model(badSites.pop());
        badSite.save(function(err){
            console.log(err || 'success');
            importNext();
        })
    }
importNext();
}

mongoose.connect(configs.dbUri, importStuff);