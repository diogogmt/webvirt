var app = app || {};

app.LogoutView = Backbone.View.extend({
  /* Initialization */

  // Bind to HTML element
  el: $("#logout"),

  // model: User, <-- No model yet

  initialize: function (){
    // Bind model change event
    // this.listenTo(this.model, "change", this.render);
  },

  /* Templates */
  template: _.template($('#logout-template').html()),
  

  /* Events */
  // events: {
  //   "DOMContentLoaded": render,

  // },

  /* Render */

  render: function() {
    // User generator logic here
    var data = {"username": username};
    // Populate logout template
    console.log("-----Logout rendering");

    this.$el.html( this.template(data) );

    return this;
  }
});