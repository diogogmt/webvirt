console.log("mailItemView.js");
// Mail Viewer
// -----------
//
// View an individual email

BBCloneMail.module("DashboardApp.Dashboard", function(Dashboard, App, Backbone, Marionette, $, _){
  "use strict";
  
  // Mail View
  // ---------
  // Displays the contents of a single mail item.

  Dashboard.MailView = Marionette.ItemView.extend({
    template: "#email-view-template",
    tagName: "li",

    events: {
      "click .instance-action": "doAction",
      "click .refresh": "refresh"
      // "click button": "showLogItems"
    },

    doAction: function(e){
      console.log("LogsApp.Category.ItemView - doAction");
      e.preventDefault();

      var options = {};
      options.action = $(e.currentTarget).data("action");
      options.ip = $(e.currentTarget).data("ip");
      options.name = $(e.currentTarget).data("name");
      console.log("----action: ", options);
      Marionette.triggerMethod.call(App.DashboardApp.controller, "instance:action", options);
    },

    refresh: function(e){
      console.log("LogsApp.Category.ItemView - refresh");
      e.preventDefault();

      var ip = $(e.currentTarget).data("ip");
      console.log("----ip: ", ip);
      Marionette.triggerMethod.call(App.DashboardApp.controller, "instance:refresh", ip);
    },

  });

  Dashboard.MailListView2 = Marionette.CollectionView.extend({
    itemView: Dashboard.MailView,
    tagName: "ul",
  });

  Dashboard.MailViewer = Marionette.Controller.extend({

    initialize: function(options){
      console.log("Dashboard.MailViewer.Controller - initialize");
      this.region = options.region;
      this.email = options.email;
    },

    show: function(){
      console.log("Dashboard.MailViewer.Controller - show");
      console.log("---this.email: ", this.email);
      console.log("creating Marionette.CollectionView")
      var view = new Dashboard.MailListView2({
        collection: this.email
      });

      console.log("----showing view on region");
      console.log("view: ", view);
      this.region.show(view);
      console.log("this.region: ", this.region);
      console.log("view: ", view);
    }
  });

});
