import React from "react";

// script for all the gamestates to keep track 
export interface IGameContextProps {
    isInRoom: boolean;
    setInRoom: (inRoom: boolean) => void;
    playerSymbol: "1" | "2";
    setPlayerSymbol: (symbol: "1" | "2") => void;
    isPlayerTurn: boolean;
    setPlayerTurn: (turn: boolean) => void;
    isGameStarted: boolean;
    setGameStarted: (started: boolean) => void;
    
    
};

// Need a defualt state for when the game starts 
const defaultState: IGameContextProps = {
    isInRoom: false,
    setInRoom: () => {},
    playerSymbol: "1",
    setPlayerSymbol: () => {},
    isPlayerTurn: false,
    setPlayerTurn: () => {},
    isGameStarted: false,
    setGameStarted: () => {},
    
}

export default React.createContext(defaultState);