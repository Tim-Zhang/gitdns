var domain = require('../lib/domain');
var record = require('../lib/record');
var _ = require('underscore');

var need_access_token = function(req, res, options) {
  var session = req.session;
  if (session && session.user && session.user.accessToken) {
    return 0;
  } else {
    return [401, {message: 'not login'}]
  }
};

var need_domain_id = function(req, res, options) {
  if (!options.domain_id) {
    return [400, {message: 'parameter mising: domain_id required'}];
  }
  return 0;
}

var validate_map = {
  "domainlist": [need_access_token],
  "recordlist": [need_access_token, need_domain_id]
};

exports.validator = function(method, req, res, options) {
  var validate_list = validate_map[method];
  for(var v in validate_list) {
    var ret = validate_list[v](req, res, options);
    if (ret) {
      return ret;
    }
  }
  return 0;
};


exports.domainlist = function(req, res, options) {
  var access_token = req.session.user.accessToken;
  domain.list(access_token, function(err, response, body) {
    var result = request_handle(err, response, body);
    if (result === false) {
      res.send(500);
      return;
    }
    var rest = restful(result, 'domains');
    res.send.apply(res, rest);
  });
};

exports.recordlist = function(req, res, options) {
  var access_token = req.session.user.accessToken;
  record.list(options.domain_id, access_token, function(err, response, body) {
    var result = request_handle(err, response, body);
    if (result === false) {
      res.send(500);
      return;
    }
    var rest = restful(result, 'records');
    res.send.apply(res, rest);
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
    if (body.error) {
      body.status = {
        code: -2,
        message: body.error_description
      }
    }
    ret.push(401);
    ret.push(body);
  }
  return ret;

}

