import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { Deck } from "../../../../my-app/src/components/game/deck";
import { User } from "../controllers/mainController"

// Decorator for creating a controller for handling WebSocket events
@SocketController()
export class RoomController {

  /*variables*/

  //map to store the rooms deck
  private roomDecks: Map<string, Deck> = new Map();

  // Map to store room and its players
  private roomPlayers: Map<string, User[]> = new Map();


  @OnMessage("get_open_rooms")
  public getOpenRooms(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket
  ) {
    // Get all the room IDs where the room has exactly one player
    const openRooms = Array.from(this.roomPlayers.entries())
      .filter(([roomId, users]) => users.length === 1)
      .map(([roomId, users]) => roomId);

    // Emit the open rooms back to the client
    socket.emit("open_rooms", openRooms);
  }

  //the function which happens on the join_game message event
  @OnMessage("join_game")
  public async joinGame(

    // Inject the Socket.IO server instance
    @SocketIO() io: Server,

    // Inject the connected socket instance
    @ConnectedSocket() socket: Socket,

    // Inject the message body of the event
    @MessageBody() message: any

  ) {

    console.log("New User joining room: ", message);

    // Get the connected sockets in the specified room
    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);

    // Get the rooms of the current socket is connected to
    const socketRooms = Array.from(socket.rooms.values()).filter(

      (r) => r !== socket.id

    );

    // Get the user from the message
    const user: User = message.user;

    // Check if the room is already full (2 sockets present) or the socket is already in a room
    if (
      socketRooms.length > 0 ||
      (connectedSockets && connectedSockets.size === 2)
    ) {

      // Emit an error message to the socket indicating the room is full
      socket.emit("room_join_error", {

        error: "Room is full please choose another room to play!",

      });
    } else {

      // Join the specified room
      await socket.join(message.roomId);

      // Emit a confirmation message to the socket indicating successful room join
      socket.emit("room_joined");

      // Check if the room exists in the roomPlayers map
      if (!this.roomPlayers.has(message.roomId)) {

        // If not, initialize an array with the user
        this.roomPlayers.set(message.roomId, [user]);

      } else {

        // If it does, push the user into the array
        this.roomPlayers.get(message.roomId).push(user);

      }

      // Check if this is the first player to join the room
      if (!connectedSockets) {

        // Initialize a deck and shuffle it
        const deck = new Deck();

        deck.shuffle();

        // Store the deck state in the roomDecks map using the roomId as the key
        this.roomDecks.set(message.roomId, deck);

      }

      // Check if there are two players in the room
      if (io.sockets.adapter.rooms.get(message.roomId).size === 2) {

        // Get the players from the roomPlayers map
        const players = this.roomPlayers.get(message.roomId);

        // Emit the start_game event with the players' usernames
        socket.emit("start_game", { start: true, symbol: players[0].username });
        socket.to(message.roomId).emit("start_game", { start: false, symbol: players[1].username });
      }
    }
  }
}
