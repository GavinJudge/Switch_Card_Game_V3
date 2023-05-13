import React, { useEffect, useState } from "react";
import "./App.css";
//import { io } from "socket.io-client";
import socketService from "./services/socketService";
import  LoginPage  from "./components/loginPage/loginPage";
import { JoinRoom } from "./components/joinRoom";
import GameContext, { IGameContextProps } from "./gameContext";
import { Game } from "./components/game";
//import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Conected the front end to the server.
function App() {
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<"1" | "2">("1");
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);


  const connectSocket = async () => {
    // Retrieve the token from sessionStorage
    const storedToken = sessionStorage.getItem('token');
    
    // Convert null to undefined
    const token = storedToken === null ? undefined : storedToken;

    console.log(token);
    
    const socket = await socketService.connect("http://localhost:9000", token).catch((err) => {
      console.log("Error: ", err);
    });
  };
  
  useEffect(() => {
    connectSocket();
  }, []);


  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom,
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="wrapper">
        <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/JoinRoom" element={<JoinRoom />} />
              <Route path="/Game" element={<Game />} />
            </Routes>
          </Router>
        </div>
      </div>
    </GameContext.Provider>
  );
}

export default App;
