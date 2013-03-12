console.log("controller.js");
var app = app || {};

app.Controller = Backbone.View.extend({

  el: '#content-area',

  // template: _.template( $('#manage-template').html() ),

  events: {
    'click #viewErrorsBtn': 'displayErrorsTab',
    'click #viewInfoBtn': 'displayInfoTab',

    'click #logInfoBtn': 'logInfo',
    'click #logErrorBtn': 'logError',

    'click #viewMoreBtn': 'viewMore',

  },

  initialize: function() {
    console.log("Controller - initialize");
    var self = this;
    // console.log(this.template());
    // this.$el.html(this.template());
    // this.$newDaemon = this.$('#newDaemon');

    // this.listenTo(app.Daemons, 'all', this.render);
    // this.listenTo(app.ErrorList, 'reset', this.addAll);
    // this.listenTo(app.ErrorList, 'add', this.addOne);
    // this.listenTo(app.Daemons, 'destroy', this.addAll);
    // this.listenTo(app.Daemons, 'invalid', this.validationFailed);
    // this.listenTo(app.Daemons, 'remove', this.render);

    this.errorCollection = new app.ErrorList({level: 'error'});
    this.infoCollection = new app.ErrorList({level: 'info'});


    this.listenTo(this.errorCollection, 'reset', this.addAll);
    this.listenTo(this.errorCollection, 'add', this.addOne);
    this.listenTo(this.errorCollection, 'change:viewMoreBtn', this.changeViewMoreBtn);

    this.errorCollection.fetch(function () {
      self.listenTo(this.infoCollection, 'reset', this.addAll);
      self.listenTo(this.infoCollection, 'add', this.addOne);
      self.listenTo(self.infoCollection, 'change:viewMoreBtn', this.changeViewMoreBtn);
    });

    this.infoCollection.fetch();

    this.currentTab = "errorCollection";
  },

  render: function() {
    console.log("Controller - render");
    // var daemons = app.Daemons.getAll();
    // console.log("daemons: ", daemons);
    // this.addAll();
  },

  addOne: function (log) {
    console.log("Controller - addOne");
    // console.log("log: ", log);
    var view = new app.ErrorView({ model: log });
    $('#errorsList').append(view.render().el);
  },

  addAll: function (logType) {
    console.log("Controller - addAll");
    this.$('#errorsList').html('');
    this[logType].each(this.addOne, this);
  },

  displayErrorsTab: function () {
    console.log("displayErrorsTab");
    this.currentTab = "errorCollection";
    this.addAll(this.currentTab);
    this.changeViewMoreBtn();
  },

  displayInfoTab: function () {
    console.log("displayInfoTab");
    this.currentTab = "infoCollection";
    this.addAll(this.currentTab);
    this.changeViewMoreBtn();
  },

  logError: function () {
    $.ajax({
      type: "GET",
      url: "/logs/test/error",
      success: function (data) {
        console.log("success");
      },
      error: function () {
        console.log("error");
      },
      complete: function () {
        console.log("complete");
      },
    });
  },

  logInfo: function () {
    $.ajax({
      type: "GET",
      url: "/logs/test/info",
      success: function (data) {
        console.log("success");
      },
      error: function () {
        console.log("error");
      },
      complete: function () {
        console.log("complete");
      },
    });
  },

  viewMore: function () {
    this[this.currentTab].fetch();
  },

  changeViewMoreBtn: function () {
    console.log("Controller - changeViewMoreBtn");
    this[this.currentTab].viewMoreStatus()
      ? $("#viewMoreBtn").show()
      : $("#viewMoreBtn").hide()

  }

});
