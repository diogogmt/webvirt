
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
    q.active = true;

    q.memCritical = ( parseFloat(q.memUsed) /  ( parseFloat(q.memFree) + parseFloat(q.memUsed) )) < 0.9 ? false : true;
    q.loadCritical = ( parseFloat(q.load) < 1) ? false : true;

    this.$el.html( this.template(q) );
    console.log("      ...rendered!");
    return this;
  },

});