console.log("bbclonemail.js");
BBCloneMail = (function(Backbone, Marionette){
  "use strict";

  console.log("create Marionette app");
  var App = new Marionette.Application();

  App.addRegions({
    nav: "#navigation",
    content1: "#content-one",
    mainNav: "#content-two",
    main: "#content-three",
    mainFooter: "#content-four",
    appSelector: "#navigation",
    tempHolder: "#temp-holder",
  });
  // appSelector: "#app-selector"

  App.on("initialize:after", function(){
    console.log("App.on initialize:after");
    if (Backbone.history){
      console.log("starting backbone history");
      Backbone.history.start();
    }
  });

  App.startSubApp = function(appName, args){
    console.log("App.startSubApp");
    console.log("---- appName: ", appName);
    console.log("---- args: ", args);
    var currentApp = App.module(appName);
    if (App.currentApp === currentApp){ return; }

    if (App.currentApp){
      App.currentApp.stop();
    }

    App.currentApp = currentApp;
    console.log("starting app...");
    currentApp.start(args);
  };

  App.ajax = function (options) {
    console.log("App - ajax");
    console.log("----options: ", options);
    var deferred = $.Deferred(function (d) {
      console.log("----$.Deferred");
      var defaults = {
          cache: false,
          type: 'get',
          traditional: true,
          dataType: 'json'
      },
      settings = $.extend({}, defaults, options);
      console.log("----settings: ", settings);
      d.done(settings.success);
      d.fail(settings.error);
      d.done(settings.complete);

      var jqXHRSettings = $.extend({}, settings, {
        success: function (response, textStatus, jqXHR) {
          console.log("---ajax success callback");
          d.resolve(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("---ajax error callback");
            console.log(jqXHR);
            d.reject(jqXHR);
        },
        complete: d.resolve
      });

      console.log("---firing ajax call");
      $.ajax(jqXHRSettings);
    });

    var promise = deferred.promise();

    promise.success = deferred.done;
    promise.error = deferred.fail;
    promise.complete = deferred.done;

    console.log("---returining promise");
    return promise;
  };

  return App;
})(Backbone, Marionette);
