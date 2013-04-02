var request = require('request');
var config = require('./config');
var db = require('./db');
var _ = require('./lib/underscore-min');


exports.callback = function(req, res) {
  var code = req.query.code;
  var params = {
    uri: config.accesstoken_url,
    form: {
      code: code,
      client_id: config.app_key,
      client_secret: config.app_secret,
      grant_type: 'authorization_code'
    } 
  };
  request.post(params, function(error, response, body){
    body = JSON.parse(body);
    req.session.access_token = body.access_token;
    exports.getUserInfo(req, res);
  });
}

exports.getUserInfo = function(req, res) {
  var access_token = req.session.access_token;
  var params = {
    uri: config.userInfo_url,
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
