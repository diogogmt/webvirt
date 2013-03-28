var Step
  , fs
  , _
  , logger
  , helper
  , _loggerController;



function LoggerController (config) {
}

LoggerController.prototype.logsView = function (req, res) {
  console.log("LoggerController.logsView");

  res.render('logs-view', {});
}

LoggerController.prototype.logsTestError = function (req, res) {
  console.log("LoggerController.logsTestError");

  logger.error("Test error", {file: __filename, line: __line});

  res.json(null);
}

LoggerController.prototype.logsTestInfo = function (req, res) {
  console.log("LoggerController.logsTestInfo");

  logger.info("Test info", {file: __filename, line: __line});

  res.json(null);
}

LoggerController.prototype.queryLogs = function (req, res) {
  console.log("LoggerController.queryLogs");
  var params = req.params || {};
  var options = {
    'type': params.type || 'redis',
    'start': params.start || 1,
    'level': params.level || 'error',
    'rows': params.rows || 50,
  };

  logger.query(options, function (err, logs) {
    if (err) {
      logger.info("Error querying redis logs: " + err.toString(), {file: __filename, line: __line});
      res.json(400, "Failed to get logs.");
      return;
    }
    
    res.json(logs);
  })
}

module.exports.inject = function(di) {
  if (!_loggerController) {
    logger = di.logger;
    helper = di.helper;
    Step = di.Step;
    fs = di.fs
    _ = di._;
    Logger = di.loggerModel;
    _loggerController = new LoggerController(di.config);
  }

  return _loggerController;
}