var app = app || {};

// The Application
// ---------------
// Our overall **AppView** is the top-level piece of UI.
app.WrapperView = Backbone.View.extend({

  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: '#content-area',

  // Our template for the line of statistics at the bottom of the app.
  template: _.template( $('#manage-template').html() ),

  // Delegated events for creating new items, and clearing completed ones.
  events: {
    'keypress #newDaemon': 'createOnEnter',
    'click #addDaemon': 'createDaemon',
  },

  // At initialization we bind to the relevant events on the `Todos`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting todos that might be saved in *localStorage*.
  initialize: function() {
    console.log("AppView - initialize");
    console.log(this.template());
    this.$el.html(this.template());
    this.$newDaemon = this.$('#newDaemon');

    this.listenTo(app.Daemons, 'all', this.render);
    this.listenTo(app.Daemons, 'reset', this.addAll);
    this.listenTo(app.Daemons, 'add', this.addOne);
    this.listenTo(app.Daemons, 'destroy', this.addAll);
    this.listenTo(app.Daemons, 'invalid', this.validationFailed);
    this.listenTo(app.Daemons, 'remove', this.render);

    $('input[id=file]').change(function() {
      $('#pretty-input').val($(this).val().replace("C:\\fakepath\\", ""));
    });

    $("#hostManagementForm").ajaxForm({
      url: "/daemons/upload",
      type: "POST",
      dataType: "json",
      clearForm: true,
      beforeSubmit: function (formData, jqForm, options) {
        console.log("beforeSubmit");
        // formData is an array of objects containing the values of the form
        // jqForm is the html form element
        // options are the object initialized with ajaxForm
        // maybe validate the for before submiting
        // if form is not valid return false
        console.log("formData: ", formData);
        console.log("jqForm: ", jqForm);
        console.log("options: ", options);
        return true;;
      },
      success: function (data) {
        console.log("ajaxform success");
        console.log("data: ", data);
        // app.Daemons.trigger("reset");
        var data = data.data;
        var dataLen = data && data.length || 0;
        console.log("dataLen: ", dataLen);
        for (var i = 0; i < dataLen; i++) {
          var obj = data[i];
          console.log("obj: ", obj);
          if (obj.err) {
            toastr.error("Failed to add host " + obj.ip, 'An error occured.');
          } else {
            toastr.success("Add host " + obj.ip, 'Action completed.');
          }
        }
        app.Daemons.fetch();
      },
      error: function () {
        console.log("ajaxform error");
      },
      complete: function () {
        console.log("ajaxform complete");
      }
    });


    console.log("app.Daemons.fetch");
    app.Daemons.fetch();
  },

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    // console.log("WrapperView - render");

    var daemons = app.Daemons.getAll();
    console.log("daemons: ", daemons);
    this.addAll();
    // toastr.info('rendering WrapperView')

  },

  addOne: function (todo) {
    // console.log("WrapperView - addOne");
    var view = new app.DaemonView({ model: todo });
    $('#daemonsList').append(view.render().el);
  },

  addAll: function () {
    // console.log("WrapperView - addAll");
    this.$('#daemonsList').html('');
    app.Daemons.each(this.addOne, this);
  },

  createDaemon: function( event ) {
    console.log("WrapperView - createDaemon");

    app.Daemons.create({
      ip: this.$newDaemon.val().trim(),
    });
    this.$newDaemon.val('');
  },

  createOnEnter: function( event ) {
    console.log("WrapperView - createOnEnter");
    if ( event.which !== ENTER_KEY || !this.$newDaemon.val().trim() ) {
      return;
    }

    this.createDaemon();
  },

  validationFailed: function (model, error, w) {
    console.log("WrapperView - validationFailed");
    console.log("model: ", model);
    console.log("error: ", error);

    if (!model.id) {
      app.Daemons.remove(model);
    }
    toastr.options.fadeOut = 50000;
    toastr.error(error, 'An error occured.');
    
  }

});