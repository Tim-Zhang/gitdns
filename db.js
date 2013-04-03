var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/dnsgit');

var schema = mongoose.Schema({ id: 'string', gitrep: 'string', access_token: 'string'});
var User = db.model('User', schema);

exports.saveUser = function(user, callback) {
  User.find({id: user.id}, function(err, docs) {
    if (docs && docs.length) {
      console.log(user.access_token);
      var set = {};
      if (user.gitrep) {
        set.gitrep = user.gitrep;
      }
      if (user.access_token) {
        set.access_token = user.access_token;
      }
      User.update({_id: docs[0]._id}, {$set: set}, callback);
    } else {
      var newUser = new User({id: user.id, gitrep: user.gitrep, access_token: user.access_token});
      newUser.save(callback);
    }
  }); 
};
exports.getUser = function(id, callback) {
  User.find({id: id}, callback);  
};


// test

//var user = {id: 2, gitrep: 'zhangzewen'};
//saveUser(user, function(err) {
//  console.log(err);
//  console.log('done');
//});



