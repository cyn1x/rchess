//! Initializes chess game mechanics

use crate::game::board::Bitboard;

pub mod board;
pub mod fen;
pub mod movement;
pub mod piece;

#[allow(dead_code)]
struct Cli {
    pattern: String,
    path: Option<String>,
}

pub fn init() {
    // Initializes the chess engine
    parse_args();

    let mut board: Bitboard = Bitboard::default();
    let fen: Vec<(u8, char)> = fen::from_fen(None);

    board.populate(fen);
    board.pretty_print();
}

fn parse_args() {
    // Parse arguments and determine program behaviour
    let pattern = std::env::args().nth(1);
    let path = std::env::args().nth(2);

    if !pattern.is_some() {
        // No CLI arguments given; continue with default behavior.
        return;
    }

    let args = Cli {
        pattern: pattern.unwrap(),
        path: path.clone().take(),
    };
    match_args(&args);

    std::process::exit(0x0);
}

fn match_args(args: &Cli) {
    // Dispatch to the appropriate program logic based on arguments.
    match args.pattern.as_str() {
        "--perft" => debug::perft(1),
        _ => cli_help(args),
    }
}

fn cli_help(args: &Cli) {
    // Display help information
    todo!()
}
