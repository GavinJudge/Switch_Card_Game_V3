import React, { useState, useContext } from "react";
import "./joinLobby.css"
import gameContext from "../../gameContext";
import socketService from "../../services/socketService";
import gameService from "../../services/gameService";
import { useNavigate } from 'react-router-dom';


interface IJoinRoomProps {}

export function JoinRoom(props: IJoinRoomProps) {
  const [roomName, setRoomName] = useState("");
  const [isJoining, setJoining] = useState(false);

  const { setInRoom } = useContext(gameContext);
  const navigate = useNavigate();

  const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomName(value);
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const socket = socketService.socket;

    if (!roomName || roomName.trim() === "" || !socket) return;

    setJoining(true);

    const joined = await gameService.joinGameRoom(socket, roomName).catch((err) => {
      alert(err);
    });

    if (joined) {
      setInRoom(true);
      navigate("/Game"); // Redirect to the Game component
    }

    setJoining(false);
  };

  return (
    <form onSubmit={joinRoom}>
      <div className="joinGameContainer">
        <h3>Enter a room ID to be able to join a game</h3>
        <input type="text" placeholder="Game1" onChange={handleRoomNameChange} />
        <button type="submit" disabled={isJoining}>
          {isJoining ? "Joining..." : "Join Game"}
        </button>
      </div>
    </form>
  );
}

