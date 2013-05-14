var request = require('request');
var config = require('./config');
var db = require('./db');
var _ = require('underscore');

var DNSPOD = config.dnspod;
var URI = config.dnspod.uri;

exports.callback = function(req, res) {
  var code = req.query.code;
  var params = {
    uri: URI.accesstoken,
    form: {
      code: code,
      client_id: DNSPOD.key,
      client_secret: DNSPOD.secret,
      grant_type: 'authorization_code'
    } 
  };
  request.post(params, function(error, response, body){
    body = JSON.parse(body);
    console.log(body);
    req.session.access_token = body.access_token;
    exports.getUser(req, res);
  });
}

exports.getUser = function(req, res) {
  var access_token = req.session.access_token;
  var params = {
    uri: URI.user,
    method: 'POST',
    body: 'format=json&access_token=' + access_token,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  };
  request(params, function(error, response, body){
    body = JSON.parse(body);
    if (body && body.info && body.info.user) {
      var user = body.info.user;
      user.name = user.realname || user.nick || user.id;
      user.access_token = req.session.access_token;
      req.session.user = user; 
      db.saveUser(user, function() {
        console.log('has write to mongo');
        console.log(user);
      });
    }

    res.redirect('/');
  });


}
