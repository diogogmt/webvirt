var app = app || {};

// Todo Item View
// --------------

// The DOM element for a todo item...
app.DaemonView = Backbone.View.extend({

  //... is a list tag.
  tagName:  'li',

  // Cache the template function for a single item.
  // template: _.template( $('#item-template').html() ),
  template: $.tmpl,

  // The DOM events specific to an item.
  events: {
    'click .deleteBtn':  'deleteDaemon',
    'keypress .daemonValue': 'updateOnEnter',
    'blur .daemonValue':   'updateDaemon'
  },

  initialize: function() {
    // console.log("DaemonView - initialize")
    $.template("item-template", $("#item-template"));
    
    this.listenTo(this.model, 'change', this.render);
  },

  // Re-renders the titles of the todo item.
  render: function() {
    console.log("DaemonView - render");
    this.$el.html( this.template( 'item-template', this.model.toJSON() ) );
    return this;
  },


  updateOnEnter: function (e) {
    console.log("DaemonView - updateOnEnter");
    if (event.which !== ENTER_KEY) {
      return;
    }

    var ele = $(e.currentTarget);
    var newValue = ele && ele.val();
    console.log("newValue: ", newValue);
    
  },

  deleteDaemon: function () {
    console.log("DaemonView - deleteDaemon");
    var daemon = this.model;
    daemon.destroy({success: function(model, response) {
      app.Daemons.remove(daemon);
    }});
    // consloe.log("e: ", e);
  },

  updateDaemon: function () {
    console.log("DaemonView - updateDaemon");
  },

});