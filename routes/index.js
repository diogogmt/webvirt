

var Virt = require("../virt.js").Virt;
console.log("Virt: ", Virt);

var virtClient = new Virt(); 
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.list = function(req, res){
  virtClient.list(function (err, list) {
    res.json(list);
  });
};

exports.status = function(req, res){
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virtClient.status(vmName, function (err, status) {
    res.json(status);
  });
};

exports.start = function(req, res){
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virtClient.start(name, function (err, status) {
    res.json(status);
  });
};

exports.resume = function(req, res){
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virtClient.resume(vmName, function (err, status) {
    res.json(status);
  });
};

exports.suspend = function(req, res){
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virtClient.suspend(vmName, function (err, status) {
    res.json(status);
  });
};

exports.shutdown = function(req, res){
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virtClient.shutdown(vmName, function (err, status) {
    res.json(status);
  });
};

exports.destroy = function(req, res){
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virtClient.destroy(vmName, function (err, status) {
    res.json(status);
  });
};

exports.save = function(req, res){
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virtClient.save(vmName, function (err, status) {
    res.json(status);
  });
};

