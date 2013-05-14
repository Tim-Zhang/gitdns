define(['jquery','underscore' , 'backbone', 'handlebars'], function($, _, Backbone, Handlebars) {
  require(['showloading']);
  var model = Backbone.Model.extend({
    url: '/github/new'
  });
  var view = Backbone.View.extend({
    el: $('form'),
    initialize: function(options) {
      this.listenTo(this.model, 'request', this.showLoading);
      this.listenTo(this.model, 'sync', this.showSuc);
      this.listenTo(this.model, 'error', this.showErr);
    },
    events: {
      'submit': 'createRep'
    },
    createRep: function(e) {
      e.preventDefault();
      var rep_name = this.$('#repository_name').val();
      var desc = this.$('#repository_description').val();
      this.model.set({rep_name: rep_name, desc: desc});
      this.model.save();
    },
    showErr: function(msg) {
      this.hideLoading();
      this.$('.alert-error .message').html(msg);
      this.$('.alert-error').show();
    },
    showSuc: function() {
      this.hideLoading();
      var rep_href = 'test';
      this.$('.alert-success .github-link').attr('href', rep_href).html(rep_href);
      this.$('.alert-success').show();
    },
    showLoading: function() {
      console.log('showloading');
      this.$el.showLoading();
    },
    hideLoading: function() {
      this.$el.hideLoading();
    
    }
  });

  var new_rep = new model();
  var new_rep_view = new view({model: new_rep});
});

