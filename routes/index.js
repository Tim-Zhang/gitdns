
/*
 * GET home page.
 */

exports.index = function(req, res){
  var options = {
    title: 'DnsGit',
    brand: 'DnsGit',
  };
  res.render('index', options);
};
