var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/dnsgit');

var schema = mongoose.Schema({ id: 'string', gitrep: 'string'});
var User = db.model('User', schema);

exports.saveUser = function(user, callback) {
  User.find({id: user.id}, function(err, docs) {
    if (docs.length) {
      User.update({_id: docs[0]._id}, {$set: {gitrep: user.gitrep}}, callback);
    } else {
      var newUser = new User({id: user.id, gitrep: user.gitrep});
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



