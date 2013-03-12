
var app = app || {};

app.LoadingView = Backbone.View.extend({
  el: $('#content-area'),

  initialize: function (){
    console.log("-----RecordView Initializing");
  },

  /* Templates */
  template: _.template($('#loading-template').html()),

  /* Render */
  render: function() {
    // Populate template template
    console.log("------Load rendering");

    this.$el.empty();
    this.$el.html( this.template() );
    console.log("      ...rendered!");
    return this;
  }

});