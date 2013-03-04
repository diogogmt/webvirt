
var app = app || {};

app.HostList = Backbone.Collection.extend({
  model: app.Host,
  
  url: "/list/models/hosts",

  initialize: function() {
  }, // End Initialize

  comparator: function(model) {
    return model.get("ip");
  },

  refresh: function() {
    // Clear collection
    var s = function() {
      console.log("Host collection created");
      toastr.success("Libvirt host information refreshed");
    };

    var e = function() {
      console.log("Host collection failed to refresh!");
      toastr.error("Connection to Interface-Server refused", "Host refresh failed:");
    };

    this.fetch({success: s, error: e});
  }
});
