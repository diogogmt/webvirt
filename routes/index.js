
// var type = process.env.APP_TYPE;
// if (type === "SERVER") {
//   var Virt = new require("../server-virt.js").Virt;
// } else if (type === "CLIENT") {
//   var Virt = new require("../client-virt.js").Virt;
// }
// var virt = new Virt();
 
/*
 * GET home page.
 */


// virt can't be a member of Controller because when the Controller methods are invoked they have a different 'this'
// a possible reason for this problem is that the Controller methods are being used as express callback for the API routes
var virt;
var Controller = function (config) {
  console.log("Controller constructor");
  console.log("config: ", config);
  var Virt = config.type === "server"
    ? new require("../server-virt.js").Virt
    : new require("../client-virt.js").Virt;

  virt = new Virt();

}

Controller.prototype.index = function (req, res) {
  res.render('index', { title: 'Express' });
};

Controller.prototype.list = function (req, res) {
  console.log("list route");
  virt.list(function (err, list) {
    console.log("virt.list callback");
    console.log("err: ", err);
    console.log("list: ", list);
    res.json(list);
  });
};


Controller.prototype.actions = function (req,res) {
  console.log("actions route");
  var route  = req.originalUrl.split("\/")[1];
  console.log("route: ", route);
  console.log("params: ", req.params);

  var vmInfo = {
    name: req.params["name"],
    ip: req.params["ip"] || null,
    route: route
  };
 
  console.log("vmInfo: ", vmInfo);
  // Add validation and intuitive error message
  if (!vmInfo.name) {
    res.send({error: 1});
    return;
  }
  virt[route](vmInfo, function (err, status) {
    res.json(status);
  });
}

module.exports.inject = function(di) {
  console.log("inject");
  return new Controller(di.config);
}

