
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , config = require('./config')
  , routes = require('./routes')
  , user = require('./routes/user')
  , github = require('./routes/github')
  , api = require('./routes/api')
  , db = require('./db')
  , github_oauth = require('./github_oauth')
  , expressValidator = require('express-validator')
  , oauth = require('./oauth');

var app = express();

// set Expire Header
app.use(function(req, res, next) {
  if (/(\.css|\.png|\.jpg|\.jpeg|\.js)$/.test(req.url)) {
    res.set({
       "age": "348759",
       "Cache-Control": "max-age=315360000",
       "Expires": "Sat, 06 May 2023 12:28:31 GMT"
    });
  }
  next();
});

app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('some secret'));
  app.use(express.cookieSession());
  app.use(app.router);
  app.use(require('less-middleware')(path.join(__dirname, '/public')));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/logout', function(req, res) {
  req.session.user = null;
  console.log(req.session);
  res.redirect('/');
});
app.get('/github', github.index);

app.get('/oauth_callback', oauth.callback);
app.get('/github_callback', github_oauth.callback);
app.get('/users', user.list);

app.post('/rep', function(req, res) {
   var user = {
     id: req.body.user_id,
     repoUrl: req.body.repoUrl
   };
   db.saveUser(user, function(err) {
     if (!err) {
       res.status(200);
       res.send({status: 'success'});
     } else {
       res.status(500);
       res.send(err);
     }
   });
});

//
// DNSPod API
//
app.get(/^\/dnspod\/(\w+)(\/(\w+))?$/, function(req, res) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');

  var method = req.params[0];
  var options = {
    domain_id: req.params[2],
    method: method
  }
  var validate = api.validator(method, req, res, options);
  if (validate) {
    res.send.apply(res, validate);
    return;
  }
  if (api[method]) {
    api[method].call(this, req, res, options);
  } else {
    res.send(404, 'method not exist');
  }
});

//
// GitHub API
//

app.post('/github/new', github.new);




http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
