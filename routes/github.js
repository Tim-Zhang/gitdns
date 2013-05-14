
/*
 * GET home page.
 */
var config = require('../config');
var db = require('../db');
var _ = require('underscore');
var moment = require('moment');


exports.index = function(req, res){
  if (req.method == 'GET') {
    get(req, res);
  } else {
    post(req, res);
  }
};

exports.new = function(req, res) {
  setTimeout(function() {
    res.send({message:'new rep'});
  }, 2000);
}

var get = function(req, res) {
  var session = req.session;
  var user = session.user;
  if (!user) {res.redirect('/');return;}
  var options = {
    title: 'DnsGit',
    brand: 'DnsGit',
    github_login_url: config.github.uri.login,
    dnspod_login_url: config.dnspod.uri.login,
    user: user,
    github: session.github, 
    navigation: 'github',
  };
  _.extend(options.github, {rep_name: 'dnsgit-' + moment().format('YYYYMMDDHHmmss')});
  res.render('github', options);
};

var post = function(req, res) {

}
