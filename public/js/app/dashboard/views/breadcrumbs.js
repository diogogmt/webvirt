
var app = app || {};

app.BreadcrumbsView = Backbone.View.extend({
  /* Initialization */
  el: $("#heading"),

  initialize: function (){
      if (typeof(this.options.path.curPage) === "undefined") {
      this.options.path = {
        curPage: "Dashboard",
        routes: [] // {path: , sequence: }]
      };
    } // END IF
  },

  /* Templates */
  template: _.template($('#breadcrumbs-template').html()),
  
  /* Events */
  // events: {
  //   "DOMContentLoaded": render,

  // },

  /* Render */
  render: function() {
    // Breadcrumb generator logic here


    // Populate breadcrumb template
    console.log("-----Breadcrumbs rendering");

    this.$el.html( this.template(this.options.path) );
  
  
    return this;
  }
});