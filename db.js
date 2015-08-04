var co = require('co')
  , _ = require('underscore')
  , Backbone = require('backbone-rethinkdb');

var User = Backbone.Model.extend({
    database: 'gitdomain',
    table: 'user',
    filterId: 'did'
});

exports.saveUser = function(userinfo, callback) {
  var user = new User({ did: userinfo.id });

  co(function* () {
    yield user.fetch();

    try {
      yield user.save(userinfo);
      callback(null);
    } catch(e) {
      callback(e);
    }

  });
};
exports.getUser = function(id, callback) {
  var user = new User({ did: id });
  co(function* () {
    try {
      yield user.fetch();
      callback(user.toJSON())
    } catch(e) {
      callback(e);
    }

  });
};


// test

//var user = {id: 2, gitrep: 'zhangzewen'};
//saveUser(user, function(err) {
//  console.log(err);
//  console.log('done');
//});



