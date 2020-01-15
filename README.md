<!-- Headings -->
# UniChess Chess Engine

## Table of Contents
1. [Introduction](#Introduction)
2. [Features](#Features)
3. [Plans](#Plans)
4. [Usage](#Usage)
5. [Misc](#Misc)
___

## Introduction

### What is it?
I created a demonstration of a PvP Chess Engine using WebSockets in React, HTML5 Canvas, and TypeScript for a unit at my university. The unit focused on full-stack development, using front and backend technologies of our choice. Since the unit finished, I extracted the game specific code from the [UniChess](https://github.com/Cyn1x/unichess) repository to this repository, and added this repository as a dependency in the UniChess repository.

### What does it do?
It's a demonstration of a chess engine in React and HTML5 Canvas, using TypeScript under the hood. After cloning the files and building them, a simple UI will appear, allowing basic interaction with the game.

### Purpose
The purpose of this was to get to know React and other web technologies. I will continue to get to know React on the UniChess PvP chess web app that uses this repository as a dependency.
___

## Features

### What is in it?
- Fully working chess demonstration
- A basic demonstration player which can only move the piece colour corressponding to the current colour's turn
- Custom piece positioning using Forsyth-Edwards Notation

### What is not in it?
- Computer controlled opponent

___

## Plans

### What else will be done?
- Refactor to further break up code into smaller, and reusable functions
- Improved demonstration mode
- Abstract the core engine logic so AI can be added without muddling through the code
- Possible port over to rust, having the Rust program compute the game logic on the server-side, while the TypeScript code will render only the UI on the client-side
- Documentation to show how it works

### What will not be done?
- AI in TypeScript. I personally would prefer to do all of this in Rust, using TypeScript for the UI only. Though I will make it an option to do so anyway.

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
The external usage is the way I use it for my separate PvP chess web app, and I don't expect anyone to want to use it that way. This is just here for information. I wanted to play with Rollup and creating my own dependencies. Additionally, I use Redux for local store management.

### Interaction
This applies to both external usage and using the provided fields on the UI.

* `player`
    * must be a string, and exactly `"Player 1"` for white or `"Player 2"` for black
* `nextFenString`
    * should be in the format of `"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"`
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
* [ ] Checkmate detection
* [ ] Fifty-move rule
* [x] Castling ability
* [ ] En Passant ability
* [ ] Pawn upgrade ability
* [x] Separate pipeline for actioning multiplayer opponent moves over websockets
* [ ] In-Game Menu or extra prop allowing customisation of certain features
* [ ] Documentation to explain how the different stages of gameplay work
* [ ] Advanced interaction for users
* [ ] Strip debug code when Rollup performs a package
* [ ] Ability to plug in AI code for PvE gameplay without having to deal with the core engine logic
* [ ] Port all core logic to Rust to compute on the server-side
* [ ] Branched 'lite' version to reflect changes on the UI from the Rust program
