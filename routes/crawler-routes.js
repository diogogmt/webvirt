
var NetworkScanner = require("../crawler.js");

var netScanner = new NetworkScanner();

exports.networkScann = function (req, res) {
  console.log("fullScann route");
  netScanner.networkScann(function (daemons) {
    res.json({daemons: daemons});
  });
};

exports.daemonScann = function (req, res) {
  console.log("daemonsScann route");
  netScanner.daemonScann(function (daemons) {
    res.json({daemons: daemons});
  })
};
