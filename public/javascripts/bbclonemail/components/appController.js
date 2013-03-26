console.log("appController.js");
// AppController
// --------------
//
// A base controller object to hide a lot of the 
// guts and implementation detail of showing the
// lists and individual items



BBCloneMail.AppController = (function(App, Marionette){
  "use strict";


  var LoadingView = Marionette.ItemView.extend({
    template: "#loading-template",
  });

  var BreadcrumbsView = Marionette.ItemView.extend({
    template: "#breadcrumbs-template",
  });

  var Breadcrumbs = Backbone.Model.extend({
    defaults: {
      routes: [],
      curPage: '',
    },

    initialize: function () {
      console.log("Breabcrumbs.Model - initialize");
    },

  });

  var AppController = Marionette.Controller.extend({
    constructor: function(options){
      console.log("\n**AppController - constructor");
      options = options || {};

      this.content1Region = options.content1Region;
      this.mainRegion = options.mainRegion;
      this.mainNavRegion = options.mainNavRegion;
      this.mainFooterRegion = options.mainFooterRegion;
      this.navRegion = options.navRegion;
      this.appSelectorRegion = options.appSelectorRegion;
      this.tempHolderRegion = options.tempHolderRegion;

      console.log("----creating breadcrumbs");
      this.breadcrumbs = new Breadcrumbs();

      Marionette.Controller.prototype.constructor.call(this, options);
    },

    // show this component in the app
    show: function(){
      console.log("AppController - show");
      this._showAppSelector("mail");
      console.log("calling method show on this: ", this);
      Marionette.triggerMethod.call(this, "show");
    },

    // show the specified component, closing any currently
    // displayed component before showing the new one
    showComponent: function(component){
      console.log("AppController - showComponent");
      console.log("----component: ", component);
      console.log("----this._currentComponent: ", this._currentComponent);
      if (this._currentComponent){
        console.log("----close current component");
        this._currentComponent.close();
      }

      console.log("show component")
      component.show();
      this._currentComponent = component;
    },

    showBreadcrumbs: function (curPage, routes) {
      console.log("AppController - showBreadcrumbs");
      this.content1Region.close();

      this.breadcrumbs.set('routes', routes);
      this.breadcrumbs.set('curPage', curPage);
      var navView = new BreadcrumbsView({
        model: this.breadcrumbs
      });
      console.log("----navView: ", navView);
      console.log("---- this.mainNavRegion: ", this.content1Region);
      this.content1Region.show(navView);
    },

    showLoadingIcon: function (region) {
      console.log("AppController - waitForLoading");
      console.log("----create LoadingView");
      var view = new LoadingView();
      console.log("----show LoadingView");
      region.show(view);
    },

    // Show the app selector drop down list, which allows
    // the app to be changed from mail app to contacts app
    _showAppSelector: function(appName){
      console.log("AppController - _showAppSelector");
      console.log("appName: ", appName);
      var appSelector = new App.AppSelector({
        region: this.appSelectorRegion,
        currentApp: appName
      });

      console.log("calling AppSelector show()")
      appSelector.show();
    }
  });

  return AppController;
})(BBCloneMail, Marionette);
