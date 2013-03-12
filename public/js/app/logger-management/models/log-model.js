console.log("log-model.js");
var app = app || {};

// Todo Model
// ----------
// Our basic **Todo** model has `title`, `order`, and `completed` attributes.

app.Log = Backbone.Model.extend({

  defaults: {
    'timestamp' : '',
    'file'      : '',
    'line'      : '',
    'message'   : '',
  },

  idAttribute: "id",

  initialize: function () {
    // console.log("Log - initialize");
  },

});