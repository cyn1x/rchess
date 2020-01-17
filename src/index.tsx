import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { IGameState, IGameCanvas } from './components/types';
import Canvas from "./components/game/ui/GameCanvas";

ReactDOM.render(<App />, document.getElementById("root"));

export { Canvas, IGameState, IGameCanvas }
