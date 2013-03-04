module.exports = function (di) {
  return (function (req, res, next) {
    var ip = req.params["ip"]
      , route = req.originalUrl

    if (!di.helper.validateIp(ip)) {
      di.logger.error("Invalid IP " + ip, {file: __filename, line: __line});
      res.send({error: 1});
      return;
    }
    next();
  });

  
}