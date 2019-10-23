import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Canvas from './components';
import { ICanvas, IGameState } from './components/types';

ReactDOM.render(<App />, document.getElementById("root"));

export { Canvas, IGameState, ICanvas }
