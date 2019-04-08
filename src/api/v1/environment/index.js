const Environment = require("../../../models/environment");

function createEnvironmentRoutes(server, mqttSubscriber) {
  server.route([
    {
      method: "GET",
      path: "/api/v1/environments",
      handler: function (request, reply) {
        return Environment.find();
      }
    },
    {
      method: "GET",
      path: "/api/v1/environments/last",
      handler: function (request, reply) {
        return Environment.findOne().sort({ date: -1 }).limit(1);
      }
    }/*,
    {
      method: "POST",
      path: "/api/v1/environments",
      handler: function (request, reply) {
        const { temperature, humidity, date } = request.payload;
        const environment = new Environment({
          temperature: temperature,
          humidity: humidity,
          date: date
        });
        return environment.save();
      }
    }*/
  ]);

  mqttSubscriber.on('connect', function () {
    mqttSubscriber.subscribe('house/environment');
    //mqttSubscriber.publish('house/environment', "{\"temperature\":26.2,\"humidity\":56.8}");
  });

  mqttSubscriber.on('message', function (topic, message) {
    const response = JSON.parse(message);
    //console.log("Nuevo topic: ", topic);
    //console.log("Nuevo message: ", response);
    switch (topic) {
      case 'house/environment':
        Environment.create({
          temperature: response.temperature,
          humidity: response.humidity,
          date: new Date()
        });
        break;
    }
    //mqttSubscriptor.end();
  });
}

module.exports = createEnvironmentRoutes;
