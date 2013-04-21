define(['jquery','underscore' , 'backbone', 'handlebars', 'helper'], function($, _, Backbone, Handlebars, Helper) {
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
      'click .cancel': 'cancel',
      'click .edit': 'edit',
      'click div#git-rep': 'edit'
    },  
    cancel: function(e) {
      this.render();
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

  var domainListCollection = Backbone.Collection.extend({
    url: '/api/domainlist',
    model: Backbone.Model 
  });

  var recordListCollection = Backbone.Collection.extend({
    url: '/api/recordlist/',
    model: Backbone.Model,
    initialize: function(options) {
      this.url += options.domain_id; 
    }
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

  var recordView = Backbone.View.extend({
    tagName: 'tr',
    template: Handlebars.compile($('#record-entry').html()),
    initialize: function(options) {
      this.render(options);
    },
    render: function(options) {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
  
  var domainListView = Backbone.View.extend({
    className: 'bs-docs-example domainlist',
    template: Handlebars.compile($('#domain-list').html()),
    initialize: function(options) {
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'reset', this.addAll);
      this.listenTo(this.collection, 'error', this.showError);
      this.listenTo(this.collection, 'all', this.removeLoading);
      this.collection.fetch();
      this.render(options);
      this.loading();
    },
    showError: function(model, xhr, options) {
      var responseJson = JSON.parse(xhr.responseText);
      var message = responseJson.status.message;
      var errorView = new Helper.view.alertError({msg: message});

      this.$el.append(errorView.el);

    },
    addOne: function(model) {
      var view = new domainView({model: model});
      this.$('tbody').append(view.render().el);
    },
    addAll: function() {
      this.collection.each(this.addOne, this);
    },
    loading: function() {
      this.loadingView = new Helper.view.loading();
      this.$el.append(this.loadingView.el);
    },
    removeLoading: function() {
      this.loadingView && this.loadingView.remove();
    },
    render: function(options) {
      this.$el.html(this.template());
      addTitle(this.$el, options.title);
      return this;
    }
  });

  var recordListView = Backbone.View.extend({
    events: {
      'click .title': 'toDomainList' 
    },
    className: 'bs-docs-example recordlist',
    template: Handlebars.compile($('#record-list').html()),
    initialize: function(options) {
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'reset', this.addAll);
      this.listenTo(this.collection, 'error', this.showError);
      this.listenTo(this.collection, 'all', this.removeLoading);
      this.collection.fetch();
      this.render(options);
      this.loading();
    },
    toDomainList: function() {
      Backbone.trigger('navigate', '', true);
    },
    showError: function(model, xhr, options) {
      var responseJson = JSON.parse(xhr.responseText);
      var message = responseJson.status.message;
      var errorView = new Helper.view.alertError({msg: message});
      this.$el.append(errorView.el);
    },
    addOne: function(model) {
      var view = new recordView({model: model});
      this.$('tbody').append(view.render().el);
    },
    addAll: function() {
      this.collection.each(this.addOne, this);
    },
    loading: function() {
      this.loadingView = new Helper.view.loading();
      this.$el.append(this.loadingView.el);
    },
    removeLoading: function() {
      this.loadingView && this.loadingView.remove();
    },
    render: function(options) {
      console.log(this.events);
      this.$el.html(this.template());
      addTitle(this.$el, options.title);
      this.addCrumbs();
      return this;
    },
    addCrumbs: function() {
      var crumbs = '<i class="icon-home"></i>';
      this.$('.title').prepend(crumbs);
    }
  });

  // Routes
  var route = Backbone.Router.extend({
    initialize: function() {
      Backbone.on('navigate', function(route, option) {
        this.navigate(route, option)
      }, this);
      this.route(/^(.+[\.。][^\/]+)$/, "record", this.records);
    },
    routes: {
      '': 'default',
      ':domain_name': ''
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
      $('.content').html('');
      $('.content').append(setup.el);
      this.domains();
    },
    nologin_index: function() {
      var banner = new commonView({template: 'banner-nologin'});
      var feature = new commonView({template: 'feature'});
      $('.content').html('');
      $('.content').append(banner.el);
      $('.content').append(feature.el);
    },
    domains: function() {
      this.domainlist = new domainListCollection();
      var domainlist_view = new domainListView({collection: this.domainlist, title: 'DomainList'});
      $('.content').append(domainlist_view.el);
    },
    records: function(domain_name) {
      if (/。/.test(domain)) {
        Backbone.trigger('navigate', domain_name.replace('。', '.'), true);
        return false;
      }  
      var domain = this.domainlist && this.domainlist.findWhere({name: domain_name});
      if(!domain) {
        Backbone.trigger('navigate', '', true);
        return false;
      }
      var domain_id = domain.get('id');
      var recordlist = new recordListCollection({domain_id: domain_id});
      var recordlist_view = new recordListView({collection: recordlist, title: domain_name});
      $('.content .domainlist').remove();
      $('.content').append(recordlist_view.el);
    }
  });

  new route;
  Backbone.history.start();
});

