var request = require('request');
var config = require('./config');
var db = require('./db');
var _ = require('underscore');


exports.callback = function(req, res) {
  var code = req.query.code;
  var params = {
    uri: config.github.accesstoken_url,
    form: {
      code: code,
      client_id: config.github.key,
      client_secret: config.github.secret,
    },
    headers: {Accept: 'application/json'}
  };
  request.post(params, function(error, response, body){
    body = JSON.parse(body);
    req.session.github || (req.session.github = {});
    req.session.github.access_token = body.access_token;
    // test
    res.send(body);
  });
}

exports.getUserInfo = function(req, res) {
  var access_token = req.session.access_token;
  var params = {
    uri: config.github.userInfo_url,
    method: 'GET',
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
