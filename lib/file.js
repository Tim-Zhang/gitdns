var fs = require('fs');
fs.exists = fs.exists || require('path').exists;
var _ = require('underscore');
var S = require('string');
var async = require('async');

var db = require('../db');
var domain = require('./domain');
var record = require('./record');

var base_dir = '/tmp/dnsgit-tmp/';

var path = function(dir_name) {
  return base_dir + dir_name;
}

var record_to_lua = function(record) {
  var format = "{{type}}({{name}}, {{value}}, {{line}}, {{ttl}}, {{mx}})";
  return S(format).template(record).s;
};
var records_to_lua = function(records) {
  // drop NS record value @
  records = _.filter(records, function(r) {
    return !(r.type.toUpperCase() === 'NS' && r.name === '@');
  });
  var data = _.map(records, function(r) {
    return record_to_lua(r);
  });
  return data.join('\n');
};

var create_files = function(access_token, dir_name, create_callback) {
  var path_name = path(dir_name); 
  var create_file = function(domain, callback) {
    record.list(domain.id, access_token, function(error, response, body) {
      body = JSON.parse(body);
      if (body.status && body.status.code == '1') {
        var records = body.records;
        var data = records_to_lua(records);
        fs.writeFile(path_name + '/' + domain.name, data, callback);
      } else {
        callback(body);
      }
    });

  };
  async.waterfall([
    // mkdir
    function(callback) {
      fs.mkdir(path_name, function() {
        callback(null);
      });
    },
    // get domainlist
    function(callback) {
      domain.list(access_token, callback); 
    },
    function(response, body, callback) {
      body = JSON.parse(body);
      if (body.status && body.status.code == 1) {
        callback(null, body.domains);
      } else {
        callback(body);
      }
    },
    function(domains, callback) {
      async.map(domains, create_file, callback);
    }
        
  ], create_callback);

};


// exports
exports.create_files = create_files;
exports.path = path;
exports.base_dir = base_dir;



//test 

var at = 'f102cfdd68544e5e9534ee52deebe30eae399410';
//var random = Math.floor(Math.random() * 1000);
//create_files(at, random, function(err, result) {
//  console.log(err);
//
//});

