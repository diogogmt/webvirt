var app = app || {};


app.WrapperView = Backbone.View.extend({


  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: $('#content-area'),

  events: {
    'keypress #newDaemon': 'createOnEnter',
    'click #addDaemon': 'createDaemon',
  },

  initialize: function() {
    console.log("AppView - initialize");
    this.$newDaemon = this.$('#newDaemon');

    this.listenTo(app.Daemons, 'all', this.render);
    this.listenTo(app.Daemons, 'reset', this.addAll);
    this.listenTo(app.Daemons, 'add', this.addOne);
    this.listenTo(app.Daemons, 'destroy', this.addAll);
    this.listenTo(app.Daemons, 'invalid', this.validationFailed);
    this.listenTo(app.Daemons, 'remove', this.render);
    this.listenTo(app.Daemons, 'sync', this.syncCollection);

    $('input[id=file]').change(function() {
      $('#pretty-input').val($(this).val().replace("C:\\fakepath\\", ""));
    });

    $("#hostManagementForm").ajaxForm({
      url: "/daemons/upload",
      type: "POST",
      dataType: "json",
      clearForm: true,
      beforeSubmit: function (formData, jqForm, options) {
        return true;;
      },
      success: function (data) {
        var keys = _.keys(data);
        var keysLen = keys && keys.length || 0;

        for (var i = 0; i < keysLen; i++) {
          var ip = keys[i];
          var obj = data[ip];
          if (obj.err) {
            toastr.error("Failed to add host " + ip, 'An error occured.');
          } else {
            toastr.success("Add host " + ip, 'Action completed.');
          }
        }
        app.Daemons.fetch();
      },
      error: function (xhr) {
        toastr.error(xhr.responseText, 'An error occured.');
      },
      complete: function () {
        console.log("ajaxform complete");
      }
    });

    app.Daemons.fetch();
  },

  render: function() {
    var daemons = app.Daemons.getAll();
    this.addAll();
  },

  addOne: function (todo) {
    // console.log("addOne");
    // console.log("args: ", arguments);
    var view = new app.DaemonView({ model: todo });
    $('#daemonsList').append(view.render().el);
  },

  addAll: function () {
    this.$('#daemonsList').html('');
    app.Daemons.each(this.addOne, this);
  },

  createDaemon: function(e) {
    var ip = this.$newDaemon.val().trim(); 
    var daemon = app.Daemons.create(
      {
        ip: ip
      },

      {
        'wait': true,
        'success': function (model, res) {
          console.log("Daemons.create success");
          var ip = model.get('ip');
          toastr.success("Daemon with ip " + ip + " was successfuly added.", 'Success!');
        },
        'error': function (model, res) {
          console.log("Daemons.create error");
          var ip = model.get('ip');
          toastr.error("Failed to add daemon " + ip, 'An error occured.');
        },
        'complete': function () {
          console.log("createDaemon complete");
        },
      }
    );
    if (daemon.validationError) {
      toastr.error("Failed to add daemon " + ip, 'An error occured.');
    }
    this.$newDaemon.val('');
  },

  createOnEnter: function( event ) {
    if ( event.which !== ENTER_KEY || !this.$newDaemon.val().trim() ) {
      return;
    }

    this.createDaemon();
  },

  validationFailed: function (model, error, w) {
    if (!model.id) {
      app.Daemons.remove(model);
    }
    toastr.error(error, 'An error occured.');
  },

  syncCollection: function () {
    console.log("\nsyncCollection");
    console.log("args: ", arguments);
  }

});