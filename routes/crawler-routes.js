
var NetworkScanner = require("../crawler.js");

var netScanner = new NetworkScanner();

exports.networkScan = function (req, res) {
  console.log("fullScan route");
  netScanner.networkScan(function (err, daemons) {
    if (err) {
      logger.error(err, {file: __filename, line: __line});
    }
    res.json({hosts: daemons});
  });
};

exports.daemonScan = function (req, res) {
  console.log("daemonsScan route");
  netScanner.daemonScan(function (err, daemons) {
    if (err) {
      logger.error(err, {file: __filename, line: __line});
    }
    res.json({daemons: daemons});
  })
};

exports.dashboard = function (req, res) {
  res.render("dashboard", {});
};