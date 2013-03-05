 var app = app || {};

// Todo Collection
// ---------------

// The collection of todos is backed by *localStorage* instead of a remote
// server.
var DaemonsList = Backbone.Collection.extend({

  // Reference to this collection's model.
  model: app.Daemon,

  // Save all of the todo items under the `"todos"` namespace.
  url: "/daemons",

  parse: function (response) {
    console.log("response: ", response);
    return data = _.map(response.daemons, function (ip) {
      return {
        customId: ip,
        ip: ip
      };
    });
   
  },

  getAll: function () {
    // console.log("DaemonsList - getAll");
    return this.filter(function (daemon) {
      return daemon;
    });
  },

});

// Create our global collection of **Todos**.
app.Daemons = new DaemonsList();