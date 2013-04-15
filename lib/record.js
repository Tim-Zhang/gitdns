var request = require('request')
  , querystring = require('querystring')
  , _ = require('underscore')
  , util = require('./util')
  , db = require('./db');

var type = 'record';

exports.create = function(record, access_token, callback) {
  var action = 'create';
  var form = util.getForm(access_token, record);
  var params = util.getParam(action, type, form);
  request(params, callback);
};
exports.remove = function(domain_id, record_id, access_token, callback) {
  var action = 'remove';
  var form = util.getForm(access_token, {
    domain_id: domain_id,
    record_id: record_id
  });
  var params = util.getParam(action, type, form);
  request(params, callback);
};

exports.modify = function(record, access_token, callback) {
  var action = 'modify';
  var form = util.getForm(access_token, record);
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

exports.list = function(domain_id, access_token, callback) {
  var action = 'list';
  var form = util.getForm(access_token, {
    domain_id: domain_id 
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
//
//var record_id = 21863470;
//var domain_id = 3201512;
//
//var record = {
//  domain_id: domain_id,
//  record_id: record_id,
//  sub_domain: 'test2',
//  record_type: 'A',
//  record_line: '默认',
//  value: '9.9.9.99'
//};

//exports.list(3201512, at, tc);


//exports.create(record, at, tc);

//exports.info('woaiderenyeaiwo.com', at, tc);

//exports.remove(domain_id, record_id, at, tc);

//exports.modify(record, at, tc);


