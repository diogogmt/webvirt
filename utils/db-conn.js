var redis = require("redis");

// Redis
exports.client = redis.createClient(6379, '127.0.0.1');

exports.client.on("error", function (err) {
    console.log("Error " + err);
});

