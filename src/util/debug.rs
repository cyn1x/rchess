//! Performance test, move path enumeration

use crate::game::{
    board::Bitboard,
    fen,
    movement::{EncodedMove, generate_moves},
};

#[derive(Default)]
struct Perft {
    bitboard: Bitboard,
}

impl Perft {
    fn default() -> Perft {
        Self {
            bitboard: Bitboard::default(),
        }
    }

    pub fn perft(&mut self, depth: u32) -> u64 {
        let mut move_list = std::array::from_fn(|_| EncodedMove::default());
        let mut nodes = 0;

        if depth == 0 {
            return 1u64;
        }

        let moves = generate_moves(&mut move_list, &mut self.bitboard);

        // TODO: Move generation computation
        /*for i in 0..moves {
            // make_move(&move_list[i as usize]);
            /*if !is_in_check() {
                nodes += perft(depth - 1);
            }*/
            // unmake_move(&move_list[i as usize]);
        }*/

        nodes
    }
}

pub fn perft(depth: u32) {
    let mut debug = Perft::default();
    let fen: Vec<(u8, char)> = fen::from_fen(None);

    debug.bitboard.populate(fen);
    debug.bitboard.pretty_print();

    debug.perft(depth);
}
