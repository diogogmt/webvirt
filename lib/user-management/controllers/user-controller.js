var userFactory
  , logger
  , helper


var UserController = function (config) {
}

UserController.prototype.loginView = function (req, res) {
  res.render('login/login-index.jade', {});
};

UserController.prototype.createView = function (req, res) {
  res.render('create-user/create-user-index.jade', {});
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

  var user = userFactory.createUser({
    username: username,
    passwordPlainText: currentPasswordPlainText    
  });

  user.changePassword(newPasswordPlainText, function (err) {
    res.json(err);
  });
};

UserController.prototype.create = function (req, res) {
  console.log("POST /user/create");
  var body = req.body
    , username = body['username']
    , passwordPlainText = body['password']


  var user = userFactory.createUser({
    username: username,
    passwordPlainText: passwordPlainText    
  });

  user.save(function (err) {
    console.log("user.save callback");
    res.json(err);
  });
};

UserController.prototype.auth = function (req, res) {
  console.log("POST /user/auth");
  var body = req.body 
    , username = body.username
    , passwordPlainText = body.password;

  var user = userFactory.createUser({
    username: username,
    passwordPlainText: passwordPlainText    
  });

  user.auth(function (err) {
    if (!err.err) {
      req.session.username = user.username;
    }
    res.json(err);
  });  
};

module.exports.inject = function(di) {
  logger = di.logger;
  helper = di.helper;
  userFactory = di.userFactory;
  return new UserController(di.config);
}
