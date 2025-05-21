//! Initializes chess game mechanics

use crate::game::board::Bitboard;

pub mod board;
pub mod fen;
pub mod movement;
pub mod piece;

pub fn init() {
    let mut board: Bitboard = Bitboard::default();
    let fen: Vec<(u8, char)> = fen::from_fen(None);

    board.populate(fen);
    board.pretty_print();
}
