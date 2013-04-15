var request = require('request')
  , _ = require('underscore')
  , querystring = require('querystring')
  , util = require('./util')
  , db = require('./db');

var type = 'domain';

exports.create = function(domain_name, access_token, callback) {
  var action = 'create';
  var form = util.getForm(access_token, {
    domain: domain_name
  });
  var params = util.getParam(action, type, form);
  request(params, callback);
};
exports.remove = function(domain_id, access_token, callback) {
  var action = 'remove';
  var form = util.getForm(access_token, {
    domain_id: domain_id 
  });
  var params = util.getParam(action, type, form);
  request(params, callback);

};

exports.info = function(domain, access_token, callback) {
  var action = 'info';
  var form = util.getForm(access_token, {
    domain: domain 
  });
  var params = util.getParam(action, type, form);
  request(params, callback);
};

exports.list = function(access_token, callback) {
  var action = 'list';
  var form = util.getForm(access_token, {
    type: "all"
  });
  var params = util.getParam(action, type, form);
  request(params, callback);
};

// test 


//var at = '2e6db7279eaf7eb65b8eae2fb017bfaf60e4ef84';
//var tc = function(err, res, body) {
//  console.log(body);
//  process.exit();
//};

//exports.list(at, tc);

//exports.create('woaiderenyeaiwo.com', at, tc);

//exports.info('woaiderenyeaiwo.com', at, tc);

//exports.remove(3201407, at, tc);

