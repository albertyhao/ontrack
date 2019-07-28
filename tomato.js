var mongoose = require('mongoose');
var timeModel = require('./schemas/time.js').getModel();
var url = require('url');

const dbUri = 'mongodb://heroku_qjgzdh28:pu9dvkmtftdmbqqqpq7le4v8dh@ds161285.mlab.com:61285/heroku_qjgzdh28';

mongoose.connect(dbUri, createKeywordPareto);

function createKeywordPareto() {
  timeModel.find({}).select('secs website').exec((err, data) => {
    var timeWebsites = {};
    data.forEach(item => {
      const seconds = item.secs;
      const domain = url.parse(item.website).host;
      console.log(domain, seconds);
      if (!timeWebsites[domain]) {
        timeWebsites[domain] = seconds;
      }
      else {
        timeWebsites[domain] += seconds;
      }
    });
    console.log(timeWebsites);
    var sortedKeys = Object.keys(timeWebsites).sort((a,b) => {
      return timeWebsites[a] = timeWebsites[b]?-1:1
    })
    console.log(sortedKeys);
  })
}
