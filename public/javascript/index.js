define(['jquery','underscore' , 'backbone', 'handlebars'], function($, _, Backbone, Handlebars) {
  var userModel = Backbone.Model.extend({
    url: '/rep'
  });

  var stepView = Backbone.View.extend({
    className: 'alert alert-info',
    initialize: function(options) {
      this.listenTo(this.model, 'sync', this.render);
      this.template = Handlebars.compile($('#' + options.name).html()),
      this.render();
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

  var addTitle = function(elem, title) {
    elem.append('<span class="title">' + title + '</span>');        
  };  
  setupView = Backbone.View.extend({
    tagName: 'form',
    className: 'form-horizontal bs-docs-example',
    initialize: function(options) {
      var steps = ['second-step'];
      var that = this;
      this.views = [];
      this.views.push(new step1View({model: that.model, name: 'first-step'}));
      _.each(steps, function(s) {
        var view = new stepView({model: that.model, name: s});
        that.views.push(view);
      });
      this.render(options);
    },
    render: function(options) {
      var that = this;
      _.each(this.views, function(v) {
        that.$el.append(v.el);
      })
      addTitle(this.$el, options.title);
    }
  });

  var commonView = Backbone.View.extend({
    template: Handlebars.compile($('#banner-nologin').html()),
    initialize: function(options) {
      this.template = Handlebars.compile($('#' + options.template).   html());
      this.render();
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  var domainModel = Backbone.Model.extend({
  });

  var domainListCollection = Backbone.Collection.extend({
    url: '/api/domainlist',
    model: domainModel
  });
  var domainView = Backbone.View.extend({
    tagName: 'tr',
    template: Handlebars.compile($('#domain-entry').html()),
    initialize: function(options) {
      this.render(options);
    },
    render: function(options) {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },
    events: {
      'click': 'viewRecord'
    },
    viewRecord: function() {
      Backbone.trigger('navigate', this.model.get('name'), true);
    }
  });
  var domainListView = Backbone.View.extend({
    className: 'bs-docs-example',
    template: Handlebars.compile($('#domain-list').html()),
    initialize: function(options) {
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'reset', this.addAll);
      this.listenTo(this.collection, 'error', this.showError);
      this.collection.fetch();
      this.render(options);
    },
    showError: function(model, xhr, options) {
      console.log(model, xhr, options);
    },
    addOne: function(model) {
      var view = new domainView({model: model}); 
      this.$('tbody').append(view.render().el);
    },
    addAll: function() {
      console.log('add all');
      this.collection.each(this.addOne, this);
    },
    render: function(options) {
      this.$el.html(this.template());
      addTitle(this.$el, options.title);
      return this;
    }
  });

  // Routes
  var route = Backbone.Router.extend({
    initialize: function() {
      Backbone.on('navigate', function(route, option) {
        this.navigate(route, option)
      }, this);
    },
    routes: {
      '': 'default'
    },
    default: function() {
      if (DnsGit.user_id) {
        this.login_index();
      } else {
        this.nologin_index();
      }
    }, 
    login_index: function() {
      var user = new userModel(DnsGit);
      var setup = new setupView({model: user, title: 'Setup'});
      var domainlist = new domainListCollection();
      var domainlist_view = new domainListView({collection: domainlist, title: 'DomainList'});
      console.log(domainlist);
      $('.content').append(setup.el);
      $('.content').append(domainlist_view.el);
    },
    nologin_index: function() {
      var banner = new commonView({template: 'banner-nologin'});
      var feature = new commonView({template: 'feature'});
      $('.content').append(banner.el);
      $('.content').append(feature.el);
    }
  });

  new route;
  Backbone.history.start();
});

