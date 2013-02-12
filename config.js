
var config = {
	daemonPort: "4000",
	interfaceServerPort: "3000",
	network: {
		id: "10.0.0.0",
		cidr: "24"
	},
	logger: {
		serverLog: "logs/server.log"
	},
  virtCmds: {
    status: "sudo virsh domstate ",
    start: "sudo virsh start ",
    resume: "sudo virsh resume ",
    suspend: "sudo virsh suspend ",
    shutdown: "sudo virsh shutdown ",
    destroy: "sudo virsh destroy "
  }
};

module.exports = exports = config;
