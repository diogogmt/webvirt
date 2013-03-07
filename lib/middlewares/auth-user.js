module.exports = function (di) {
  var client = di.client
    , logger = di.logger
  return function (req, res, next) {
    if (req.session.username) {
      client.hlen("users:" + req.session.username, function (err, len) {
        if (err) {
          di.logger.error("Session invalid, username is not saved in the db. - ", err, {file: __filename, line: __line});
        } else if (len) {
          next();
        } else {
          req.session = null;
          res.redirect('/user/login');
        }
      }); // end client.hlen
    } else {
      res.redirect('/user/login');
    }
  }
}
