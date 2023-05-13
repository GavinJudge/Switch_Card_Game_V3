import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";

import { Server, Socket } from "socket.io";

// Decorator for creating a controller for handling WebSocket events
@SocketController() 
export class GameController {
  private getSocketGameRoom(socket: Socket): string {

    // Private method to get the game room of the socket
    const socketRooms = Array.from(socket.rooms.values()).filter(

      // Get all socket rooms except the socket's ID (since the socket is always in its own room)
      (r) => r !== socket.id 

    );

    // Get the first socket room (i.e. the game room)
    const gameRoom = socketRooms && socketRooms[0]; 

    // Return the game room
    return gameRoom; 

  }

  // Decorator for handling "update_game" WebSocket events
  @OnMessage("update_game") 
  public async updateGame(

    // Inject the Socket.IO server instance
    @SocketIO() io: Server, 

    // Inject the connected socket instance
    @ConnectedSocket() socket: Socket,

    // Inject the message body of the event
    @MessageBody() message: any

  ) {

    // Get the game room of the socket
    const gameRoom = this.getSocketGameRoom(socket);

    // Broadcast the "on_game_update" event to all sockets in the game room (except the sender)
    socket.to(gameRoom).emit("on_game_update", message); 

    //broadcast the currentPlayer
    socket.to(gameRoom).emit("on_current_player_update", message.currentPlayer);

    //broadcast the remainingCards
    socket
      .to(gameRoom)
      .emit("on_remaining_cards_update", message.remainingCards);

    //broadcast the activeSuit
    socket.to(gameRoom).emit("on_active_suit_update", message.activeSuit);
    
  }

  @OnMessage("broadcast_action_message")
  public async broadcastActionMessage(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    socket.to(gameRoom).emit("on_action_message_update", message.message);
  }
}
