import {
  ConnectedSocket,
  OnConnect,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Socket, Server } from "socket.io";
import jwt from 'jsonwebtoken';

export interface User {
  id: number;
  username: string;
}

interface AuthenticatedSocket extends Socket {
  user: User;
}

// Import necessary decorators and classes
@SocketController()
export class MainController {

  // Handle connection event
  @OnConnect()
  public onConnection(

    // Get the connected socket object
    @ConnectedSocket() socket: AuthenticatedSocket, 

    // Get the socket.io server object
    @SocketIO() io: Server 
  ) {

    // Log the socket ID to the console
    console.log("Server Socket connected: ", socket.id);
    

    // Type assertion to ensure token is string data type
    const token = socket.handshake.query.token as string;

    // Assert that process.env.JWT_SECRET is a string
    const secret = process.env.JWT_SECRET;

    //check to ensure JWT_secret is of type string or if its missing
    if (!secret || typeof secret !== 'string') {
      throw new Error('Missing JWT_SECRET environment variable');
    }

    //check and see if token is being provided
    if (!token) {
      console.log("Token not provided");
      return;
    }

    // Verify and decode the JWT
    jwt.verify(token, secret, (err, user) => {
      if (err) {

        /*
        // If the token is invalid, disconnect the socket
        socket.disconnect();
        */

        console.log("invalid JWT Token");

      } else {
        
        // If the token is valid, attach the user to the socket
        (socket as AuthenticatedSocket).user = user as User;

        // Emit an event to the client with the user object
        io.to(socket.id).emit("user_authenticated", { user: user as User });

      }
    });

    // Listen for a custom event on this socket
    socket.on("custom_event", (data: any) => {

      // Log the received data to the console
      console.log("Data: ", data); 

    });
  }
}

