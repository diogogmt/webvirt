console.log("appSelector.js");
// Application Selector
// --------------------
//
// Display the list of applications to choose from
// and move to that application when the selection is changed
BBCloneMail.AppSelector = (function(App, Marionette){

  // Selector View
  // -------------

  // SelectorView = Marionette.ItemView.extend({
  //   template: "#app-selector-template",
  //   tagName: "select",

  //   events: {
  //     "change": "appSelected"
  //   },

  //   appSelected: function(e){
  //     console.log("AppSelector.SelectorView - appSelected");
  //     e.preventDefault();

  //     var name = $(e.currentTarget).val();
  //     this.trigger("app:selected", name);
  //   },

  //   setCurrent: function(appName){
  //     console.log("AppSelector.SelectorView - setCurrent");
  //     this.$("[value=" + appName + "]").attr("selected", "selected");
  //   }
  // });

  SelectorView = Marionette.ItemView.extend({
    template: "#app-selector-template",
    tagName: "div",

    events: {
      "click .menu-options": "appSelected"
    },

    appSelected: function(e){
      console.log("AppSelector.SelectorView - appSelected");
      e.preventDefault();
      // console.log("----category: ", $(e.currentTarget).data("category"));
      var name = $(e.currentTarget).data("category");
      console.log("----name: ", name);
      this.trigger("app:selected", name);
    },

    setCurrent: function(appName){
      console.log("AppSelector.SelectorView - setCurrent");
      this.$("[value=" + appName + "]").attr("selected", "selected");
    }
  });
  
  // Component Controller
  // --------------------
  //
  // Runs the app selector component, coordinating
  // between the view and the various other parts of
  // the app selection process

  console.log("return Marionette.Controller.extend");
  return Marionette.Controller.extend({

    // Hang on to the region in which the 
    // selector will be displayed
    initialize: function(options){
      console.log("AppSelector.Controller - initialize");
      this.region = options.region;
      this.currentApp = options.currentApp;
      App.vent.on("app:started", this._setCurrentApp, this);
    },

    onClose: function(){
      console.log("AppSelector.Controller - onClose");
      App.vent.off("app:started", this._setCurrentApp, this);
    },

    // show the selector view and set up the
    // event handler for changing the current app
    show: function(){
      console.log("AppSelector.Controller - show");
      this.selectorView = this._getSelectorView();
      this.region.show(this.selectorView);
    },

    _getSelectorView: function(){
      console.log("AppSelector.Controller - _getSelectorView");
      var view = new SelectorView();

      // set the current app on first render
      this.listenTo(view, "render", function(){
        console.log("_setCurrentApp to: ", this.currentApp);
        this._setCurrentApp(this.currentApp);
      });

      // listen to the app selection change
      this.listenTo(view, "app:selected", this._appSelected);

      return view;
    },

    // store the current app and show it in the view
    _setCurrentApp: function(appName){
      console.log("AppSelector.Controller - _setCurrentApp");
      console.log("----appName: ", appName);
      this.selectorView.setCurrent(appName);
      this.currentApp = appName;
    },

    // handle app selection change
    _appSelected: function(app){
      console.log("AppSelector.Controller - _appSelected");
      console.log("---- app selected: ", app);
      Backbone.history.navigate(app, true);
    },

    // close the region and view when this component closes
    onClose: function(){
      console.log("AppSelector.Controller - onClose");
      if (this.region){
        this.region.close();
        delete this.region;
      }
    }
  });

})(BBCloneMail, Marionette);
