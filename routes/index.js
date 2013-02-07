

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


exports.actions = function (req,res) {
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


