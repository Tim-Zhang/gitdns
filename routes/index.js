
/*
 * GET home page.
 */
var config = require('../config');

exports.index = function(req, res){
  console.log(req.session.user);
  var options = {
    title: 'DnsGit',
    brand: 'DnsGit',
    login_url: config.login_url,
    user: req.session.user
  };
  res.render('index', options);
};

