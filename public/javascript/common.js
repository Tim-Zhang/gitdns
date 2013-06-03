require.config({
  baseUrl: 'javascript',
  paths: {
    'jquery': 'lib/jquery-1.9.1.min',
    'underscore': 'lib/underscore-min',
    'backbone': 'lib/backbone-min',
    'handlebars': 'lib/handlebars',
    'migrate': 'lib/jquery-migrate-1.2.1.min',
    'showloading': 'plugin/jquery.showLoading.min',
    'ieblue': 'plugin/jquery.ie6bluescreen.min'
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
