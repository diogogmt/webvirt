
var app = app || {};

app.User = Backbone.Model.extend({
  initialize: function() {
    if (!this.get("username")) this.set("username", "username");
  }
});
