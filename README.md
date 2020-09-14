# UniChess Chess Engine

## Table of Contents
1. [Introduction](#Introduction)
2. [Features](#Features)
3. [Plans](#Plans)
4. [Usage](#Usage)
5. [Misc](#Misc)
___
![UniChess Chess Engine Image](https://zacvukovic.com/img/portfolio/unichess-chess-engine.jpg "Logo Title Text 1")

## Introduction

### What is it?
I created a demonstration of a PvP Chess Engine using WebSockets in React, HTML5 Canvas, and TypeScript for a unit at my university. The unit focused on full-stack development, using front and backend technologies of our choice. Since the unit finished, I extracted the game specific code from the [UniChess](https://github.com/Cyn1x/unichess) repository to this repository so I could continue to work on the core game logic, and added this repository as a dependency in the UniChess repository.

### What does it do?
It's a demonstration of a chess engine in React and HTML5 Canvas, using TypeScript under the hood. The moves are generated for the player in real-time once a piece is active by determining the valid moves for that piece after it is clicked. For example, if the player's king is attacked by the opponent's rook and the player's queen is selected, the correct move will be generated to either capture the piece, or block it, depending on what rank and file the pieces are on. If there are no valid moves for the player and the king is in check, the result is a checkmate. Otherwise, the result is a stalemate. The fifty-move rule is also set to determine whether the result is a draw.

After cloning the files and building them, a simple UI will appear, allowing basic interaction with the board, and setting custom piece positions using Forsyth-Edwards Notation (FEN).

### Purpose
The purpose of this was to get to know React and other web technologies. I will continue to get to know React on the UniChess PvP chess web app that uses this repository as a dependency.
___

## Features

### What is in it?
- Fully working chess demonstration
- A basic demonstration player which can only move the piece colour corressponding to the current colour's turn
- Custom piece positioning using FEN strings

### What is not in it?
- Computer controlled opponent

___

## Plans

### What else will be done?
- Improved demonstration mode
- Remove conditionals scattered throughout the code which are used to keep sync with multiplayer games over Websockets, and have a separate module dealing with this rather than the core engine code.
- Abstract the core engine logic to provide an API so AI can be added without muddling through the code
- Possible port over to a low-level programming language, having the program compute the game logic on the server-side, while the TypeScript code will render only the UI on the client-side
- Documentation to show how it works

### What will not be done?
- AI in TypeScript. I personally would prefer to do all of this in a low-level programming language, using TypeScript for the UI only. Though time permitting, I may eventually make it an option to do so in TypeScript anyway.

___

## Usage

### Using current build
Clone the repository to your file system, `cd` into the root directory, and `npm install` to install required dependencies. Then use `npm start` for Webpack to load the dev environment.

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

interface GameState {
    nextFenString: string;
    nextPlayerTurn: string;
    movePieceFrom: string;
    movePieceTo: string;
}

interface IGameController {
    game: GameState;
    player: string;
}

class GameController extends React.Component<IGameController> {

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
            <Canvas
                player={this.props.player}
                game={this.props.game}
                controller={this.updateState}
            />
        );
    }
}
```

### Why external usage?
The external usage is the way I use it for my separate PvP chess web app, and I don't expect anyone to want to use it that way. This is just here for information. I wanted to play with Rollup and creating my own dependencies. Additionally, I use Redux for local store management in the [UniChess](https://github.com/Cyn1x/unichess) web app where I retrieve the board state from a callback function after every move.

### Interaction
This applies to both external usage and using the provided fields on the UI.

* `player`
    * must be a string, and exactly `"Player 1"` for white or `"Player 2"` for black
* `nextFenString`
    * should be in the format of `"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"` or empty for the default state
* `nextPlayerTurn`
    * must be a string, and exactly `"White"` for white to have the first turn, or `"Black"` to have the first turn.
* `movePieceFrom` and `movePieceTo`
    * are used to return state to the controlling component.
* `controller`
    * a callback function that actions the game information when returned to the controlling component

Other variances of the FEN string are allowed, though it must be in the format of:

```
[positions] [turn colour] [castling] [en passant square] [halfmove clock] [fullmove clock]
```

An example

```typescript
"rnb1kb2/pp3pp1/2pp1q1r/4pn1p/3P2P1/1PNQBP2/P1P1P2P/2KR1BNR w q - 1 16"
```

Further information on [Forsyth-Edwards Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)

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
* [x] Checkmate detection
* [x] Stalemate detection
* [x] Fifty-move rule
* [x] Castling ability
* [x] En Passant capture ability
* [ ] Pawn upgrade ability
* [ ] General game statistics
* [ ] Separate pipeline for actioning multiplayer opponent moves over Websockets
* [ ] In-Game Menu or extra prop allowing customisation of certain features
* [ ] Option to disable square highlighting for valid moves
* [ ] Documentation to explain how the different stages of gameplay work in the code
* [ ] Advanced interaction for users
* [ ] Strip debug code when Rollup performs a package
* [ ] Ability to plug in AI code for PvE gameplay without having to deal with the core engine logic
* [ ] Port all core logic to a low-level programming language to compute on the server-side
* [ ] Branched 'lite' version to reflect changes on the UI from the other program
* [ ] Replace PNG piece images with SVGs
