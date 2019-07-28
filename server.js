var express = require('express')
	, path = require('path')
	, bodyParser = require('body-parser')
	, http = require('http')
	, async = require('async')
	, fs = require('fs')
  , mongoose = require('mongoose')
  , packtrackSchema = require("./packtrackSchema.js").getModel()
	, crypto = require('crypto')
	, passport = require('passport')
	, LocalStrategy = require('passport-local')
	, flash = require('express-flash')
	, session = require('express-session')
	, cookieParser = require('cookie-parser')
	, MongoDBStore = require('connect-mongodb-session')
	, fs = require('fs')
;

var app = express()
	, port = parseInt(process.env.PORT || '8080')
	, server = http.createServer(app)
  ,dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1/ontrack'
;

mongoose.connect(dbUri, function(err){
  if(err){
    return console.log(err);
  }
  console.log('Connected to database');
  var server = http.createServer(app)
  app.set('trust proxy',true );
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', (req, res, next) => {
  	var filePath = path.join(__dirname, '/1px.png')
  	res.sendFile(filePath);
    var packtrack = new packtrackSchema({
      url: req.query.url,
      username: req.hostname,
      image: undefined,
      timestamp: new Date(),
      ip: req.ip
    })
    packtrack.save()
  })
  server.on('listening', () => {
  	var addr = server.address()
  		, bind = typeof addr === 'string'
  			? 'pipe ' + addr
  			: 'port ' + addr.port
  	;
  	console.log('Listening on ' + bind);
  });

  server.listen(port);

})

app.use(function(err, req, res, next) {
  res.status(err.status ? 500 : 404);
  res.send(err);
});

console.log('Listening to port');
server.on('listening', () => {
  console.log('testing');
  var addr = server.address()
    , bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
  ;
console.log('Listening on ' + bind);
});
server.listen(port);
