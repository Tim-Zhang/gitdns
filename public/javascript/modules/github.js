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
      this.model.set({name: rep_name, description: desc});
      this.model.save();
    },
    showErr: function(model, xhr, options) {
      this.hidePrompt();
      var responseJson = JSON.parse(xhr.responseText);
      var errors = responseJson.errors;
      if (errors) {
        var msg = responseJson.message;
        if (errors && errors[0]) {
          msg += ' : ' + errors[0].message;
        }
      } else if (responseJson.status){
        msg = responseJson.status.message;
      } else {
        msg = 'Unkown Error';
      }
      this.$('.alert-error .message').html(msg);
      this.$('.alert-error').show();
    },
    showSuc: function(model, xhr, options) {
      this.hidePrompt();
      var rep_href = xhr.github_url;
      var rep_ssh_href = xhr.github_ssh_url;
      this.$('.alert-success .github-link').attr('href', rep_href).html(rep_href);
      this.$('.alert-success .github-ssh-link').html(rep_ssh_href);
      this.$('.alert-success').show();
    },
    hidePrompt: function() {
      this.hideLoading();
      this.$('.alert-error').hide();
      this.$('.alert-success').hide();
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

