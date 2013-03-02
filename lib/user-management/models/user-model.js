
var client
  , Step
  , bcrypt
  , crypto
  , logger
  , scrypt;

var maxtime = 0.1
  , maxmem = 0
  , maxmemfrac = 0.5;


var _logger;


var User = new function (opt) {
  this.username = opt.username || null;
  this.passwordPlainText = opt.passwordPlainText || null;
  this.password = opt.password || null;
  this.salt = opt.salt || null;
  this.hashKey = this.username ? "users:" + this.username : null;
}



User.prototype.create = function () {
  console.log("User create");

  
}

User.prototype.auth = function () {


}

User.prototype.save = function (cb) {
  console.log("User save");
  var self = this;
  
  Step([
    function checkUsername () {
      console.log("Step checkUsername");
      client.hlen(self.hashKey, this);
    },

    function createUser (err, len) {
      console.log("Step createUser");
      var step = this;

      if (len) {
        logger.error(len ? "Username already exists." : err, {file: __filename, line: __line});
        cb({err: 1});
        this.exitChain();
        return;
      }

      helper.createUser({
        hashKey: this.hashKey,
        password: this.passwordPlainText
      }, step);

    },

    function confirmCreation (err, status) {
      console.log("Step confirmCreation");
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        err = true;
      }

      sendResponse({
        err: err
      });
    }

  ], helper.handleStepException("Step error at User::save - file: " + __filename + "line: " + __line, cb), false); 
}

User.prototype.find = function () {


}

User.prototype.changePassword = function () {

}


var UserFactory = function () {

}

UserFactory.prototype.createUser = function (opt) {
  console.log("UserFactory createUser");

  return new User(opt);
}

modules.exports.inject = function (di) {
  console.log("user-model inject");
  if (!_userFactory) {
    client = di.client;
    Step = di.Step;
    bcrypt = di.bcrypt;
    crypto = di.crypto;
    logger = di.logger;
    scrypt = di.scrypt;

    _userFactory = new UserFactory();
  }
  return _userFactory;

}

