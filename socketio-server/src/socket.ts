import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";

// Script for opening up socket connections 
// Need cors for configuration and debugging. For any origin set the connection 
export default (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

 
   // useSocketServer used to implement class base controllers to handle web sockets events. Controllers with the path to controller the game
  useSocketServer(io, { controllers: [__dirname + "/api/controllers/*.ts"] });

  return io;
};
