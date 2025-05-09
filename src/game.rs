//! Initializes chess game mechanics

use crate::game::board::Bitboard;

pub mod board;
pub mod movement;

pub fn init() {
    // TODO: Move to tests
    let board = Bitboard::new();

    board.pretty_print();
}
