var userFactory
  , logger
  , helper


var UserController = function (config) {
}

UserController.prototype.loginView = function (req, res) {
  res.render('../views/login/login-index', {});
};

UserController.prototype.createView = function (req, res) {
  res.render('create-user/create-user-index.jade', {});
};

UserController.prototype.changePasswordView = function (req, res) {
  res.render('../views/change-password/change-password-index.', {});
};


UserController.prototype.changePassword = function (req, res) {
  var body = req.body
    , username = body['username']
    , currentPasswordPlainText = body['currentPassword']
    , newPasswordPlainText = body['newPassword']
    , hashKey = "users:" + username
    , self = this;


  user = User.find();
  user.changePassword(currentPasswordPlainText, newPasswordPlainText);
  user.save();


  var sendResponse = function (msg) {
    res.json(msg);
  }

  Step([
    function getUsername () {
      var hashKey = "users:" + username;
      client.hmget(hashKey, "salt", "password", this);
    },

    function checkCurrentPassowrd (err, data) {
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


UserController.prototype.create = function (req, res) {
  console.log("POST /user/create");
  var body = req.body
    , username = body['username']
    , passwordPlainText = body['password']


  console.log("creating userFactory");
  var user = userFactory.createUser({
    username: username,
    passwordPlainText: passwordPlainText    
  });

  console.log("saving user");
  user.save(function (err) {
    console.log("user.save callback");
    res.json({err: err});
  });
};

UserController.prototype.auth = function (req, res) {
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

      // Init session
      req.session.userName = username;
      
      sendResponse({
        err: err
      });
    }

  ], handleStepException);
};

module.exports.inject = function(di) {
  logger = di.logger;
  helper = di.helper;
  di.userFactory = userFactory = require('../models/user-model').inject(di);
  return new UserController(di.config);
}
