const bodyParser = require('body-parser');
const cors = require('cors');
var usermodel = require('./user.js').getModel();
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var fs = require('fs');
/* The express module is used to look at the address of the request and send it to the correct function */
var express = require('express');

/* The http module is used to listen for requests from a web browser */
var http = require('http');

/* The path module is used to transform relative paths to absolute paths */
var path = require('path');

/* Creates an express application */
var app = express();

/* Creates the web server */
var server = http.createServer(app);

/* Defines what port to use to listen to web requests */
var port = process.env.PORT
  			? parseInt(process.env.PORT)
  			: 8080;
var dbAddress = process.env.MONGODB_URI || 'mongodb://127.0.0.1/avalon';

function startServer(){
  addSockets();
  function verifyUser(username, password, callback) {
    if(!username) return callback('No username given');
    if(!password) return callback('No password given');
    usermodel.findOne({userName: username}, (err, user) => {
      if(err) return callback('Error connecting to database');
      if(!user) return callback('Incorrect username');
      crypto.pbkdf2(password, user.salt, 10000, 256, 'sha256', (err, resp) => {
        if(err) return callback('Error handling password');
        if(resp.toString('base64') === user.password) return callback(null);
        callback ('Incorrect password');
      })
    });
  }
  function authenticateUser(username, password, callback) {

  	if(!username) return callback('No username given');
  	if(!password) return callback('No password given');
  	usermodel.findOne({userName: username}, (err, user) => {
  		if(err) return callback('Error connecting to database');
  		if(!user) return callback('Incorrect username');
  		crypto.pbkdf2(password, user.salt, 10000, 256, 'sha256', (err, resp) => {
  			if(err) return callback('Error handling password');
  			if(resp.toString('base64') === user.password) return callback(null, user);
  			callback('Incorrect password');
  		});
  	});
  }

  app.use(bodyParser.json({ limit: '16mb' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(session({secret: '操你妈逼的'}));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
  }, authenticateUser));

  passport.serializeUser(function(user,done) {
    done(null, user.id);

  });

  passport.deserializeUser(function(id, done) {
    usermodel.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /* Defines what function to call when a request comes from the path '/' in http://localhost:8080 */
  app.get('/form', (req, res, next) => {

  	/* Get the absolute path of the html file */
  	var filePath = path.join(__dirname, './index.html')

  	/* Sends the html file back to the browser */
  	res.sendFile(filePath);
  });
  app.get('/picture/:username', (req, res, next) => {
    if(!req.user) return res.send('Not logged in!');
    usermodel.findOne({userName: req.params.username}, function(err, user) {
      if(err) return res.send(err);
      try {
        var imageType = user.avatar.match(/^data:image\/([a-zA-Z0-9]*);/)[1];
        var base64Data = user.avatar.split(',')[1];
        var binaryData = new Buffer(base64Data, 'base64')
        res.contentType('image/' + imageType);
        res.end(binaryData, 'binary');
      } catch(ex) {
        console.log(ex);
          res.send(ex);
      }
    });
  });
  app.get('/login', (req, res, next) => {
  	/* Get the absolute path of the html file */
  	var filePath = path.join(__dirname, './login.html')
  	/* Sends the html file back to the browser */
  	res.sendFile(filePath);
  });

  // app.get('/game', (req, res, next) => {
  //   if(!req.user) return res.redirect('/login');
  // 	/* Get the absolute path of the html file */
  // 	var filePath = path.join(__dirname, './game.html')
  //   var fileContents = fs.readFileSync(filePath, 'utf8');
  //   fileContents = fileContents.replace('{{USERNAME}}', req.user.userName);
  // 	/* Sends the html file back to the browser */
  // 	res.send(fileContents);
  // });

  app.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/');
  });

  app.get('/register', (req, res, next) => {
  	var filePath = path.join(__dirname, './register.html')
  	res.sendFile(filePath);
  })

  app.post('/register', (req, res, next) => {
    var newuser = new usermodel(req.body);
    var password = req.body.password;
    //Adding a random string to salt the password width
    var salt = crypto.randomBytes(128).toString('base64');
    newuser.salt = salt;
    // Winding up the crypto hashing lock 10000 times
  	var iterations = 10000;
  	crypto.pbkdf2(password, salt, iterations, 256, 'sha256', function(err, hash) {
  		if(err) {
  			return res.send({error: err});
  		}
  		newuser.password = hash.toString('base64');
  		// Saving the user object to the database
  		newuser.save(function(err) {

  			// Handling the duplicate key errors from database
  			if(err && err.message.includes('duplicate key error') && err.message.includes('userName')) {
  				return res.send({error: 'Username, ' + req.body.userName + ' already taken'});
  			}
  			if(err) {
  				return res.send({error: err.message});
  			}
        passport.authenticate('local', function(err, user) {
          if(err) return res.send({error: err});
          req.logIn(user, (err) => {
            if(err) res.send({error: err});
            res.send({error: null});
          });
        })(req, res, next);
  		});
  	});
  });

  app.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user) {
      if(err) return res.send({error: err});
      req.logIn(user, (err) => {
        if(err) res.send({error: err});
        res.send({error: null});
      });
    })(req, res, next);
  });

  app.get('/', (req, res, next) => {
  	res.send('<a href="/form">Sign Up</a><br><a href="/login">Login</a>');
  });

  app.post('/import.js')



  /* Defines what function to all when the server recieves any request from http://localhost:8080 */
  server.on('listening', () => {

  	/* Determining what the server is listening for */
  	var addr = server.address()
  		, bind = typeof addr === 'string'
  			? 'pipe ' + addr
  			: 'port ' + addr.port
  	;

  	/* Outputs to the console that the webserver is ready to start listenting to requests */
  	console.log('Listening on ' + bind);
  });

  /* Tells the server to start listening to requests from defined port */
  server.listen(port);
}

mongoose.connect(dbAddress, startServer)
