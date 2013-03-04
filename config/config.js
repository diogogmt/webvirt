
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
    status: "virsh domstate ",
    start: "virsh start ",
    resume: "virsh resume ",
    suspend: "virsh suspend ",
    shutdown: "virsh shutdown ",
    destroy: "virsh destroy "
  },

  scryptConfig: {
    maxtime: 0.1,
    maxmem: 0,
    maxmemfrac: 0.5
  }
};

module.exports = exports = config;
