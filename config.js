/* declaration */
var app_key, app_secret;
var dnspod = {};
var github = {};
github.uri = {};
dnspod.uri = {};

var env = process.env.NODE_ENV || 'development';

/* github */
github.key = 'b688d87e04c1c54c4bd8';
github.secret = 'cc0be9f905ebf1ff20acd8db3048d7ce3eb3301b';

github.uri.authorize = 'https://github.com/login/oauth/authorize';
github.uri.redirect = 'http://localhost:3000/github_callback';
github.uri.login = github.uri.authorize + '?client_id=' + github.key + '&scope=public_repo&redirect_uri=' + github.uri.redirect;
github.uri.accesstoken = 'https://github.com/login/oauth/access_token';
github.uri.user= 'https://api.github.com/user';

/* dnspod */
// development only
if (env == 'development') {
  dnspod.key = '10021',
  dnspod.secret = '1bd198ae75f8e57b296c59532d55a9b9';
}
// production only
if (env == 'production') {
  dnspod.key = '10027',
  dnspod.secret = '0f3ccb8ff13c3858c78fabd77463dd0f';
}

dnspod.uri.root = 'https://www.dnspod.cn';
dnspod.uri.authorize = 'https://www.dnspod.cn/OAuth/Authorize.Simple';
dnspod.uri.redirect = 'localhost:3000/oauth_callback';
dnspod.uri.login = dnspod.uri.authorize + "?client_id=" + dnspod.key + "&redirect_uri" + dnspod.uri.redirect + "&response_type=code";
dnspod.uri.accesstoken = 'https://www.dnspod.cn/OAuth/Access.Token';
dnspod.uri.user = 'https://dnsapi.cn/User.Detail';


/* exports */
exports.dnspod = dnspod;
exports.github = github;

