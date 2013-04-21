var domain = require('../lib/domain');
var record = require('../lib/record');

exports.validate = function(req, res, options) {
  var session = req.session;
  if (session && session.user && session.user.access_token) {
  } else {
    res.send(401, 'not login');
  }
  if (options.method == 'recordlist' && !options.id) {
    res.send(400, 'parameter mising');
  }
};
exports.domainlist = function(req, res, options) {
  var access_token = req.session.user.access_token;
  domain.list(access_token, function(err, response, body) {
    var result = request_handle(err, response, body);
    if (result === false) {
      res.send(500); 
    }
    var rest = restful(result, 'domains');
    res.send.apply(res, rest);
  });
};
exports.recordlist = function(req, res, options) {
  var access_token = req.session.user.access_token;
  record.list(options.id, access_token, function(err, response, body) {
    var result = request_handle(err, response, body);
    if (result === false) {
      res.send(500); 
    }
    var rest = restful(body, 'domains');
    res.send.apply(this, rest);
  });
};

//
// helper
//

var request_handle = function(err, res, body) {
  if (err) {
    // TODO 
    // error handle

    return false;
  } 
  return JSON.parse(body);
}

var restful = function(body, key) {
  var ret = [];
  if (body && body.status && body.status.code == 1) {
    ret.push(200);
    ret.push(body[key]);
  } else {
    ret.push(401);
    ret.push(body);
  }
  return ret;
  
}

