
var app = app || {};

app.HostDescriptionView = Backbone.View.extend({
  /* Initialization */

  // Bind Element to container div
  el: $("#description-area"),

  initialize: function (){

    // Set type
    this.options.type = (this.options.type === "undefined") ? "host" : this.options.type;

    console.log("----HostDescriptionView created.");
  },

  /* Templates */
  stdTemplate: _.template($('#host-record-template').html()),
  blankTemplate: _.template($('#host-blank-template').html()),
  titleTemplate: _.template($('#host-title-template').html()),

  /* Events */
  // events: {
  //   "DOMContentLoaded": render,

  // },

  /* Render */
  render: function() {
    if (this.options.type === "host") {
      console.log("    Model: ");
      console.log(this.model.toJSON());

      var q = this.model.toJSON();

      q.expanded = false;
      q.active = true;
      q.load = this.model.get("load");
      q.memCritical = ( parseFloat(q.memUsed) /  ( parseFloat(q.memFree) + parseFloat(q.memUsed) ) ) < 0.9 ? false : true;
      q.loadCritical = ( parseFloat(q.load) < 1 ) ? false : true;


      this.$el.append( this.stdTemplate(q) );
    }
    else if (typeof(this.options.title) !== "undefined") {
      this.$el.append( this.titleTemplate({title: this.options.title}));
    }
    else {
      this.$el.html( this.blankTemplate() );
    
      console.log("-----Blank template rendered");

    }

    return this;
  }
});
