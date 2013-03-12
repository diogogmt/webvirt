console.log("error-view.js");

var app = app || {};

app.ErrorView = Backbone.View.extend({

  tagName:  'li',

  template: _.template($("#logsTemplate").html()),

  // events: {
  //   'click .deleteBtn':  'deleteDaemon',
  //   'keypress .daemonValue': 'updateOnEnter',
  //   'blur .daemonValue':   'updateDaemon'
  // },

  initialize: function() {
    // console.log("ErrorView - initialize")
    // this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    // console.log("ErrorView - render");
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },


});