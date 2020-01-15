import React from "react";
import { GameProvider } from './components/GameContext'
import GameSettings from './components/GameSettings';
import GameEntryPoint from './components/index';
import GameInfo from './components/GameInfo';

import './styles.css'

const App = () => {
    const debug = false;

    if (debug) {
        return (
            <React.Fragment>
                <div id="unichess-heading">
                    <h1>Cyn1x Chess Engine</h1>
                </div>
                <div id="unichess-app">
                    <GameProvider>
                        <GameEntryPoint />
                        <div id="unichess-info">
                            <GameInfo />
                            <GameSettings />
                        </div>
                    </GameProvider>
                </div>
            </React.Fragment>
        );
    }
    return (
        <div id="unichess-heading">
            <h1>Cyn1x Chess Engine</h1>
        </div>
    );
}

export default App;
