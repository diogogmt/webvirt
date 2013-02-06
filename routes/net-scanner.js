
var NetworkScanner = require("../crawler.js");

var netScanner = new NetworkScanner();

exports.networkScann = function (req, res) {
  console.log("fullScann route");
  netScanner.networkScann(function () {
    res.json({status: "completed"});
  });
};

exports.hyperVisorScann = function (req, res) {
  console.log("hyperVisorScann route");
  netScanner.hypervisorScann(function () {
    res.json({status: "completed"});
  })
};
