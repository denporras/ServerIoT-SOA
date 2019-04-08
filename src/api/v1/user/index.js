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
      handler: async (request, reply) => {
        const { username, password } = request.query;
        var response
        await User.find({ username, password }).then(res => {
          if (res.length == 1) {
            response = { login: true }
          } else {
            response = { login: false }
          }
        });
        return response
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
        return user.save();
      }
    }
  ]);
}

module.exports = createUserRoutes;
