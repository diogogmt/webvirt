console.log("mailapp.js")
BBCloneMail.module("DashboardApp", function(DashboardApp, App){
  "use strict";

  // Controller
  // ----------
  DashboardApp.Controller = App.AppController.extend({
    initialize: function(options){
      console.log("DashboardApp.Controller - initialize");
      options = options || {};
      this.repo = options.repo;
    },
    
    showHosts: function(){
      console.log("DashboardApp.Controller - showHosts");
      var that = this;
      $.when(this.repo.getAll()).then(function (emailList) {
        that.mainNavRegion.close();
        var navView = new DashboardApp.Dashboard.Content2Emtpy();
        that.mainNavRegion.show(navView);

        var inbox = new App.DashboardApp.Dashboard.VirtHosts({
          region: that.mainRegion,
          email: emailList
        });

        that.showComponent(inbox);
      });

      Backbone.history.navigate("#hosts");
    },

    showInstances: function(id){
      console.log("DashboardApp.Controller - showInstances");
      var that = this;
      $.when(this.repo.getById(id)).then(function (email) {
        var host = that.repo.getEmailCollection().get(id);
        var navView = new DashboardApp.Dashboard.VirtHostItemView({
          model: host
        });
        that.mainNavRegion.show(navView);
        var viewer = new App.DashboardApp.Dashboard.MailViewer({
          region: that.mainRegion,
          email: email
        });

        that.showComponent(viewer);

        Backbone.history.navigate("#hosts/" + email.ip);
      });

      
    },

    onShow: function(){
      console.log("DashboardApp.Controller - onShow");
    },

    onInstanceRefresh: function(ip){
      console.log("DashboardApp.Controller - onInstanceRefresh");
      this.showInstances(ip);
    },

    onInstanceAction: function(options){
      console.log("DashboardApp.Controller - onInstanceAction");
      var that = this;
      options = options || {};
      var ip = options.ip;
      var action = options.action;
      var name = options.name;

      var url = "http://142.204.133.138:3000/" + action + "/" + ip + "/" + name;
      var options = {
        type: 'PUT',
        url: url,
        success: function (response) {
          toastr.success(response, 'Success.');
          that.showInstances(ip);
        },
        error: function (jqXHR) {
          toastr.error(jqXHR.responseText, 'Error.');
        }
      }

      App.ajax(options).then(function () {
      })

    },

  });

  // Initializers
  // ------------

  DashboardApp.addInitializer(function(args){
    console.log("DashboardApp.addInitializer");
    var repo = new DashboardApp.Dashboard.Repository();

    DashboardApp.controller = new DashboardApp.Controller({
      content1Region: args.content1Region,
      navRegion: args.navRegion,
      mainNavRegion: args.mainNavRegion,
      mainRegion: args.mainRegion,
      mainFooterRegion: args.mainFooterRegion,
      appSelectorRegion: args.appSelectorRegion,
      tempHolderRegion: args.tempHolderRegion,
      repo: repo
    });

    DashboardApp.controller.show();
    App.vent.trigger("app:started", "mail");
  });

  DashboardApp.addFinalizer(function(){
    if (DashboardApp.controller){
      App._regionManager._regions.main.close();
      App._regionManager._regions.mainNav.close();
      App._regionManager._regions.mainFooter.close();

      // Assign a dummy place holder to all regions so the callbacks won't
      // interfer with other Apps
      DashboardApp.controller.mainRegion = DashboardApp.controller.tempHolderRegion;
      DashboardApp.controller.mainNavRegion = DashboardApp.controller.tempHolderRegion;
      DashboardApp.controller.mainFooterRegion = DashboardApp.controller.tempHolderRegion;
      DashboardApp.controller.content1Region = DashboardApp.controller.tempHolderRegion;
      DashboardApp.controller.navRegion = DashboardApp.controller.tempHolderRegion;
      DashboardApp.controller.close();
      
      delete DashboardApp.controller;
    }
  });

});
