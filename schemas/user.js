var mongoose = require('mongoose');

var model = mongoose.model('user', new mongoose.Schema({
	firstName: {type: String}
	, lastName: {type: String}
	, userName: {type: String, unique: true}
	, emailAddress: {type: String, unique: true}
	, password: {type: String}
	, salt: {type: String}
	, blacklist: [{
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
	}]
}, {
	collection: 'user', autoCreate: false
}));

exports.getModel = function() {
	return model;
}
