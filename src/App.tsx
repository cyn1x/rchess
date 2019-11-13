import React from "react";
import { GameProvider } from './components/GameContext'
import GameSettings from "./components/GameSettings";
import GameCanvas from "./components/index";

const App = () => {
    return (
        <div>
            <p>UniChess Chess Engine</p>
            <GameProvider>
                <GameSettings />
                <GameCanvas />
            </GameProvider>
        </div>
    );
}

export default App;
