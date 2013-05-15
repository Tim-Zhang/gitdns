var request = require('request');
var config = require('./config');
var db = require('./db');
var _ = require('underscore');

var GITHUB = config.github;
var URI = config.github.uri;

exports.callback = function(req, res) {
  var code = req.query.code;
  var params = {
    uri: URI.accesstoken,
    form: {
      code: code,
      client_id: GITHUB.key,
      client_secret: GITHUB.secret,
    },
    headers: {Accept: 'application/json'}
  };
  request.post(params, function(error, response, body){
    body = JSON.parse(body);
    req.session.github || (req.session.github = {});
    req.session.github.access_token = body.access_token;
    // test
    //res.send(body);
    exports.getUser(req, res);
  });
}

exports.getUser = function(req, res) {
  var session = req.session
  var access_token = session.github.access_token;
  var params = {
    uri: URI.user,
    qs: {access_token: access_token}, 
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17'
    }
  };
  request(params, function(error, response, body){
    body = JSON.parse(body);
    if (body && body.login) {
      _.extend(req.session.github, body);
      res.redirect('/github');
    } else {
      res.send(body);
    }
  });
}

exports.createRep = function(req, res) {

}
