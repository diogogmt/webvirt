
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
    var s = function() {
      console.log("Host collection created");
      toastr.success("Libvirt host information refreshed");
    };

    var e = function() {
      console.log("Host collection failed to refresh!");
      toastr.error("Connection to Interface-Server refused", "Host refresh failed:");
      $('#content-area').empty();
    };

    this.fetch({success: s, error: e});
  },

  parse: function (data) {
    if (typeof(data.err) === "string") {
      toastr.error("Host Error: " + data.err);                
    } else if (data.err) {
      _.each(data.err, function (el) {
        toastr.error("Daemon-host list is out of date, or the connection to the daemon @ " + el.ip + " has been lost!", "Daemon-Host IP: " + el.ip);
      });
    }

    return data.hosts;
  }
});
