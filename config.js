
var app_key, app_secret;

var env = process.env.NODE_ENV || 'development';

// development only
if (env == 'development') {
  app_key = '10021',
  app_secret = '1bd198ae75f8e57b296c59532d55a9b9';
}
//// production only
if (env == 'production') {
  app_key = '10022',
  app_secret = 'cfe1360a89e726e027edfd9bbb351679';
}

//test
//app_key = '10012';
//app_secret = '74ceae576073170f9ccf40a4aa0f2154';
login_url = login_url;
var dnspod_url = 'https://www.dnspod.cn/OAuth/Authorize.Simple';
var redirect_url = 'localhost:3000/oauth_callback';
var login_url = dnspod_url + "?client_id=" + app_key + "&redirect_uri" + redirect_url + "&response_type=code"

// exports
exports.app_key = app_key;
exports.app_secret = app_secret;
exports.login_url = login_url;
exports.accesstoken_url = 'https://www.dnspod.cn/OAuth/Access.Token';
exports.userInfo_url = 'https://dnsapi.cn/User.Detail';
