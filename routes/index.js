
/*
 * GET home page.
 */
var config = require('../config');
var db = require('../db');

exports.index = function(req, res){
  var user = req.session.user;
  if (user) {
    db.getUser(user.id, function(err, docs) {
      if (docs.length) {
        req.session.user.gitrep = docs[0].gitrep;
      }
      var options = {
        title: 'DnsGit',
        brand: 'DnsGit',
        login_url: config.login_url,
        user: req.session.user
      };
      console.log(options);
      res.render('index', options);
    }); 
  }
};

