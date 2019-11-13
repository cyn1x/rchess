import React, { useContext, useState, ChangeEvent } from 'react';
import { GameContext } from './GameContext';

const GameSettings = () => {
    const gameSettings = useContext(GameContext);

    const [currentPlayer, setCurrentPlayer] = useState("");
    const [fenString, setFenString] = useState("");
    const [playerTurn, setPlayerTurn] = useState("");
    const [moveFrom, setMoveFrom] = useState("");
    const [moveTo, setMoveTo] = useState("");
    
    return (
        <form className="game-form">
            <div id="currentPlayer" className="form-field" >
                <label>
                    <p>Player</p>
                    <input type="text" name="player" onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        event.preventDefault();
                        setCurrentPlayer(event.target.value);
                    }} />
                </label>
            </div>
            <div id="fenString" className="form-field" >
                <label>
                    <p>FEN</p>
                    <input id="input" type="text" name="fen" onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        event.preventDefault();
                        setFenString(event.target.value);
                    }} />
                </label>
            </div>
            <div id="currentTurn" className="form-field" >
                <label>
                    <p>Turn</p>
                    <input type="text" name="turn" onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        event.preventDefault();
                        setPlayerTurn(event.target.value);
                    }} />
                </label>
            </div>
            <div id="moveFrom" className="form-field" >
                <label>
                    <p>From</p>
                    <input type="text" name="from" onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        event.preventDefault();
                        setMoveFrom(event.target.value);
                    }} />
                </label>
            </div>
            <div id="moveTo" className="form-field" >
                <label>
                    <p>To</p>
                    <input type="text" name="to" onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        event.preventDefault();
                        setMoveTo(event.target.value);
                    }} />
                </label>
            </div>
            <div id="submit" className="form-field" >
                <input type="submit" value="Submit" onClick={(event: React.FormEvent) => {
                    event.preventDefault();
                    gameSettings.setGameState({
                        player: currentPlayer,
                        game: {
                            nextFenString: fenString,
                            nextPlayerTurn: playerTurn,
                            movePieceFrom: moveFrom,
                            movePieceTo: moveTo
                        }
                    })
                }}/>
            </div>
      </form>
    );
}

export default GameSettings;
