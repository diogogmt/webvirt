var app = app || {};


app.DaemonView = Backbone.View.extend({

  tagName:  'li',


  template: $.tmpl,

  events: {
    'click .deleteBtn':  'deleteDaemon',
    'keypress .daemonValue': 'updateOnEnter',
    'blur .daemonValue':   'updateDaemon'
  },

  initialize: function() {
    $.template("item-template", $("#item-template"));
    
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    this.$el.html( this.template( 'item-template', this.model.toJSON() ) );
    return this;
  },


  updateOnEnter: function (e) {
    if (event.which !== ENTER_KEY) {
      return;
    }

    var ele = $(e.currentTarget);
    var newValue = ele && ele.val();
    this.model.set({ip: newValue}, {validate: true});
  },

  deleteDaemon: function () {
    var daemon = this.model;
    daemon.destroy({
      success: function(model, res) {
        var ip = model.get('ip');
        if (res.err) {
          toastr.error("Failed to delete daemon " + ip, 'An error occured.');
        } else {
          toastr.success("Daemon with ip  " + ip + " was successfuly deleted.", 'Success!');
        }
        app.Daemons.remove(daemon);
      }
    });
  },

  updateDaemon: function () {
    console.log("DaemonView - updateDaemon");
  },

});