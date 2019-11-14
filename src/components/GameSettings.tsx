import React, { useContext, useState, ChangeEvent } from 'react';
import { GameContext } from './GameContext';

const GameSettings = () => {
    const gameSettings = useContext(GameContext);

    const [currentPlayer, setCurrentPlayer] = useState("");
    const [fenString, setFenString] = useState("");
    const [playerTurn, setPlayerTurn] = useState("");

    const [playerError, setPlayerError] = useState("")
    const [turnError, setTurnError] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const isValid = validate();

        if (isValid) {
            setPlayerError("");
            setTurnError("");
        }
    }

    const validate = () => {
        let playerError = "";
        let turnError = "";

        if (currentPlayer === "") { playerError = "Player can only be Player 1, Player 2, or Demo"; }
        if (playerTurn === "") { turnError = "Turn can only be Black or White" }

        if (playerError || turnError) {
            setPlayerError(playerError);
            setTurnError(turnError);
            return false;
        }

        return true;
    }
    
    return (
        <React.Fragment>
            <h3>New Game Settings</h3>
            <form className="game-form">
                <div id="currentPlayer" className="form-field" >
                    <label>
                        <p>Player</p>
                        <input type="text" name="player" required onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            event.preventDefault();
                            setCurrentPlayer(event.target.value);
                        }} />
                    </label>
                </div>
                <div className="input-error">{playerError}</div>
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
                        <input type="text" name="turn" required onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            event.preventDefault();
                            setPlayerTurn(event.target.value);
                        }} />
                    </label>
                </div>
                <div className="input-error">{turnError}</div>
                <div id="submit" className="form-field" >
                    <input type="submit" value="Submit" onClick={(event: React.FormEvent) => {
                        event.preventDefault();
                        handleSubmit(event);

                        gameSettings.setGameState({
                            player: currentPlayer,
                            game: {
                                nextFenString: fenString,
                                nextPlayerTurn: playerTurn,
                                movePieceFrom: gameSettings.getGameState.game.movePieceFrom,
                                movePieceTo: gameSettings.getGameState.game.movePieceTo
                            },
                            resetGame: true
                        })
                    }}/>
                </div>
        </form>
      </React.Fragment>
    );
}

export default GameSettings;
