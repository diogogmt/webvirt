var app = app || {};

// The Application
// ---------------
// Our overall **AppView** is the top-level piece of UI.
app.WrapperView = Backbone.View.extend({

  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: '#wrapperApp',

  // Our template for the line of statistics at the bottom of the app.
  // statsTemplate: _.template( $('#stats-template').html() ),

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
    this.$newDaemon = this.$('#newDaemon');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Daemons, 'all', this.render);
    this.listenTo(app.Daemons, 'reset', this.addAll);
    this.listenTo(app.Daemons, 'add', this.addOne);
    this.listenTo(app.Daemons, 'destroy', this.addAll);


    console.log("app.Daemons.fetch");
    app.Daemons.fetch();
  },

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    // console.log("WrapperView - render");

    var daemons = app.Daemons.getAll();
    console.log("daemons: ", daemons);



    this.$main.show();
    this.$footer.show();

    // this.$footer.html(this.statsTemplate({
    //   completed: completed,
    //   remaining: remaining
    // }));

  },

  addOne: function (todo) {
    console.log("WrapperView - addOne");
    var view = new app.DaemonView({ model: todo });
    $('#daemonsList').append(view.render().el);
  },

  // Add all items in the **Todos** collection at once.
  addAll: function () {
    console.log("WrapperView - addAll");
    this.$('#daemonsList').html('');
    app.Daemons.each(this.addOne, this);
  },

  // If you hit return in the main input field, create new Todo model,
  // persisting it to localStorage.
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

});