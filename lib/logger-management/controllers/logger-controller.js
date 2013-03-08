var Step
  , fs
  , _
  , logger
  , helper
  , _loggerController;



function LoggerController (config) {
  console.log("Creating new LoggerController")
}

LoggerController.prototype.allLogs = function (req, res) {
  console.log("LoggerController.allLogs");

  Logger.find({}, function () {
    console.log("Logger find callback");
    console.log("args: ", arguments);
  })

  res.json(null);
}

module.exports.inject = function(di) {
  console.log("LoggerController inject");
  if (!_loggerController) {
    logger = di.logger;
    helper = di.helper;
    Step = di.Step;
    fs = di.fs
    _ = di._;
    Logger = di.loggerModel;
    _loggerController = new LoggerController(di.config);
  }

  console.log("_loggerController: ", _loggerController);
  return _loggerController;
}