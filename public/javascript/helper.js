define(['jquery','underscore' , 'backbone', 'handlebars', 'exports'], function($, _, Backbone, Handlebars, exports) {
  
  exports.view = {};
  exports.view.alertError = Backbone.View.extend({
    template: Handlebars.compile($('#alert-error').html()),
    initialize: function(options) {
      this.render(options);
    },
    render: function(options) {
      options = options || {};
      this.$el.html(this.template(options));
      return this;
    }
  });

  exports.view.loading = Backbone.View.extend({
    className: 'loading-img',
    template: Handlebars.compile($('#loading').html()),
    initialize: function(options) {
      this.render(options);
    },
    render: function(options) {
      options = options || {};
      this.$el.html(this.template(options));
      return this;
    }
  });

});

