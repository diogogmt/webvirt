// Mail Inbox
// ----------
//
// Display a list of email

BBCloneMail.module("DashboardApp.Dashboard", function(Dashboard, App, Backbone, Marionette, $, _){
  "use strict";


  Dashboard.Content2Emtpy = Marionette.ItemView.extend({
    template: "#host-content2-empty-template",
  });

  Dashboard.NoHostsItemView = Marionette.ItemView.extend({
    template: "#host-list-empty-template",
  });

  Dashboard.NoHostsController = Marionette.Controller.extend({

    initialize: function(options){
      console.log("Dashboard.NoHostsController.Controller - initialize");
      this.region = options.region;
    },

    show: function(){
      console.log("Dashboard.NoHostsController.Controller - show");
      var view = new Dashboard.NoHostsItemView({
      });

      console.log("----showing view on region");
      console.log("view: ", view);
      this.region.show(view);
      console.log("this.region: ", this.region);
      console.log("view: ", view);
    }
  });

  // Mail Preview
  // ------------
  // Displays an individual preview line item, when multiple
  // mail items are displayed as a list. When clicked, the
  // email item contents will be displayed.

  Dashboard.VirtHostItemView = Marionette.ItemView.extend({
    template: "#email-preview-template",
    tagName: "li",

    // triggers: {
    //   "click": "selected"
    // }
  });

  // Mail List View
  // --------------
  // Displays a list of email preview items.

  Dashboard.VirtHostsListView = Marionette.CollectionView.extend({
    tagName: "ul",
    className: "email-list",
    itemViewEventPrefix: "email",
    itemView: Dashboard.VirtHostItemView
  });

  // Mailbox Component Controller
  // ----------------------------
  //
  // Manages the states / transitions between displaying a
  // list of items, and single email item view

  Dashboard.VirtHosts = Marionette.Controller.extend({
    initialize: function(options){
      console.log("Dashboard.VirtHosts.Controller - initialize");
      this.region = options.region;
      this.email = options.email;
    },

    show: function(){
      console.log("Dashboard.VirtHosts.Controller - show");
      var listView = new Dashboard.VirtHostsListView({
        collection: this.email
      });

      this.listenTo(listView, "email:selected", this._emailSelected);

      this.region.show(listView);
    },

    _emailSelected: function(view, args){
      console.log("Dashboard.VirtHosts.Controller - _emailSelected");
      this.trigger("email:selected", args.model);
    }
  });

});
