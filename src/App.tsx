import React from "react";
import { GameProvider } from './components/GameContext'
import GameSettings from './components/GameSettings';
import GameCanvas from './components/index';
import GameInfo from './components/GameInfo';

import './styles.css'

const App = () => {
    return (
        <React.Fragment>
            <div id="unichess-heading">
                <h1>Cyn1x Chess Engine</h1>
            </div>
            <div id="unichess-app">
                <GameProvider>
                    <GameCanvas />
                    <div id="unichess-info">
                        <GameInfo />
                        <GameSettings />
                    </div>
                </GameProvider>
            </div>
        </React.Fragment>
    );
}

export default App;
