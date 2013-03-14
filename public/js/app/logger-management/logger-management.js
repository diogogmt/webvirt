var app =  app ||  {};

$(function () {

  var CustomLogger = function () {
    this.logTemplate = $("#logsTemplate").html();

    this.start = 1;
    this.rows = 10;
    this.type = 'redis';
    this.level = 'error';

    this.bindEventHandlers();
    this.createSocketIO();
    this.loadLogs();
  }


  CustomLogger.prototype.bindEventHandlers = function () {
    this.logInfoHandler();
    this.logErrorHandler();
    this.viewMoreHandler();
  }

  CustomLogger.prototype.loadLogs = function () {
    console.log("loadLogs");
    var self = this;


    $.ajax({
      type: "GET",
      url: "/logs/"+ self.type + "/" + self.level + "/" + self.start + "/" + self.rows,
      success: function (data) {
        console.log("success");
        console.log("data: ", data);
        var dataLen = data.length;
        var i;
        
        for (i = 0; i < dataLen; i ++) {
          $("#logsList").append(_.template(self.logTemplate, {'log': data[i]}));
        }

        console.log("dataLen: ", dataLen);
        console.log("self.rows - self.start: ", self.rows - self.start);
        // Hide the view more btn if all items are being displayed
        if (dataLen < self.rows - self.start) {
          $("#viewMoreBtn").hide();
        }
        self.start += dataLen;
        self.rows += dataLen;
      },
      error: function () {
        console.log("error");
      },
      complete: function () {
        console.log("complete");
      },
    })
  }

  CustomLogger.prototype.logInfoHandler = function () {
    $("#logInfoBtn").click(function (e) {
      console.log("logInfoHandler click");
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
      })
    });
  };


  CustomLogger.prototype.logErrorHandler = function () {
    $("#logErrorBtn").click(function (e) {
      console.log("logErrorBtn click");
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
      })
    });
  }

  CustomLogger.prototype.viewMoreHandler = function () {
    var self = this;
    $("#viewMoreBtn").click(function (e) {
      console.log("viewMoreBtn click");

      self.loadLogs();
    });
  }

  CustomLogger.prototype.createSocketIO = function () {
    var self = this;
    var logger = io.connect('http://142.204.133.138/logger');
    // Socket io events
    logger.on('connect', function () {
      console.log("logger Client Connected");
    });
    logger.on('entering', function (data) {
      console.log("Page visit");
    });
    logger.on('leaving', function (data) {
      console.log("Page exit");
    });
    logger.on('error', function (data) {
      console.log("Received new error");
      console.log("data: ", data);
      $("#logsList").prepend(_.template(self.logTemplate, {'log': data}));
    });
    logger.on('info', function (data) {
      console.log("Received new info");
      console.log("data: ", data);
    });
  }
  app.logger = new CustomLogger();
});