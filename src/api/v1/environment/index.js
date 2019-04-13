const Environment = require("../../../models/environment");

function createEnvironmentRoutes(server, mqttSubscriber) {
  server.route([
    {
      method: "GET",
      path: "/api/v1/environments",
      handler: function (request, reply) {
        return Environment.find().sort({ date: -1 }).limit(30);
      }
    },
    {
      method: "GET",
      path: "/api/v1/environments/last",
      handler: function (request, reply) {
        return Environment.findOne().sort({ date: -1 }).limit(1);
      }
    }
  ]);

  mqttSubscriber.on('connect', function () {
    mqttSubscriber.subscribe('house/environment');
  });

  mqttSubscriber.on('message', function (topic, message) {
    const response = JSON.parse(message);
    switch (topic) {
      case 'house/environment':
        Environment.create({
          temperature: response.temperature,
          humidity: response.humidity,
          date: new Date()
        });
        break;
    }
  });
}

module.exports = createEnvironmentRoutes;
