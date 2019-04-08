const Window = require("../../../models/window");

function createWindowRoutes(server, mqttSubscriber) {
  server.route([
    {
      method: "GET",
      path: "/api/v1/windows",
      handler: function (request, reply) {
        return Window.find();
      }
    },
    {
      method: "POST",
      path: "/api/v1/windows",
      handler: async (request, reply) => {
        const { window, state } = request.payload;
        var response = await Window.findOneAndUpdate({ window }, { state }, { new: true });
        mqttSubscriber.publish('house/window', JSON.stringify(response));
        return reply.response(response);
      }
    }
  ]);
}

module.exports = createWindowRoutes;
