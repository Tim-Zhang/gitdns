var querystring = require('querystring')
  , S = require('string')
  , _ = require('underscore');

var getUrl = function(action, type) {
  var baseUrl = 'https://dnsapi.cn/';
  var urls = { 
    "record": {
      "create": "Record.Create",
      "remove": "Record.Remove",
      "list": "Record.List",
      "info": "Record.Info",
      "modify": "Record.Modify"
    },
    "domain": {
      "create": "Domain.Create",
      "remove": "Domain.Remove",
      "list": "Domain.List",
      "info": "Domain.Info"
    }
  };  
  if ((type in urls) && action in urls[type]) {
    return baseUrl + urls[type][action];
  } else {
    throw "type or action not in expect list";
  }
};

var getForm = function(access_token, extend) {
  var form = _.extend({
    format: "json",
    access_token: access_token
  }, extend);
  return querystring.stringify(form);
};

var getParam = function(action, type, form) {
  var params = { 
    uri: getUrl(action, type),
    method: 'POST',
    body: form,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }   
  };  
  return params;
};

var valid_record = function(record) {
  return (record && typeof record === "object" && _.size(record) > 2);
}

var bodyParser = function(body, key) {
  body = JSON.parse(body);
  if (body.error) {
    throw body;
  }
  var success, success_pool;
  if (key == 'domains') {
    success_pool = ['1', '9'];
  } else if (key == 'records') {
    success_pool = ['1', '10'];
  }
  success = body.status && _.contains(success_pool, body.status.code); 
  if (success) {
    return body[key];
  } else {
    return -1;
  }
}

var uniqRecord = function(r1, r2) {
  if (!r1 || !r2) return;
  var model = {
    sub_domain: 'name',
    value: 'value',
    record_type: 'type',
    ttl: 'ttl',
    mx: 'mx'
  }
  //priority
  r1 = _.sortBy(r1, function(r) {
    return _.size(r);
  })

  var exists = [];
  for (var i=0; i<r1.length; i++) {
    for (var j=0; j<r2.length; j++) {
      var rr1 = r1[i];
      var rr2 = r2[j];
      var is_equal = _.every(_.keys(model), function(m) {
        return !(rr1[m] && rr1[m] != rr2[model.m]); 
      });
      if (is_equal) {
        r1 = _.without(r1, rr1);
        r2 = _.without(r2, rr2);
      }
    }
  }
  

}

var removeNs = function(record) {
   return _.filter(record, function(r) {
    return !(r.type == 'NS' && r.name == '@') 
  });

};

exports.getForm = getForm;
exports.getParam = getParam;
exports.bodyParser = bodyParser;
exports.uniqRecord = uniqRecord;
exports.removeNs = removeNs;


