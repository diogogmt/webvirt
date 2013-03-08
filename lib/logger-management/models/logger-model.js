var client
  , Step
  , bcrypt
  , crypto
  , logger
  , scrypt
  , sliced
  , helper;

var _loggerModel





// Logger Model
var LoggerModel = function (doc) {
}

LoggerModel.compile = function (config) {
  function model (doc) {
    LoggerModel.call(this, doc);
  }

  model.__proto__ = LoggerModel;
  model.prototype.__proto__ = LoggerModel.prototype;

  return model;
}


LoggerModel.find = function (fields, cb) {
  var self = this;

  client.lindex("winston", 1, function (err, item) {
    console.log("lindex callback");
    console.log("args: ", arguments);
    console.log("item: ", item);
    console.log("item.level: ", item.level);
    console.log(JSON.parse(item));
  })

}

LoggerModel.count = function (cb) {

}

// TODO - implement
LoggerModel.update = function (conditions, fields, cb) {
}

// TODO - implement
LoggerModel.prototype.remove = function (cb) { 
}

// TODO - implement
LoggerModel.removeAll = function (cb) { 

}

module.exports.inject = function (di) {
  if (!_loggerModel) {
    client = di.client;
    Step = di.Step;
    bcrypt = di.bcrypt;
    crypto = di.crypto;
    logger = di.logger;
    helper = di.helper;
    scrypt = di.scrypt;
    sliced = di.sliced;

    _loggerModel = LoggerModel.compile(di.config);
  }
  return _loggerModel;

}
