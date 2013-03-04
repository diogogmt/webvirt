
var di = {}


function VirtFactory(type) {
  console.log("VirtFactory");
  return type === "server"
    ? require("./virt-server.js")
    : require("./virt-client.js");
}


module.exports = VirtFactory;