require.config({
  baseUrl: 'javascript',
  paths: {
    'jquery': 'jquery-1.9.1.min',
    'underscore': 'underscore-min',
    'backbone': 'backbone-min'
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
  urlArgs: "bust=" +  (new Date()).getTime()
  
});

require(['jquery','underscore' , 'backbone', 'handlebars'], function($, _, Backbone, Handlebars) {
  var userModel = Backbone.Model.extend({
    url: '/rep'
  }); 

  var stepView = Backbone.View.extend({
    className: 'alert alert-info',
    initialize: function(options) {
      this.listenTo(this.model, 'sync', this.render);
      this.template = Handlebars.compile($('#' + options.name).html()),
      this.render();
      //this.model.fetch();
    },
    render: function(render_options) {
      var options = _.extend({} , render_options, this.model.toJSON());
      this.$el.html(this.template(options));
      return this;
    }
  });

  var step1View = stepView.extend({
    events: {
      'click .update': 'update',
      'click .edit': 'edit',
      'click div#git-rep': 'edit'
    },
    edit: function(e) {
      e.preventDefault();
      this.render({edit: true});
    },
    update: function(e) {
      e.preventDefault();
      var gitrep = $('#git-rep').val();
      this.model.save({gitrep: gitrep});
    }
  
  });

  var setupView = Backbone.View.extend({
    initialize: function(options) {
      var steps = ['second-step']; 
      var that = this;
      this.views = [];
      this.views.push(new step1View({model: that.model, name: 'first-step'}));
      _.each(steps, function(s) {
        var view = new stepView({model: that.model, name: s}); 
        that.views.push(view);
      });
      this.render();
    },
    render: function() {
      var that = this;
      _.each(this.views, function(v) {
        that.$el.append(v.el);
      })
    }
  });

  // Login judement
  if (DnsGit.user_id) {
    var user = new userModel(DnsGit); 
    var setup = new setupView({model: user}); 
    $('#setup').append(setup.el);
  }
});
require(['plugin/dropdown']);
