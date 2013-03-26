
var client
  , Step
  , bcrypt
  , crypto
  , logger
  // , scrypt
  , sliced
  , helper;

var _userModel


// User Document
var UserDocument = function (opt) {
  opt = opt || {};
  this.username = opt.username || null;
  this.passwordPlainText = opt.passwordPlainText || null;
  this.password = opt.password || null;
  this.salt = opt.salt || null;
  this.hashKey = this.username ? "users:" + this.username : null;
}

UserDocument.prototype.auth = function (passwordPlainText, cb) {
  var self = this;

  Step([
    function getUserInfo () {
      client.hgetall(self.hashKey, this);
    },

    function authUser (err, data) {
      // var salt = data.salt
      var passwordDb = data.password
        // , saltLength
        // , saltedPass;

      var step = this;

      if (err || ! passwordDb) {
        logger.error(err ? err.toString() : "Error: Missing user information.", {file: __filename, line: __line});
        cb(err || "Error authenticating the user.");
        this.exitChain();
        return;
      }

      // saltLength = salt.length;
      // saltedPass = salt.slice(0,saltLength / 2)
        // + passwordPlainText
        // + salt.slice(saltLength / 2, saltLength);

      // scrypt.verifyHash(passwordDb, saltedPass, this); 
      bcrypt.compare(passwordPlainText, passwordDb, this); 
    },

    function checkResults (err, result) {
      if (err) {
        logger.error(err, {file: __filename, line: __line});
      } else if (!result) {
        err = "User authentication failed";
      }

      cb(err);
    }
  ], helper.handleStepException("Step error at User::auth - file: " + __filename + "line: " + __line, cb), false);
}

// Not  being used for now
UserDocument.prototype.update = function (fields, cb) {
  var self = this;
  var args = sliced(arguments);
  args.unshift({'hashKey': self.hashKey});
  this.constructor.update.apply(this.constructor, args);
}

// Not  being used for now
UserDocument.prototype.set = function (field, value) {
}

UserDocument.prototype.updatePassword = function (newPasswordPlainText, cb) {
  var self = this;
  // bcrypt.genSalt(100, function (err, salt) {
  //   var saltLength = salt.length;
  //   var saltedPass = salt.slice(0,saltLength / 2) + newPasswordPlainText + salt.slice(saltLength / 2, saltLength);

    // scryptConfig is a global. On next refactor it will be encapsulated
    // scrypt.passwordHash(saltedPass, scryptConfig.maxtime, scryptConfig.maxmem, scryptConfig.maxmemfrac, function(err, scryptHash) {
    //   client.multi()
    //     .hset(self.hashKey, "password", scryptHash)
    //     .hset(self.hashKey, "salt", salt)
    //     .exec(function (err, status) {
    //       cb(err);
    //     });
    // });
    
  // });
  bcrypt.hash(newPasswordPlainText, 8, function(err, hash) {
      client.multi()
        .hset(self.hashKey, "password", hash)
        // .hset(hashKey, "salt", salt)
        .exec(function (err, status) {
          cb(err, status);
        });
    });
}



// User Model
var UserModel = function (doc) {
  UserDocument.call(this, doc);
}

// Extend the UserDocument.prototype to model instances, aka documents
UserModel.prototype.__proto__ = UserDocument.prototype;

UserModel.compile = function (config) {
  // for now scryptConfig is ketp global
  scryptConfig = config && config.scryptConfig || {};
  function model (doc) {
    UserModel.call(this, doc);
  }

  model.__proto__ = UserModel;
  model.prototype.__proto__ = UserModel.prototype;

  return model;
}

UserModel.prototype.save = function (cb) {
  var self = this;

  Step([
    function createUser (err, len) {
      console.log("Step createUser");
      var step = this;

      helper.createUser({
        'hashKey': self.hashKey,
        'password': self.passwordPlainText,
        // 'scryptConfig': scryptConfig
      }, step);

    },

    function createIndex (err, status) {
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        cb(err);
        this.exitChain();
        return;
      }

      client.sadd("users:username", self.username, this);
    },

    function confirmCreation (err, status) {
      console.log("Step confirmCreation");
      if (err) {
        logger.error(err, {file: __filename, line: __line});
      }
      cb(err);
    }

  ], helper.handleStepException("Step error at User::save - file: " + __filename + "line: " + __line, cb), false); 
}

UserModel.findOne = function (fields, cb) {
  var self = this;

  var username = fields && fields.username || ""
    , hashKey = "users:"+username;

  Step([
    function getUserInfo () {
      client.hgetall(hashKey, this);
    },

    function checkResults (err, user) {
      if (err) {
        logger.error(err, {file: __filename, line: __line});
      }
      var foundUser = null
      if (user) {
        foundUser = new _userModel({
          'username': username,
          'password': user.password
        })
      }
      cb(err, foundUser);
    }
      
  ], helper.handleStepException("Step error at UserModel::findOne - file: " + __filename + "line: " + __line, cb), false);
}

UserModel.count = function (cb) {
  var self = this;

  Step([
    function getUserInfo () {
      client.smembers("users:username", this);
    },

    function checkResults (err, usernames) {
      if (err) {
        logger.error(err, {file: __filename, line: __line});
      }
      var n  = usernames && usernames.length || 0;

      cb(err, n);
    }
      
  ], helper.handleStepException("Step error at User::find - file: " + __filename + "line: " + __line, cb), false);
}

// TODO - implement
UserModel.update = function (conditions, fields, cb) {
}

// TODO - implement
UserModel.prototype.remove = function (cb) { 
}

// TODO - implement
UserModel.removeAll = function (cb) { 
  Step([
    function getKeys () {
      client.keys("users:*", this);
    },

    function delKeys (err, users) {
      var step = this;
      if (err) {
        this.exitChain();
        cb(err.toString());
      }

      var len = users && users.length || 0;
      if (!len) {
        this.exitChain();
        cb("No users found.");
        return;
      }

      while (len--) {
        client.del(users[len], step.parallel());
      }
    },

    function confirm () {
      cb(null);
    }
  ], helper.handleStepException("Step error at UserModel::removeAll - file: " + __filename + "line: " + __line, cb), false);
}

module.exports.inject = function (di) {
  if (!_userModel) {
    client = di.client;
    Step = di.Step;
    bcrypt = di.bcrypt;
    crypto = di.crypto;
    logger = di.logger;
    helper = di.helper;
    // scrypt = di.scrypt;
    sliced = di.sliced;

    _userModel = UserModel.compile(di.config);
  }
  return _userModel;

}

