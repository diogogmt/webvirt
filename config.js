
var config = {
	daemonPort: "4000",
	interfaceServerPort: "3000",
	network: {
		id: "10.0.0.0",
		cidr: "24"
	},
	logger: {
		serverLog: "logs/server.log"
	}
};

module.exports = exports = config;
