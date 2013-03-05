
var client
  , Step
  , bcrypt
  , crypto
  , logger
  , scrypt
  , helper;

// Singleton
var _userFactory


var User = function (opt) {
  console.log("User constructor");
  opt = opt || {};
  this.username = opt.username || null;
  this.passwordPlainText = opt.passwordPlainText || null;
  this.password = opt.password || null;
  this.salt = opt.salt || null;
  this.hashKey = this.username ? "users:" + this.username : null;
  this.scryptConfig = opt.scryptConfig || {};
}



User.prototype.create = function () {
  console.log("User create");  
}

User.prototype.auth = function (cb) {
  var self = this;

  Step([
    function getUserInfo () {
      console.log("Step getUserInfo");
      client.hgetall(self.hashKey, this);
    },

    function authUser (err, data) {
      console.log("Step authUser");
      var salt = data.salt
        , passwordDb = data.password
        , saltLength
        , saltedPass;

      var step = this;

      if (err || !salt || ! passwordDb) {
        logger.error("An error occured, please try again.", {file: __filename, line: __line});
        logger.error(err, {file: __filename, line: __line});
        cb({err: 1});
        this.exitChain();
        return;
      }

      saltLength = salt.length;
      saltedPass = salt.slice(0,saltLength / 2)
        + self.passwordPlainText
        + salt.slice(saltLength / 2, saltLength);

      scrypt.verifyHash(passwordDb, saltedPass, this); 

    },

    function checkResults (err, result) {
      console.log("Step checkResults");
      if (err) {
        logger.error(err, {file: __filename, line: __line});
      }

      cb({err: err})
    }

  ], helper.handleStepException("Step error at User::auth - file: " + __filename + "line: " + __line, cb), false);

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
        'hashKey': self.hashKey,
        'password': self.passwordPlainText,
        'scryptConfig': self.scryptConfig
      }, step);

    },

    function confirmCreation (err, status) {
      console.log("Step confirmCreation");
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        err = true;
      }

      cb({err: err});
      
    }

  ], helper.handleStepException("Step error at User::save - file: " + __filename + "line: " + __line, cb), false); 
}

User.prototype.find = function () {


}

User.prototype.changePassword = function (newPasswordPlainText, cb) {
  var self = this;

  Step([
    function getUsername () {
      client.hmget(self.hashKey, "salt", "password", this);
    },

    function checkCurrentPassowrd (err, data) {
      var salt = data[0]
        , passwordDb = data[1]
        , saltLength
        , saltedPass
        , step = this;

      if (err || !salt || !passwordDb) {
        logger.error("An error occured, please try again.", {file: __filename, line: __line});
        logger.error(err, {file: __filename, line: __line});
        cb({err: 1});
        step.exitChain();
        return;
      }

      saltLength = salt.length;
      saltedPass = salt.slice(0,saltLength / 2)
        + self.passwordPlainText
        + salt.slice(saltLength / 2, saltLength);
    
      scrypt.verifyHash(passwordDb, saltedPass, step); 
    },

    function checkResults (err, result) {
      var step = this;
      
      if (err || !result) {
        logger.error("An error occured, please try again.", {file: __filename, line: __line});
        logger.error(err, {file: __filename, line: __line});
        cb({err: 1});
        step.exitChain();
        return;
      }

      helper.createUser({
        'hashKey': self.hashKey,
        'password': newPasswordPlainText,
        'scryptConfig': self.scryptConfig
      }, step);

    },

    function confirmCreation (err, status) {
      if (err) {
        logger.error(err, {file: __filename, line: __line});
      }

      cb({err: err});
    }

  ], helper.handleStepException("Step error at User::changePassword - file: " + __filename + "line: " + __line, cb), false); 
}


var UserFactory = function (config) {
  this.scryptConfig = config && config.scryptConfig || {};
}

UserFactory.prototype.createUser = function (opt) {
  console.log("UserFactory createUser");
  opt = opt || {};
  opt.scryptConfig = this.scryptConfig;
  return new User(opt);
}

module.exports.inject = function (di) {
  if (!_userFactory) {
    client = di.client;
    Step = di.Step;
    bcrypt = di.bcrypt;
    crypto = di.crypto;
    logger = di.logger;
    helper = di.helper;
    scrypt = di.scrypt;

    _userFactory = new UserFactory(di.config);
  }
  return _userFactory;

}

