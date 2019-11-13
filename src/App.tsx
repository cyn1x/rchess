import React from "react";
import { GameProvider } from './components/GameContext'
import GameSettings from "./components/GameSettings";
import GameCanvas from "./components/index";

import './styles.css'

const App = () => {
    return (
        <React.Fragment>
            <div id="unichess-heading">
                <h1>UniChess Chess Engine</h1>
            </div>
            <div id="unichess-app">
                <GameProvider>
                    <GameCanvas />
                    <GameSettings />
                </GameProvider>
            </div>
        </React.Fragment>
    );
}

export default App;
