//! Contains definitions of the standard curve sets (i.e. gridlines) to be transformed and displayed.

use nalgebra::Matrix2;

use super::*;

pub const XY_GRIDLINES: &[Matrix2<Complexf>] = &[
    /* y-axis lines */
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(-6.0, 0.0),
        Complexf::ONE,
        Complexf::new(-4.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(-5.0, 0.0),
        Complexf::ONE,
        Complexf::new(-3.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(-4.0, 0.0),
        Complexf::ONE,
        Complexf::new(-2.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(-3.0, 0.0),
        Complexf::ONE,
        Complexf::new(-1.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(-2.0, 0.0),
        Complexf::ONE,
        Complexf::new(0.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(-1.0, 0.0),
        Complexf::ONE,
        Complexf::new(1.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, 0.0),
        Complexf::ONE,
        Complexf::new(2.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(1.0, 0.0),
        Complexf::ONE,
        Complexf::new(3.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(2.0, 0.0),
        Complexf::ONE,
        Complexf::new(4.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(3.0, 0.0),
        Complexf::ONE,
        Complexf::new(5.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(4.0, 0.0),
        Complexf::ONE,
        Complexf::new(6.0, 0.0),
    ),
    /* x-axis lines */
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, -6.0),
        Complexf::ONE,
        Complexf::new(0.0, -4.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, -5.0),
        Complexf::ONE,
        Complexf::new(0.0, -3.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, -4.0),
        Complexf::ONE,
        Complexf::new(0.0, -2.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, -3.0),
        Complexf::ONE,
        Complexf::new(0.0, -1.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, -2.0),
        Complexf::ONE,
        Complexf::new(0.0, 0.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, -1.0),
        Complexf::ONE,
        Complexf::new(0.0, 1.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, 0.0),
        Complexf::ONE,
        Complexf::new(0.0, 2.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, 1.0),
        Complexf::ONE,
        Complexf::new(0.0, 3.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, 2.0),
        Complexf::ONE,
        Complexf::new(0.0, 4.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, 3.0),
        Complexf::ONE,
        Complexf::new(0.0, 5.0),
    ),
    Matrix2::new(
        Complexf::ONE,
        Complexf::new(0.0, 4.0),
        Complexf::ONE,
        Complexf::new(0.0, 6.0),
    ),
];
