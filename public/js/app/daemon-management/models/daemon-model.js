var app = app || {};

// Todo Model
// ----------
// Our basic **Todo** model has `title`, `order`, and `completed` attributes.

app.Daemon = Backbone.Model.extend({

  // Default attributes for the todo
  // and ensure that each todo created has `title` and `completed` keys.
  defaults: {
    ip: ''
  },

  idAttribute: "customId",

  initialize: function () {
    console.log("Daemon - initialize");
  },

  validate: function (attrs, options) {
    var ip = attrs["ip"] || null
      , match = ip && ip.match(/^(?!255)\d{1,3}\.(?!255)\d{1,3}\.(?!255)\d{1,3}\.(?!0)(?!255)\d{1,3}$/)
      , len = match && match.length || 0;
    
    if (len != 1) {
      return "Invalid IP";
    }
  }


});