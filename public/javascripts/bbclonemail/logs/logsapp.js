console.log("LogsApp.js");
BBCloneMail.module("LogsApp", function(LogsApp, App){
  "use strict";
 
  // Contact List Views
  // ------------------

  LogsApp.ContactView = Marionette.ItemView.extend({
    // template: "#contact-item-template",
    template: "#log-item-template",
    tagName: "li"
  });

  LogsApp.ContactListView = Marionette.CollectionView.extend({
    itemView: LogsApp.ContactView,
    tagName: "ul",
    id: "contact-list",
    className: "contact-list"
  });
  
  // Category View
  // -------------

  LogsApp.CategoryView = Marionette.ItemView.extend({
    // template: "#contact-categories-view-template"
    template: "#log-levels-tab-template",

    events: {
      "click .log-level-btn": "showLogItems"
      // "click button": "showLogItems"
    },

    showLogItems: function(e){
      console.log("LogsApp.Category.ItemView - showLogItems");
      e.preventDefault();

      var logLevel = $(e.currentTarget).data("level");
      this.trigger("logLevel:changed", logLevel);
    }
  });

  LogsApp.ViewMoreLogsView = Marionette.ItemView.extend({
    template: "#view-more-logs-template",

    events: {
      "click .view-more-logs-btn": "viewMoreLogs"
    },

    viewMoreLogs: function(e){
      console.log("LogsApp.ViewMoreLogsView.ItemView - viewMoreLogs");
      e.preventDefault();

      console.log("----showing loading icon");
      LogsApp.controller.showLoadingIcon(LogsApp.controller.mainFooterRegion);

      this.trigger("more:logs", true);
      Marionette.triggerMethod.call(LogsApp.controller, "more:logs", 123);
    }
  });

  // Contact App Controller
  // -----------------------
  LogsApp.Controller = App.AppController.extend({
    initialize: function(options){
      console.log("LogsApp.Controller - initialize");
      // An array containing the repos for all different log levels
      this.repos = options.repos;
      // Holds which log level tab the user selected
      this.currentTab = options.currentTab;
    },

    changeLogLevel: function (level) {
      console.log("LogsApp.Controller - changeLogLevel");
      console.log("----showing loading icon");
      App.LogsApp.controller.showLoadingIcon(LogsApp.controller.mainRegion);
      LogsApp.controller.mainFooterRegion.close();

      this.currentTab = level;
      // Triggers an event indicating if the selected log level repo is full and sets the visibiity on the "View More" btn
      var hasSpace = this.repos[this.currentTab].hasSpace();
      console.log("---- hasSpace? ", hasSpace ? "YES" : "NO");
      Marionette.triggerMethod.call(App.LogsApp.controller, "toggle:viewmore", this.currentTab, hasSpace);
      var wasFetched = this.repos[this.currentTab].wasFetched();
      console.log("----wasFetched: ", wasFetched);
      this.showLogItems({fetch: !wasFetched});
    },

    // It's invoked by the AppController before the router kicks in
    // Should be used to initialize common pieces shared by all sub-apps
    onShow: function(){
      console.log("LogsApp.Controller - onShow");
    },

    onToggleViewmore: function(level, flag){
      console.log("LogsApp.Controller - onToggleViewmore");
      console.log("----flag: ", flag);
      console.log("----level: ", level);
      this.repos[level].hasSpace(flag);

      // Update "View More" button visibility
      flag
        ? $(".view-more-logs-btn").show()
        : $(".view-more-logs-btn").hide()
    },

    onMoreLogs: function(){
      console.log("LogsApp.Controller - onMoreLogs");
      var that = this;
      $.when(this.repos[this.currentTab].showMore()).then(function (logs) {
        console.log("---jquery when then");
        console.log("----logs: ", logs);
        
        console.log("----showing View More button");
        that.showViewMore();

        var hasSpace = that.repos[that.currentTab].hasSpace();
        console.log("---- hasSpace? ", hasSpace ? "YES" : "NO");
        Marionette.triggerMethod.call(App.LogsApp.controller, "toggle:viewmore", that.currentTab, hasSpace);


      });

      // this.repos[this.currentTab].showMore();
    },

    showLogItems: function(options){
      console.log("LogsApp.Controller - showLogItems");
      var that = this;
      options = options || {};
      var fetch = options.fetch;
      console.log("----fetch: ", fetch);

      console.log("--when this.repos.getAll");
      $.when(this.repos[this.currentTab].getAll(fetch)).then(function (logs) {
        console.log("---jquery when then");
        console.log("----logs: ", logs);
        var view = new LogsApp.ContactListView({
          collection: logs
        });


        that.showViewMore();
        var hasSpace = that.repos[that.currentTab].hasSpace();
        console.log("---- hasSpace? ", hasSpace ? "YES" : "NO");
        Marionette.triggerMethod.call(App.LogsApp.controller, "toggle:viewmore", that.currentTab, hasSpace);

        that.mainRegion.show(view);

        Backbone.history.navigate("logs");

      });
    },

    showLogTabs: function(){
      console.log("LogsApp.Controller - showLogTabs");
      var categoryNav = new LogsApp.CategoryView();
      this.mainNavRegion.show(categoryNav);
      this.listenTo(categoryNav, "logLevel:changed", this.changeLogLevel);
    },

    showViewMore: function(){
      console.log("******LogsApp.Controller - showViewMore");
      var footerView = new LogsApp.ViewMoreLogsView();
      this.mainFooterRegion.show(footerView);
    },

  });

  // Initializers and Finalizers
  // ---------------------------

  LogsApp.addInitializer(function(args){
    console.log("LogsApp.addInitializer");

    var repos = [];
    repos['error'] = new LogsApp.Logs.Repository({level: 'error'});
    repos['info'] = new LogsApp.Logs.Repository({level: 'info'});
    
    LogsApp.controller = new LogsApp.Controller({
      content1Region: args.content1Region,
      mainRegion: args.mainRegion,
      mainNavRegion: args.mainNavRegion,
      mainFooterRegion: args.mainFooterRegion,
      navRegion: args.navRegion,
      appSelectorRegion: args.appSelectorRegion,
      tempHolderRegion: args.tempHolderRegion,
      repos: repos,
      currentTab: "error"
    });

    LogsApp.controller.show();
    App.vent.trigger("app:started", "logs");

  });

  LogsApp.addFinalizer(function(){
    console.log("LogsApp.addFinalizer");
    if (LogsApp.controller){
      App._regionManager._regions.main.close();
      App._regionManager._regions.mainNav.close();
      App._regionManager._regions.mainFooter.close();
      
      LogsApp.controller.mainRegion = LogsApp.controller.tempHolderRegion;
      LogsApp.controller.mainNavRegion = LogsApp.controller.tempHolderRegion;
      LogsApp.controller.mainFooterRegion = LogsApp.controller.tempHolderRegion;
      LogsApp.controller.content1Region = LogsApp.controller.tempHolderRegion;
      LogsApp.controller.navRegion = LogsApp.controller.tempHolderRegion;

      LogsApp.controller.close();
      delete LogsApp.controller;
    }
  });

});
