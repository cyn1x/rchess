//! Initializes chess game mechanics

use crate::game::board::Bitboard;

pub mod board;
pub mod fen;
pub mod movement;
pub mod piece;

pub fn init() {
    let mut board = Bitboard::default();
    board.populate();

    board.pretty_print();
}
