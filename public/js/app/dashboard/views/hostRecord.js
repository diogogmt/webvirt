
var app = app || {};

app.RecordView = Backbone.View.extend({
  /* Initialization */
  initialize: function (){
    console.log("-----RecordView Initializing");
  },


  /* Templates */
  template: _.template($('#host-record-template').html()),

  /* Render */
  render: function() {
    // Populate template template
    console.log("------Record rendering");

    var q = this.model.toJSON();

    q.expanded = false;
    q.lastActive = "N/A";
    q.active = true;

    q.memCritical = ((q.memFree / q.memTotal) < 0.1) ? true : false; 

    this.$el.html( this.template(q) );
    console.log("      ...rendered!");
    return this;
  },

});