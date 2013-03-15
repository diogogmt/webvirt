var app = app || {};

app.InfoList = Backbone.Collection.extend({

  model: app.Log,


  start: 1,

  rows: 10,

  type: 'redis',

  level: 'error',

  // Save all of the todo items under the `"todos"` namespace.
  url: function () {
    console.log("ErrorList - url");
    var self = this;
    console.log("start: ", self.start);
    console.log("rows: ", self.rows);

    var url = "/logs/" + self.type + "/" + self.level + "/" + self.start + "/" + self.rows;
    console.log("url: ", url);

    return url;
  },


  fetch: function () {
    console.log("ErrorList - loadErrorLogs");

    var options = {
      success: function (model, response) {
        console.log("ErrorList success");
        console.log("model: ", model);
        console.log("response: ", response);
      },
      update: true,
      remove: false,
      merge: false
    };

    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  parse: function (response) {
    console.log("ErrorList - parse");
    var self = this;
    console.log("start: ", self.start);
    console.log("rows: ", self.rows);
    console.log("response.length: ", response.length);

    console.log("response: ", response);
    if (response.length < self.rows - self.start) {
      // send event to hide the view more button
      console.log("sending event to hide ViewMore btn");
    }

    self.start += response.length;
    self.rows += response.length;

    console.log("ErrorList self: ", self);
    return response;
  },

  getAll: function () {
    console.log("ErrorList - getAll");
    // return this.filter(function (daemon) {
    //   return daemon;
    // });
  },

});





