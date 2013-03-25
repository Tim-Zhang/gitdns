require.config({
  baseUrl: 'javascript',
  paths: {
    'jquery': 'jquery-1.9.1.min'
  }
});

require(['jquery'], function($) {
  console.log('Hello world');
})
