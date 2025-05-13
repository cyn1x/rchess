use rchess::game::{
    board::Square,
    movement::{KnightDirections, RayDirections, knight_shift, shift},
};

mod common;
use common::bitboard_with_square;

#[test]
fn test_shift_north_from_d4() {
    let d4_bb = bitboard_with_square(Square::D4);
    let result = shift(d4_bb.empty, RayDirections::North);
    let expected = 1u64 << Square::D5.to_bit_index();
    assert_eq!(result, expected);
}

#[test]
fn test_shift_east_from_h4_should_be_zero() {
    let h4_bb = bitboard_with_square(Square::H4);
    let result = shift(h4_bb.empty, RayDirections::East);
    assert_eq!(result, 0);
}

#[test]
fn test_shift_southeast_from_a1_should_be_zero() {
    let a1_bb = bitboard_with_square(Square::A1);
    let result = shift(a1_bb.empty, RayDirections::SouthEast);
    assert_eq!(result, 0);
}

#[test]
fn test_shift_northeast_from_d4() {
    let d4_bb = bitboard_with_square(Square::D4);
    let result = shift(d4_bb.empty, RayDirections::NorthEast);
    let expected = 1u64 << Square::E5.to_bit_index();
    assert_eq!(result, expected);
}

#[test]
fn test_knight_shift_north_northeast_from_d4() {
    let d4_bb = bitboard_with_square(Square::D4);
    let result = knight_shift(d4_bb.empty, KnightDirections::NorthNorthEast);
    let expected = 1u64 << Square::E6.to_bit_index();
    assert_eq!(result, expected);
}

#[test]
fn test_knight_shift_north_north_east_from_h6_should_be_zero() {
    let h4_bb = bitboard_with_square(Square::H6);
    let result = knight_shift(h4_bb.empty, KnightDirections::NorthNorthEast);
    assert_eq!(result, 0);
}

#[test]
fn test_knight_shift_southsoutheast_from_a1_should_be_zero() {
    let a1_bb = bitboard_with_square(Square::A1);
    let result = knight_shift(a1_bb.empty, KnightDirections::SouthSouthEast);
    assert_eq!(result, 0);
}

#[test]
fn test_knight_shift_northnortheast_from_d4() {
    let d4_bb = bitboard_with_square(Square::D4);
    let result = knight_shift(d4_bb.empty, KnightDirections::NorthNorthEast);
    let expected = 1u64 << Square::E6.to_bit_index();
    assert_eq!(result, expected);
}
