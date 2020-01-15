<!-- Headings -->
# UniChess Chess Engine

## Table of Contents
1. [Introduction](#Introduction)
2. [Features](#Features)
3. [Plans](#Plans)
4. [Misc](#Misc)
___

## Introduction

### What is it?
I created a demonstration of a Chess Engine in React, HTML5 Canvas, and TypeScript for a unit at my university. The unit focused on full-stack development, using front and backend technologies of our choice. Since the unit finished, I extracted the game specific code from the [UniChess](https://github.com/Cyn1x/unichess) repository to this repository, and added this repository as a dependency in the old repository.

### What does it do?
It's a demonstration of a chess engine in React and HTML5 Canvas using TypeScript under the hood. After cloning the files and building them, a simple UI will appear, allowing basic interaction with the game.

### Purpose
The purpose of this was to get to know React, while I continue to get to know React on the PvP web app that uses this repository as a dependency.
___

## Features

### What is in it?
- A basic demonstration player which can only move the piece colour corressponding to the current colour's turn
- Custom piece positioning using Forsyth-Edwards Notation

### What is not in it?
- Computer controlled opponent

___

## Plans

### What else will be done?
- Refactor to further break up code into smaller, and reusable functions
- Improved demonstration mode
- Possible port over to rust, having the Rust program compute the game logic on the server-side, while the TypeScript code will render only the UI on the client-side
- Documentation to show how it works

### What will not be done?
- AI in TypeScript. I personally would prefer to do all of this in Rust, using TypeScript for the UI only

___

## Misc

### License Information
GNU General Public License v3.0

### Tasks
* [x] Chessboard logic
* [x] Chessboard piece placement
* [x] HTML5 Canvas UI
* [x] Piece-specific move logic
* [x] FEN parsing
* [x] FEN creation
* [x] Check detection
* [ ] Checkmate detection
* [ ] Fifty-move rule
* [x] Castling ability
* [ ] En Passant ability
* [ ] Pawn upgrade ability
* [x] Separate pipeline for actioning multiplayer opponent moves over websockets
* [ ] In-Game Menu or extra prop allowing customisation of certain features
* [ ] Documentation
* [ ] Advanced interaction for users
* [ ] Strip debug code when rollup performs a package
* [ ] AI
* [ ] Port to Rust

### Using current build
Clone to file system, and `npm install` to install required dependencies. Then use `npm start` for Webpack to load the dev environment.

### Using externally
Add as a dependency to your package.json file
```json
{
    "dependencies": {
        "unichess-chess-engine": "github:Cyn1x/unichess-chess-engine#master"
    },
}
```

Example usage in a react component
```typescript

interface IGame {
    game: GameState;
    player: string;
}


class Game extends React.Component<IGame> {

    updateState = (props: GameState) => {
        this.props.sendGame({
            nextFenString: props.nextFenString,
            nextPlayerTurn: props.nextPlayerTurn,
            movePieceFrom: props.movePieceFrom,
            movePieceTo: props.movePieceTo
        })
    }

    render() {
        return (
            <Styles>
                <Canvas
                    player={this.props.player}
                    game={this.props.game}
                    controller={this.updateState}
                />
            </Styles>
        );
    }
}
```

`player` must be either `"Player 1"` for white or `"Player 2"` for black

`nextFenString` should be in the format of `"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"`

Other variances of the above are allowed, though the FEN must be in the format of:

```
[positions] [turn colour] [castling] [en passant square] [halfmove clock] [fullmove clock]
```

`nextPlayerTurn` should be either `"White"` or `"Black"`

### WTF?
The external usage is the way I use it for my separate PvP chess web app, and I don't expect anyone to want to use it that way. This is just here for information. I use Redux for local store management, and exact external usage is as follows
```typescript
class Game extends React.Component<IGame> {

    updateState = (props: GameState) => {
        this.props.sendGame({
            nextFenString: props.nextFenString,
            nextPlayerTurn: props.nextPlayerTurn,
            movePieceFrom: props.movePieceFrom,
            movePieceTo: props.movePieceTo
        })
    }

    render() {
        return (
            <Styles>
                <Canvas
                    player={this.props.player}
                    game={this.props.game}
                    controller={this.updateState}
                />
            </Styles>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    activity: state.activityState,
    game: state.gameState
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): IGameDispatchProps => ({
    updateActivityState: (action: ActivityState) => dispatch(updateActivityState(action)),
    sendGame: (game: GameState) => dispatch(sendGame(game))
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);

```
