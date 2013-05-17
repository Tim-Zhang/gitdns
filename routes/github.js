
/*
 * GET home page.
 */
var _ = require('underscore');
var moment = require('moment');
var async = require('async');
var S = require('string');
var exec = require('child_process').exec;

var config = require('../config');
var db = require('../db');
var github_oauth = require('../github_oauth');
var file = require('../lib/file');

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
  var REPINFO, FILENAME;
  var session = req.session;
  var access_token = session.github.access_token;
  var dnspod_access_token = session.user.access_token;
  async.waterfall([
    // create rep
    function(callback){
      github_oauth.createRep(access_token, req.body, callback);
    },
    // create collaborator
    function(rep_info, callback){
      REPINFO = rep_info;
      var uri_values = {owner: REPINFO.owner.login, repo: REPINFO.name, user: GITHUB.collaborator};
      var uri = S(URI.collaborator).template(uri_values).s;
      var params = {};
      github_oauth.createCollaborator(access_token,uri, params, callback);
    },
    // save git-rep url
    function(info, callback) {
      var user = {
        id: session.user.id,
        gitrep: REPINFO.html_url
      }
      db.saveUser(user, function(err) {
        callback(err);
      });
    },
    // create file
    function (callback) {
      FILENAME = REPINFO.name + '-' + session.user.id;
      file.create_files(dnspod_access_token, FILENAME, callback);
    },
    // push file
    function (info, callback) {
      var remote = REPINFO.ssh_url;
      remote = remote.replace('github.com', URI.push);
      var dirname = file.path(FILENAME);
      var readme = file.base_dir + 'README.md';

      var cmd_opt = [
        'cp -a ' + readme + ' ' + dirname
      ];
      var cmd = [
        'cd ' + dirname,
        'git init',
        'git add -A',
        'git cm "create by dnsgit"',
        'git remote add origin '+ remote,
        'git push origin master'
      ];
      var command = cmd_opt.join(';') + ';' + cmd.join('&&');
      exec(command, callback);
    },
    // drop file
    function (stdout, stderr, callback) {
      console.log('drop file');
      callback(null, 'drop file done');
    },
    // create hook
    function(info, callback){
      var uri_values = {owner: REPINFO.owner.login, repo: REPINFO.name};
      var uri = S(URI.hook).template(uri_values).s;
      var params = {
        name: 'web', 
        active: true,
        config: {url: 'http://api.dnsgit.com/notify/' + session.user.id, content_type: 'json'},
      };
      github_oauth.createHook(access_token,uri, params, callback);
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
