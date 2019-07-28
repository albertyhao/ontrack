var mongoose = require('mongoose');

var model = mongoose.model('browsingHistory', new mongoose.Schema({
  username: {
    type: String,
  },
  url: {
    type: String,
  },
  image: {
    type: Buffer,
  },
  timestamp: {
    type: Date,
  },
  ip: {
    type: String,
  }

})
);

exports.getModel = model;
