require.config({
  baseUrl: 'javascript',
  paths: {
    'jquery': 'jquery-1.9.1.min',
  },
  urlArgs: "bust=" +  (new Date()).getTime()
  
});

require(['jquery'], function($) {
  console.log('Hello world');
});
require(['plugin/dropdown']);
