console.log("contacts - router.js")
BBCloneMail.module("LogsApp", {
  startWithParent: false,
  define: function(LogsApp, App){

    var Router = Backbone.Router.extend({
      routes: {
        "logs": "showLogs",
      },

      // route filter before method
      // https://github.com/boazsender/backbone.routefilter
      before: function(){
        console.log("Contacts.Router - before");
        App.startSubApp("LogsApp", {
          content1Region: App.content1,
          mainRegion: App.main,
          mainNavRegion: App.mainNav,
          mainFooterRegion: App.mainFooter,
          navRegion: App.nav,
          appSelectorRegion: App.appSelector,
          tempHolderRegion: App.tempHolder
        });
      },

      showLogs: function(){
        console.log("Contacts.Router - showLogs");
        var curPage = "WebVirt Logs"
        // Display breadcrumbs
        App.LogsApp.controller.showBreadcrumbs(curPage);
        console.log("----showing loading icon");
        App.LogsApp.controller.showLoadingIcon(App.LogsApp.controller.mainRegion);



        console.log("----showing log tabs");
        // Render all views
        App.LogsApp.controller.showLogTabs();
        App.LogsApp.controller.showLogItems({fetch: true});
        // App.LogsApp.controller.showViewMore();
      }
    });

    // Initializer
    // -----------
    //
    // The router must always be alive with the app, so that it can
    // respond to route changes and start up the right sub-app 
    App.addInitializer(function(){
      console.log("Creating Contacts.router")
      var router = new Router();
    });

  }
});
