require.config({
  baseUrl: 'javascript',
  paths: {
    'jquery': 'jquery-1.9.1.min',
    'underscore': 'underscore-min',
    'backbone': 'backbone-min',
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
  urlArgs: "bust=v2"
  
});
