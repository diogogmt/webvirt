var app = app || {};

app.Log = Backbone.Model.extend({

  defaults: {
    'timestamp' : '',
    'file'      : '',
    'line'      : '',
    'message'   : '',
  },

  idAttribute: "id",

  initialize: function () {
  },

  save: function () {
    return true;
  }

});