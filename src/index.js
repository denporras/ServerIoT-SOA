"use strict";

// Change this to "import Hapi from "hapi""
const Hapi = require("hapi");
const mongoose = require("mongoose")
const mqtt = require('mqtt');

const createEnvironmentRoutes = require('./api/v1/environment/')
const createUserRoutes = require('./api/v1/user/')

// Create a server with a host and port
const server = Hapi.server({
  host: "localhost",
  port: 8080
});

const options = {
  port: 12771,
  clientId: 'house-api-route',
  username: "zpsqnfvh",
  password: "PnSjOYBouNhm"
};

const mqttSubscriber = mqtt.connect('tcp://m16.cloudmqtt.com', options);

createEnvironmentRoutes(server, mqttSubscriber);
createUserRoutes(server);

// Add the route
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
