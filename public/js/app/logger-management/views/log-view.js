var app = app || {};

app.LogView = Backbone.View.extend({

  tagName:  'li',

  template: _.template($("#logsTemplate").html()),

  initialize: function() {
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  
});