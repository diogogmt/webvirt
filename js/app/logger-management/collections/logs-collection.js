var app = app || {};

app.LogsList = Backbone.Collection.extend({

  model: app.Log,

  initialize: function (options) {
    options = options || {};
    this.start = options.start || 1;
    this.rows = options.rows || 10;
    this.type = options.type || 'redis';
    this.level = options.level || 'error';
    this.viewMore =  options.viewMore || true;
  },

  url: function () {
    var url = "/logs/" + this.type + "/" + this.level + "/" + this.start + "/" + this.rows;
    return url;
  },

  fetch: function () {
    var options = {
      success: function (model, response) {
      },
      update: true,
      remove: false,
      merge: false
    };

    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  parse: function (response) {
    if (response.length < this.rows - this.start) {
      // Trigger signal to hide viewMore button
      this.viewMore = false;
      this.trigger("change:viewMoreBtn");
    }

    // Increment logs range
    this.start += response.length;
    this.rows += response.length;

    return response;
  },

  viewMoreStatus: function () {
    return this.viewMore;
  }

});
