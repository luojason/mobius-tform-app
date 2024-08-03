//! Contains the different math algorithms we will be using.

use na::Matrix2;
use nalgebra as na;

use super::*;

/// Converts a 2x2 matrix representation of a [`Curve`] into a more visualizable representation.
///
/// Converts a 2x2 matrix representing the equation
/// `|(m00 * z + m01)/(m10 * z + m11)| = 1`
/// into the corresponding line/curve.
///
/// It is assumed that the input matrix is not singular (i.e., the corresponding curve is not degenerate).
pub fn matrix_to_curve(m: &Matrix2<Complexf>) -> Curve {
    // de-structure matrix entries for convenience
    // the number indicates the column number of the entry
    let min0;
    let min1;
    let maj0;
    let maj1;

    // squared magnitudes of the leading entries in each row
    let mut min_norm_sqr = m[(0, 0)].norm_sqr();
    let mut maj_norm_sqr = m[(1, 0)].norm_sqr();

    // store the row with the smaller leading coefficient with prefix "min", and the other with prefix "maj";
    // by knowing which leading entry is smaller,
    // can potentially control for floating point error in any future algorithm optimizations
    if min_norm_sqr <= maj_norm_sqr {
        min0 = m[(0, 0)];
        min1 = m[(0, 1)];
        maj0 = m[(1, 0)];
        maj1 = m[(1, 1)];
    } else {
        std::mem::swap(&mut min_norm_sqr, &mut maj_norm_sqr);
        maj0 = m[(0, 0)];
        maj1 = m[(0, 1)];
        min0 = m[(1, 0)];
        min1 = m[(1, 1)];
    }

    // if one of the leading coefficients is zero, the matrix describes a circle
    if approx::abs_diff_eq!(0.0, min_norm_sqr) {
        return Curve::Circle {
            center: -maj1 / maj0,
            radius: (min1.norm_sqr() / maj_norm_sqr).sqrt(),
        };
    }

    // otherwise, neither of the leading coefficients is zero
    let maj_pt = -maj1 / maj0;
    let min_pt = -min1 / min0;
    let ratio_sqr = min_norm_sqr / maj_norm_sqr; // note that ratio_sqr < 1

    // if leading coefficients have the same norm, the matrix describes a line
    if approx::relative_eq!(1.0, ratio_sqr) {
        return Curve::Line {
            point: 0.5 * (maj_pt + min_pt),
            slope: (maj_pt - min_pt) * Complexf::I,
        };
    }

    // otherwise, the matrix describes a circle
    let ratio = ratio_sqr.sqrt();
    let affine_coeff = (1.0 - ratio_sqr).recip(); // used in the affine combination to compute the center
    return Curve::Circle {
        center: affine_coeff * maj_pt + (1.0 - affine_coeff) * min_pt,
        radius: ratio * affine_coeff * (maj_pt - min_pt).norm(),
    };
}
