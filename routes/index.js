
/*
 * GET home page.
 */
var config = require('../config');
var db = require('../db');
var _ = require('underscore');

exports.index = function(req, res){
  var user = req.session.user;
  var options = {
    title: 'GitDNS',
    brand: 'GitDNS',
    dnspod_login_url: config.dnspod.uri.login,
    github_login_url: config.github.uri.login,
    user: null,
    navigation: ''
  };
  if (user) {

    db.getUser(user.id, function(err, docs) {
      if (!err) {
        req.session.user.repoUrl = docs.repoUrl;
      }
      _.extend(options, {
        user: user
      });
      res.render('pure/index', options);
    });
  } else {
    res.render('pure/index', options);
  }
};

