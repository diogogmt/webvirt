
var app = app || {};

app.PaginationView = Backbone.View.extend({
  /* Initialization */
  el: $("#pagination"),

  initialize: function (){
    // Bind model change event
    // this.listenTo(this.model, "change", this.render);

    // Compute max pages
  },

  /* Templates */
  template: _.template($('#pagination-template').html()),
  
  /* Events */
  // events: {
  //   "DOMContentLoaded": render,

  // },

  render: function() {
    // Pagination generator logic here
    var data = {
      prev: false, 
      prevLink: "#",
      pageLinks: [
        {
          active: true,
          link: "#",
          order: 1
        }
      ],
      next: false,
      nextLink: "#"
    };
    // Populate pagination template
    console.log("-----Pagination rendering");

    this.$el.html( this.template(data) );

    return this;
  }
});