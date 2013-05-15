
/*
 * GET home page.
 */
var config = require('../config');
var db = require('../db');
var _ = require('underscore');
var moment = require('moment');
var github_oauth = require('../github_oauth');
var async = require('async');
var S = require('string');

var GITHUB = config.github;
var URI = config.github.uri;

exports.index = function(req, res){
  if (req.method == 'GET') {
    get(req, res);
  } else {
    post(req, res);
  }
};

exports.new = function(req, res) {
  var REPINFO;
  var session = req.session;
  var access_token = session.github.access_token;
  async.waterfall([
    // create rep
    function(callback){
      github_oauth.createRep(access_token, req.body, callback);
    },
    // create hook
    function(rep_info, callback){
      REPINFO = rep_info;
      var uri_values = {owner: REPINFO.owner.login, repo: REPINFO.name};
      var uri = S(URI.hook).template(uri_values).s;
      var params = {
        name: 'web', 
        active: true,
        config: {url: 'http://api.dnsgit.com/notify/' + session.user.id, content_type: 'json'},
      };
      github_oauth.createHook(access_token,uri, params, callback);
    },
    // create collaborator
    function(hook_info, callback){
      var uri_values = {owner: REPINFO.owner.login, repo: REPINFO.name, user: GITHUB.collaborator};
      var uri = S(URI.collaborator).template(uri_values).s;
      var params = {};
      github_oauth.createCollaborator(access_token,uri, params, callback);
    }
  ], function (err, result) {
    if (!err) {
      _.extend(result, {github_url: REPINFO.html_url});
    }
    res.status(err ? 500: 200);
    res.send(err || result);
  });

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
