//! Parser for FEN strings

const DEFAULT_FEN: &str = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

pub fn from_fen(fen_str: Option<String>) -> Vec<(u8, char)> {
    let fen_repr: String = if fen_str.clone().take() != None {
        fen_str.unwrap()
    } else {
        DEFAULT_FEN.to_string()
    };

    let (positions, _state): (&str, &str) = match fen_repr.split_once(' ') {
        Some(pair) => pair,
        None => {
            eprintln!("Invalid FEN string");
            return [].to_vec();
        }
    };

    let merged_ranks = positions
        .split('/')
        .collect::<Vec<&str>>()
        .join("");

    let mut squares: Vec<(u8, char)> = Vec::new();
    let mut target_square = 0;

    for c in merged_ranks.chars() {
        if c.is_ascii_digit() {
            // Advance the target square by the amount of unoccupied squares in the FEN string
            target_square += c.to_digit(10).unwrap();
        } else if c.is_ascii() {
            squares.push((target_square as u8, c));
            target_square += 1;
        }
    }

    squares
}

pub fn to_fen(_b: u64) -> String { todo!() }
