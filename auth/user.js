var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var blacklist = mongoose.model('blacklist', new mongoose.Schema({
  protocol: {
    type: String
  },
  domain: {
    type: String
  },
  path: {
    type: String
  },
  subdomain: {
    type: String
  },
  host: {
    type: String
  },
  tld: {
      type: String
  },
  parentDomain: {
      type: String
  },
  manuallyAdded: {
    type: Boolean, default: false
  }
})
);

var model = mongoose.model('user', new mongoose.Schema({
	email: {type: String, unique: true}
	, password: {type: String}
  , salt: {type: String}
<<<<<<< Updated upstream
	, blacklist: blacklist
=======
	, 
>>>>>>> Stashed changes
}));

exports.getModel = function() {
	return model;
}
