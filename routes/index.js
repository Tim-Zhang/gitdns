
/*
 * GET home page.
 */
var config = require('../config');

exports.index = function(req, res){
  var options = {
    title: 'DnsGit',
    brand: 'DnsGit',
    login_url: config.login_url
  };
  res.render('index', options);
};

