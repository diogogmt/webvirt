var User
  , logger
  , helper


var UserController = function (config) {
}

UserController.prototype.loginView = function (req, res) {
  res.render('login/login-index.jade', {});
};

UserController.prototype.logout = function (req, res) {
  // Destroy session
  req.session.destroy();

  res.render('login/login-index.jade', {});
};

UserController.prototype.createView = function (req, res) {
  console.log("UserController.prototype.createView");
  User.count(function (err, number) {
    console.log("number: ", number);
    if (err) {
      console.log("redirect to error page");
      res.json({'err': "This should be the error page!"});
    }

    res.render('create-user/create-user-index.jade', {
      'userExists': number
    });  
  });

  // res.render('create-user/create-user-index.jade', {
  //   'userExists': false
  // });  
};

UserController.prototype.changePasswordView = function (req, res) {
  res.render('change-password/change-password-index.jade', {});
};

UserController.prototype.changePassword = function (req, res) {
  var body = req.body
    , username = body['username']
    , currentPasswordPlainText = body['currentPassword']
    , newPasswordPlainText = body['newPassword']
    , hashKey = "users:" + username;


  User.findOne({'username': username}, function (err, user) {
    if (err || !user) {
      logger.error(err ? err.toString : "User not found", {file: __filename, line: __line});
      res.json(400, "Error changing the password.");
      return;
    }
    user.auth(currentPasswordPlainText, function (err) {
      if (err) {
        logger.error(err.toString, {file: __filename, line: __line});
        res.json(400, "Error changing the password.");
        return;
      }

      user.updatePassword(newPasswordPlainText, function (err) {
        if (err) {
          log.error(err.toString, {file: __filename, line: __line});
          res.json(400, "Error changing the password.");
          return;
        }
        res.json(null);
      }); // end user.updatePassword
    }); // end user.auth
  }); // end User.findOne
};

UserController.prototype.create = function (req, res) {
  var body = req.body
    , username = body['username']
    , passwordPlainText = body['password']

  User.findOne({ username: username}, function (err, user) {
    if (err || user) {
      res.json(200, "Error creating user: " + err ? err.toString : "username taken");
      return
    }

    var user = new User({
      username: username,
      passwordPlainText: passwordPlainText    
    });

    user.save(function (err) {
      var msg = {};
      if (err) {
        resCode = 400;
        msg = "Failed to create user - " +  err.toString();
      } else {
        resCode = 200;
      }
      res.json(resCode, msg);
    });
  });
};

UserController.prototype.auth = function (req, res) {
  var body = req.body 
    , username = body.username
    , passwordPlainText = body.password;

  User.findOne({ username: username}, function (err, user) {
    if (err || !user) {
      res.json(400, "Error authenticating user.")
      return
    }
    user.auth(passwordPlainText, function (err) {
      if (err) {
        res.json(400, "Error authenticating user.")
        return
      }
      req.session.username = user.username;
      res.json(null);
    });  // end user.auth
  }); // end User.findOne
};

module.exports.inject = function(di) {
  logger = di.logger;
  helper = di.helper;
  User = di.userFactory;
  return new UserController(di.config);
}
