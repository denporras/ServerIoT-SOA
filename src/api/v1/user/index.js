const User = require("../../../models/user");

function createUserRoutes(server) {
  server.route([
    {
      method: "GET",
      path: "/api/v1/users",
      handler: function (request, reply) {
        return User.find();
      }
    },
    {
      method: "GET",
      path: "/api/v1/users/login",
      handler: function (request, reply) {
        const { username, password } = request.query;
        return User.find({ username, password });
      }
    },
    {
      method: "POST",
      path: "/api/v1/users",
      handler: function (request, reply) {
        const { name, username, password } = request.payload;
        const user = new User({
          name: name,
          username: username,
          password: password
        });
        return User.save();
      }
    }
  ]);
}

module.exports = createUserRoutes;
