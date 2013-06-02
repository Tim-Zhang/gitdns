require.config({
  baseUrl: 'javascript',
  paths: {
    'jquery': 'lib/jquery-1.9.1.min',
    'underscore': 'lib/underscore-min',
    'backbone': 'lib/backbone-min',
    'handlebars': 'lib/handlebars',
    'showloading': 'plugin/jquery.showLoading.min'
  },
  shim: {
    'backbone': {
      //These script dependencies should be loaded before loading
      //backbone.js
      deps: ['underscore', 'jquery'],
      //Once loaded, use the global 'Backbone' as the
      //module value.
        exports: 'Backbone'
      },
      'underscore': {
        exports: '_'
      },
      'handlebars': {
        exports: 'Handlebars'
      }
  },
  //urlArgs: "bust=" +  (new Date()).getTime()
  urlArgs: "bust=v3"
  
});
