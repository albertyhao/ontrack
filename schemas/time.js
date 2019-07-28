var mongoose = require('mongoose');

var model = mongoose.model('time', new mongoose.Schema({
  secs: {type: Number},
  //user: {type: String},
  date: {type: Date},
  website: {type: String},
  keywords: [{type: String}]
}, {
	collection: 'time', autoCreate: false
}));

exports.getModel = function() {
	return model;
}
