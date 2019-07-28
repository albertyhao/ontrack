var mongoose = require('mongoose');

var model = mongoose.model('blacklist', new mongoose.Schema({
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

exports.getModel = function() {
	return model;
}


