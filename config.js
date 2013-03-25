// local
app_key = '10021';
app_secret = '1bd198ae75f8e57b296c59532d55a9b9';
login_url = login_url;
var dnspod_url = 'https://www.dnspod.cn/OAuth/Authorize.Simple';
var redirect_url = 'localhost:3000/oauth_callback';
var login_url = dnspod_url + "?client_id=" + app_key + "&redirect_uri" + redirect_url + "&response_type=code"

// exports
exports.app_key = app_key;
exports.app_secret = app_secret;
exports.login_url = login_url;
