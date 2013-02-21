var client = require("./../db-conn").client
  , Step = require('step')
  , bcrypt = require('bcrypt-nodejs')
  , crypto = require('crypto')
  , logger
  , scrypt = require("scrypt");

var maxtime = 0.1
  , maxmem = 0
  , maxmemfrac = 0.5;



var UserManagement = function (config) {
}


var helper = {
  createUser: function (opts, cb) {
    console.log("helper createUser");
    var hashKey = opts.hashKey || null
      , password = opts.password || null;

    bcrypt.genSalt(100, function (err, salt) {
        var saltLength = salt.length;
        var saltedPass = salt.slice(0,saltLength / 2) + password + salt.slice(saltLength / 2, saltLength);

        scrypt.passwordHash(saltedPass, maxtime, maxmem, maxmemfrac, function(err, scryptHash) {
          client.multi()
            .hset(hashKey, "password", scryptHash)
            .hset(hashKey, "salt", salt)
            .exec(function (err, status) {
              console.log("Step confirmCreation");
              cb(err, status);
            });
        });
    })
  },
};

UserManagement.prototype.loginGet = function (req, res) {
  console.log("login route");

  res.render('user-management/login/login-index', {});
};

UserManagement.prototype.createGet = function (req, res) {
  console.log("create user route");

  res.render('user-management/create-user/create-user-index.jade', {});
};

UserManagement.prototype.changePasswordGet = function (req, res) {
  console.log("changePassword route");

  res.render('user-management/change-password/change-password-index.jade', {});
};


UserManagement.prototype.changePassword = function (req, res) {
  console.log("route POST /user/changePassword");
  var body = req.body
    , username = body['username']
    , currentPasswordPlainText = body['currentPassword']
    , newPasswordPlainText = body['newPassword']
    , hashKey = "users:" + username
    , self = this;


  var sendResponse = function (msg) {
    res.json(msg);
  }

  Step([
    function getUsername () {
      console.log("Step checkUsername");
      var hashKey = "users:" + username;
      client.hmget(hashKey, "salt", "password", this);
    },

    function checkCurrentPassowrd (err, data) {
      console.log("Step checkCurrentPassowrd");
      var salt = data[0]
        , passwordDb = data[1]
        , saltLength
        , saltedPass;

      if (err || !salt || !passwordDb) {
        logger.error("An error occured, please try again.", {file: __filename, line: __line});
        logger.error(err, {file: __filename, line: __line});
        sendResponse({
          err: "An error occured, please try again."
        });
        this.exitChain();
        return;
      }

      saltLength = salt.length;
      saltedPass = salt.slice(0,saltLength / 2)
        + currentPasswordPlainText
        + salt.slice(saltLength / 2, saltLength);
    
      scrypt.verifyHash(passwordDb, saltedPass, this); 
    },

    function checkResults (err, result) {
      console.log("Step checkResults");
      var step = this;
      
      if (err || !result) {
        logger.error("An error occured, please try again.", {file: __filename, line: __line});
        logger.error(err, {file: __filename, line: __line});
        sendResponse({
          err: "An error occured, please try again."
        });
        this.exitChain();
        return;
      }

      helper.createUser({
        hashKey: hashKey,
        password: newPasswordPlainText
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

  ]); 
};


UserManagement.prototype.create = function (req, res) {
  console.log("rooute /user/create");
  var body = req.body
    , username = body['username']
    , passwordPlainText = body['password']
    , hashKey = "users:" + username;


  var handleStepException = function (err) {
    logger.error(err, {file: __filename, line: __line});
    res.json({err: true});
  }

  var sendResponse = function (msg) {
    res.json(msg);
  }

  Step([
    function checkUsername () {
      console.log("Step checkUsername");
      client.hlen(hashKey, this);
    },

    function createUser (err, len) {
      console.log("Step createUser");
      var step = this;

      if (len) {
        logger.error(len ? "Username already exists." : err, {file: __filename, line: __line});
        sendResponse({
          err: "An error occured, please try again."
        });
        this.exitChain();
        return;
      }

      helper.createUser({
        hashKey: hashKey,
        password: passwordPlainText
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

  ], handleStepException); 
};

UserManagement.prototype.auth = function (req, res) {
  console.log("route /auth");
  var body = req.body 
    , username = body.username
    , passwordPlainText = body.password
    , hashKey = "users:" + username;


  var handleStepException = function (err) {
    logger.error(err, {file: __filename, line: __line});
    res.json({err: true});
  }

  var sendResponse = function (msg) {
    res.json(msg);
  }

  Step([
    function getUserInfo () {
      console.log("Step getUserInfo");
      client.hgetall(hashKey, this);
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
        sendResponse({
          err: "An error occured, please try again."
        });
        this.exitChain();
        return;
      }

      saltLength = salt.length;
      saltedPass = salt.slice(0,saltLength / 2)
        + passwordPlainText
        + salt.slice(saltLength / 2, saltLength);

      scrypt.verifyHash(passwordDb, saltedPass, this); 

    },

    function checkResults (err, result) {
      console.log("Step checkResults");
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        err = true;
      }

      sendResponse({
        err: err
      });
    }

  ], handleStepException);
};

module.exports.inject = function(di) {
  logger = di.logger;
  logger.info("User Management inject");
  return new UserManagement(di.config);
}