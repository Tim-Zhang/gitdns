var request = require('request');
var config = require('./config');
var db = require('./db');
var _ = require('underscore');
var async = require('async');
var S = require('string');

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

  request_github(access_token, URI.user, 'GET', {}, function(error, response, body){
    console.log(body);
    //body = JSON.parse(body);
    if (body && body.login) {
      _.extend(req.session.github, body);
      res.redirect('/github');
    } else {
      res.send(body);
    }
  });
}

exports.createRep = function(access_token, params, callback) {
  request_github(access_token, URI.rep, 'POST', params, function(error, response, body) {
    var err = null;
    if (response.statusCode >= 300) {
      err = body;
    }
    callback(err, body);
  });
};

exports.createHook = function(access_token, uri, params, callback) {
  request_github(access_token, uri, 'POST', params, function(error, response, body) {
    var err = null;
    if (response.statusCode >= 300) {
      err = body;
    }
    callback(err, body);
  });
};

exports.createCollaborator = function(access_token, uri, params, callback) {
  request_github(access_token, uri, 'PUT', params, function(error, response, body) {
    var err = null;
    body || (body = {message: 'success'});
    if (response.statusCode >= 300) {
      err = body;
    }
    callback(err, body);
  });
};

var request_github = function(access_token, uri, method, params, callback) {
  var options = {
    uri: uri,
    qs: {access_token: access_token},
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17'
    }
  };
  _.extend(options, {json: params, method: method});
  console.log(options);
  request(options, callback);
}
