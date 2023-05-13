#!/usr/bin/env node

//import Module dependencies.
import "reflect-metadata";
import app from "./app";
var debug = require("debug")("socketio-server:server");
import * as http from "http";
import socketServer from "./socket";
import { loginRoute, registerRoute, authenticateJWT } from './databaseServer';
import bodyParser from 'body-parser';
import cors from 'cors';


//Setting up middleware for API routes
app.use(bodyParser.json());
app.use(cors());

app.post('/api/login', loginRoute);
app.post('/api/register', registerRoute);

//Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || "9000");
app.set("port", port);

  
//Create HTTP server.
var server = http.createServer(app);

//Listen on provided port, on all network interfaces.
server.listen(port);
server.on("error", onError);

//display message to say server is running on the port
console.log("Server Running on Port: ", port);

const io = socketServer(server);

//Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
*/
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
