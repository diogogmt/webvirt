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
      var options = {
        'success': function (model, res) {
          console.log("showHosts - success");
          console.log("arguments: ", arguments);
          var inbox = new App.DashboardApp.Dashboard.VirtHosts({
            region: that.mainRegion,
            email: model
          });

          that.showComponent(inbox);

        },
        'error': function (model, res) {
          console.log("showHosts - error");
          console.log("arguments: ", arguments);
          toastr.error(res.responseText, "Error");
          that.showNoHosts();
        },
      }
      that.mainNavRegion.close();
      var navView = new DashboardApp.Dashboard.Content2Emtpy();
      that.mainNavRegion.show(navView);

      $.when(this.repo.getAll(options));

      Backbone.history.navigate("#hosts");
    },

    showInstances: function(id){
      console.log("DashboardApp.Controller - showInstances");
      var that = this;
      var options = {
        'success': function (model, res) {
          console.log("showInstances - success");
          console.log("arguments: ", arguments);
          that._showInstances(id);
        },
        'error': function (model, res) {
          console.log("showInstances - error");
          console.log("arguments: ", arguments);
          toastr.error(res.responseText, "Error");
          toastr.error("Need to display a view with error info", "Info");
          // that.showNoHosts();
        },
      }

      $.when(this.repo.getAll(options));

      
    },

    _showInstances: function(id){
      console.log("DashboardApp.Controller - _showInstances");
      console.log("---id: ", id);
      var that = this;
      $.when(this.repo.getById(id)).then(function (email) {
        var host = that.repo.getHostCollection().get(id);
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

    showNoHosts: function(){
      console.log("\n\n***\n\nDashboardApp.Controller - onNoHosts");
      var viewer = new DashboardApp.Dashboard.NoHostsController({
        region: this.mainRegion,
      });

      console.log("---viewer: ", viewer);
      this.showComponent(viewer);
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

      var url = "/" + action + "/" + ip + "/" + name;
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
