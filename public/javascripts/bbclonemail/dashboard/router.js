console.log("mail/router.js")
BBCloneMail.module("DashboardApp", {
  startWithParent: false,

  define: function(DashboardApp, App, Backbone, Marionette, $, _){
    "use strict";

    // Mail Router
    // -----------

    var Router = Backbone.Router.extend({
      routes: {
        "": "showHosts",
        "hosts": "showHosts",
        "hosts/:id": "showInstances"
      },

      // route filter before method
      // https://github.com/boazsender/backbone.routefilter
      before: function(){
        console.log("DashboardApp.Router - before");
        App.startSubApp("DashboardApp", {
          content1Region: App.content1,
          mainRegion: App.main,
          mainNavRegion: App.mainNav,
          mainFooterRegion: App.mainFooter,
          navRegion: App.nav,
          appSelectorRegion: App.appSelector,
          tempHolderRegion: App.tempHolder
        });
      },

      showHosts: function(){
        console.log("DashboardApp.Router - showHosts");
        console.log("---show breadcrumbs");
        var curPage = "Hosts list"
        App.DashboardApp.controller.showBreadcrumbs(curPage);

        console.log("----showing loading icon");
        App.DashboardApp.controller.showLoadingIcon(App.DashboardApp.controller.mainRegion);

        console.log("----show inbox");
        App.DashboardApp.controller.showHosts();
      },

      showInstances: function(id){
        console.log("DashboardApp.Router - showInstances");


        console.log("----showing loading icon");
        App.DashboardApp.controller.showLoadingIcon(App.DashboardApp.controller.mainRegion);

        var curPage = id + " instances list";
        var routes = [
          {
            hash: "#hosts",
            name: "Hosts list"
          }
        ]
        App.DashboardApp.controller.showBreadcrumbs(curPage, routes);
        App.DashboardApp.controller.showInstances(id);
      },

      // showMailByCategory: function(category){
      //   console.log("DashboardApp.Router - showMailByCategory");
      //   App.DashboardApp.controller.showMailByCategory(category);
      // }
    });

    // Initializer
    // -----------
    //
    // The router must always be alive with the app, so that it can
    // respond to route changes and start up the right sub-app 
    App.addInitializer(function(){
      console.log("Creating Mail.Router")
      var router = new Router();
    });
  }
});
