
var app = app || {};

app.NavView = Backbone.View.extend({
  el: $("#navigation"),

  initialize: function (){
    this.options.active = this.options.active || "dashboard";
  },

  template: _.template($('#navigation-template').html()),

  render: function() {
    console.log("-----Navigation rendering");

    this.$el.html( this.template({active: this.options.active}) );
  
    return this;
  }
});