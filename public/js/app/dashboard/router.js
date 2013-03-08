
var app = app || {};

app.Dashboard = Backbone.Router.extend({
  routes: {
    "host/:ip"   : "listInstances",
    "dashboard"  : "gotoDashboard",
    "daemons"    : "manageDaemons"
  },

  initialize: function () {
    var that = this;

    this.on("route:gotoDashboard", function() {
      console.log("[Return to Dashboard]");
      app.loaded = app.loaded || true;

      app.controller.reset();
    });

    this.on("route:manageDaemons", function() {
      app.controller.displayManage();
    });


    // Set instance list trigger to route #host/ip
    this.on("route:listInstances", function(ip) {
      var instanceDisplay = function () {
        console.log("[Render Instances]");
        console.log("  ...IP: " + ip);
        that.navigate("host/" + ip);
        app.controller.displayInstances(ip);
      }

      if (typeof(app.loaded) !== "undefined") {
        instanceDisplay()
      }
      else  {
        // app.controller.reset();
        
        this.trigger("route:gotoDashboard");
        this.navigate("dashboard");
      }
    });
  }
});