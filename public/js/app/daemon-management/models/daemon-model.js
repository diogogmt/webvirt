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

  urlRoot: "/daemons",

  initialize: function () {
    console.log("Daemon - initialize");
  },

  save: function () {
    console.log("Daemon save");
    this.urlRoot = "/daemons" + (this.isNew() ? "/add/" : "/update");
    console.log("this.urlRoot: ", this.urlRoot);

    Backbone.Model.prototype.save.apply(this, this);
  },

  destroy: function () {
    console.log("Daemon destroy");
    this.urlRoot = "/daemons/delete";
    console.log("this.urlRoot: ", this.urlRoot);

    Backbone.Model.prototype.destroy.apply(this, this);
  },

  validate: function (attrs, options) {
    console.log("Daemon - validate");
    console.log("args: ", arguments);
    var ip = attrs["ip"] || null;
    var match = ip && ip.match(/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/)
    var len = match && match.length || 0;
    console.log("match: ", match);
    console.log("match.length: ", len);
    
    if (len != 1) {
      console.log("IP is not valid");
      return "Invalid IP";
    }
  }


});