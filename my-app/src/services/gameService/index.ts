import { Socket } from "socket.io-client";
import Deck, { Card } from "../../components/game/deck";
import { IStartGame } from "../../components/game";

class GameService {
  // Join the game room with the given roomId
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit("join_game", { roomId });

      // If the room is successfully joined, resolve the promise with true
      socket.on("room_joined", () => resolve(true));

      // If there's an error joining the room, reject the promise with the error message
      socket.on("room_join_error", ({ error }) => reject(error));
    });
  }

  // Update game state
  public async updateGame(
    socket: Socket,
    playerOneCards: Card[],
    playerTwoCards: Card[],
    topCard: Card | undefined,
    currentPlayer: "1" | "2",
    remainingCards: Card[] // Add this line with a comment
  ) {
    socket.emit("update_game", {
      playerOneCards,
      playerTwoCards,
      topCard,
      currentPlayer,
      remainingCards, // Add this line with a comment
    });
  }

  // Listen for game updates
  public async onGameUpdate(
    socket: Socket,
    listener: (
      playerOneCards: Card[],
      playerTwoCards: Card[],
      topCard: Card | undefined,
      remainingCards: Card[] // Add this line with a comment
    ) => void
  ) {
    socket.on("on_game_update",
      ({ playerOneCards, playerTwoCards, topCard, remainingCards }) => {
        listener(playerOneCards, playerTwoCards, topCard, remainingCards); 
      }
    );
  }

  // Handle game start event
  public async onStartGame(
    socket: Socket,
    listener: (options: IStartGame) => void 
  ) {
    socket.on("start_game", listener); 
  }
  
  // Handle current player update event
  public async onCurrentPlayerUpdate(
    socket: Socket,
    listener: (currentPlayer: "1" | "2") => void 
  ) {
    socket.on("on_current_player_update", (currentPlayer) => { 
      listener(currentPlayer); 
    });
  }
  
  // Handle the deck update event
  public async onDeckUpdate(
    socket: Socket,
    listener: (deck: Card[]) => void 
  ) {
    socket.on("on_deck_update", (deck) => { 
    });
  }
  
  // Handle the reset game event
  public async resetGame(socket: Socket) { 
    socket.emit("reset_game"); 
  }
  
  // Broadcast action message
public async broadcastActionMessage(socket: Socket, message: string) {
  socket.emit("broadcast_action_message", { message });
}

// Listen for action message updates
public async onActionMessageUpdate(socket: Socket, listener: (message: string) => void) {
  socket.on("on_action_message_update", (message) => {
    listener(message);
  });
}

  
}

export default new GameService();
