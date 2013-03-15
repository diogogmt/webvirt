var app = app || {};

app.LogController = Backbone.View.extend({

  el: '#content-area',

  events: {
    'click #viewErrorsBtn': 'displayErrorsTab',
    'click #viewInfoBtn': 'displayInfoTab',
    'click #logInfoBtn': 'logInfo',
    'click #logErrorBtn': 'logError',
    'click #viewMoreBtn': 'viewMore',

  },

  initialize: function() {
    var self = this;

    // Generate HTML structure
    var shell = _.template($('#logPageTemplate').html());
    $("#content-area").append(shell());

    // Create log collections
    this.collections = [];
    this.collections['error'] = new app.LogsList({level: 'error'});
    this.collections['info'] = new app.LogsList({level: 'info'});

    // Set activa tab
    this.currentTab = "error";

    // Create event handlers for error collection
    this.listenTo(this.collections['error'], 'add', this.addOne);
    this.listenTo(this.collections['error'], 'change:viewMoreBtn', this.changeViewMoreBtn);

    // Create event handlers for info collection
    this.listenTo(this.collections['info'], 'add', this.addOne);
    this.listenTo(this.collections['info'], 'change:viewMoreBtn', this.changeViewMoreBtn);

    // Fecth data from server and init collections
    this.collections['error'].fetch();
    self.collections['info'].fetch();

    // Create socketIO connection
    this.logger = io.connect('/logger');
    // Incoming log via socket connection
    this.logger.on('newLog', function (data) {
      var log = new app.Log({
        'timestamp' : data.timestamp,
        'file'      : data.file,
        'line'      : data.line,
        'message'   : data.message,
        'level'     : data.level,
        'id'        : data.id,
      });
      self.socketLog = true;
      self.collections[data.level].add(log);
    });

  },

  render: function() {
  },

  addOne: function (log) {
    // If log level's match current tab then display log on the screen
    if (log.get('level') === this.currentTab) {
      var view = new app.LogView({ model: log });
      // Prepend live logs from socket connection
      var action = this.socketLog ? "prepend" : "append";
      this.socketLog = false;
      $('#logsList')[action](view.render().el);
    }
  },

  addAll: function (logType) {
    // Reset list of logs and add logs from current tab
    this.$('#logsList').html('');
    this.collections[logType].each(this.addOne, this);
  },

  displayErrorsTab: function () {
    $('#viewInfoBtn').removeClass("active");
    $('#viewErrorsBtn').addClass("active");
    this.currentTab = "error";
    this.addAll(this.currentTab);
    this.changeViewMoreBtn();
  },

  displayInfoTab: function () {
    $('#viewErrorsBtn').removeClass("active");
    $('#viewInfoBtn').addClass("active");
    this.currentTab = "info";
    this.addAll(this.currentTab);
    this.changeViewMoreBtn();
  },

  viewMore: function () {
    // Fetch more data from the server
    // Logic to determine range is built in the collection
    this.collections[this.currentTab].fetch();
  },

  changeViewMoreBtn: function () {
    // Update viewMore button visibility
    this.collections[this.currentTab].viewMoreStatus()
      ? $("#viewMoreBtn").show()
      : $("#viewMoreBtn").hide()
  },

  // Temp functions to help debug
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

  

});
