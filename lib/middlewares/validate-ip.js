module.exports = function (di) {
  return (function (req, res, next) {
    var ip = req.params["ip"] || req.body.ip
      , route = req.originalUrl

    if (!di.helper.validateIp(ip)) {
      di.logger.error("Invalid IP " + ip, {file: __filename, line: __line});
      res.json(400, "Invalid IP");
      return;
    }
    next();
  });

  
}