"use strict";

const Hapi = require("hapi");
const mongoose = require("mongoose")
const mqtt = require('mqtt');

const createEnvironmentRoutes = require('./api/v1/environment/')
const createUserRoutes = require('./api/v1/user/')
const createWindowRoutes = require('./api/v1/window/')
const createAlarmRoutes = require('./api/v1/alarm/')

const server = Hapi.server({
  port: 8080,
  routes: { cors: true }
});

const options = {
  port: 12771,
  clientId: 'house-api-route',
  username: "zpsqnfvh",
  password: "PnSjOYBouNhm"
};

const mqttSubscriber = mqtt.connect('tcp://m16.cloudmqtt.com', options);

createAlarmRoutes(server, mqttSubscriber);
createEnvironmentRoutes(server, mqttSubscriber);
createWindowRoutes(server, mqttSubscriber);
createUserRoutes(server);

server.route({
  method: "GET",
  path: "/start",
  handler: function (request, h) {
    return "<h1>IoT Server: Windows</h1>";
  }
});

// Start the server
const start = async function () {
  try {
    const uri = "mongodb+srv://deniol:dennis123@clustersoadennis-rsynn.mongodb.net/test?retryWrites=true";
    // Use await here
    mongoose.connect(
      uri,
      { useNewUrlParser: true }
    );

    await mongoose.connection.once("open", () => {
      console.log("Conected to database");
    });

    console.log("starting server");
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
};

start();
