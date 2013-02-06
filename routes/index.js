

var type = process.env.APP_TYPE;
var virt;
if (type === "SERVER") {
  var Virt = new require("../server-virt.js").Virt;
  console.log("Virt: ", Virt);
  var virt = new Virt();
  console.log("virt: ", virt);  
} else if (type === "CLIENT") {
  var Virt = new require("../client-virt.js").Virt;
  console.log("Virt: ", Virt);
  var virt = new Virt();
  console.log("virt: ", virt);
}
 
/*
 * GET home page.
 */

console.log("type: ", process.env.APP_TYPE);
console.log("path: ", process.env.PATH);

exports.index = function (req, res) {
  res.render('index', { title: 'Express' });
};

exports.list = function (req, res) {
  console.log("list route");
  virt.list(function (err, list) {
    console.log("virt.list callback");
    console.log("err: ", err);
    console.log("list: ", list);
    res.json(list);
  });
};

exports.status = function (req, res) {
  console.log("status route");
  var vmInfo = {
    name: req.params["name"],
    ip: req.params["ip"] || null
  };
 
  console.log("vmInfo: ", vmInfo);
  // Add validation and intuitive error message
  if (!vmInfo.name) {
    res.send({error: 1});
    return;
  }

  virt.status(vmInfo, function (err, status) {
    res.json(status);
  });
};

exports.start = function(req, res){
  console.log("start route");
  var vmInfo = {
    name: req.params["name"],
    ip: req.params["ip"] || null
  };
 
  console.log("vmInfo: ", vmInfo);
  // Add validation and intuitive error message
  if (!vmInfo.name) {
    res.send({error: 1});
    return;
  }

  virt.start(vmInfo, function (err, status) {
    res.json(status);
  });
};

exports.resume = function (req, res) {
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virt.resume(vmName, function (err, status) {
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

  virt.suspend(vmName, function (err, status) {
    res.json(status);
  });
};

exports.shutdown = function (req, res) {
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virt.shutdown(vmName, function (err, status) {
    res.json(status);
  });
};

exports.destroy = function (req, res) {
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virt.destroy(vmName, function (err, status) {
    res.json(status);
  });
};

exports.save = function (req, res) {
  var vmName = req.params["name"];
  // Add validation and intuitive error message
  if (!vmName) {
    res.send({error: 1});
    return;
  }

  virt.save(vmName, function (err, status) {
    res.json(status);
  });
};

