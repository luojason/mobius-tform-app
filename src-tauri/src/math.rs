//! Contains the different math algorithms we will be using.

use nalgebra as na;
use nalgebra::{Matrix2, Vector2, U2};

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
    let mut min_norm_sqr = m.m11.norm_sqr();
    let mut maj_norm_sqr = m.m21.norm_sqr();

    // store the row with the smaller leading coefficient with prefix "min", and the other with prefix "maj";
    // by knowing which leading entry is smaller,
    // can potentially control for floating point error in any future algorithm optimizations
    if min_norm_sqr <= maj_norm_sqr {
        min0 = m.m11;
        min1 = m.m12;
        maj0 = m.m21;
        maj1 = m.m22;
    } else {
        std::mem::swap(&mut min_norm_sqr, &mut maj_norm_sqr);
        maj0 = m.m11;
        maj1 = m.m12;
        min0 = m.m21;
        min1 = m.m22;
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

    // if leading coefficients have (approximately) the same norm, the matrix describes a line
    // NOTE: can fine-tune this threshold to prevent circles with excessively large radii from being generated
    if approx::relative_eq!(1.0, ratio_sqr, max_relative = 0.001) {
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

/// Apply a Mobius transformation to a point in the extended complex plane.
pub fn apply_mobius_tform(tform: &Matrix2<Complexf>, p: &ExtComplex) -> ExtComplex {
    let mapped_pt = match *p {
        ExtComplex::Inf => tform.m11 / tform.m21, // take limit for p = infinity
        ExtComplex::Val(v) => {
            let proj_v = tform * Vector2::new(v, Complexf::ONE); // represent in projective coordinates
            proj_v[0] / proj_v[1]
        }
    };

    if mapped_pt.is_finite() {
        ExtComplex::Val(mapped_pt)
    } else {
        // treat nan under this case too, as complex division by 0 generally results in nan since it results in 0/0 under the std formula
        ExtComplex::Inf
    }
}

/// Generate a Mobius transformation from a set of sample points.
///
/// Given a set of input and output [`ExtComplex`],
/// compute the Mobius transformation that maps each input to the corresponding output, if one exists.
/// Otherwise, return nothing.
///
/// A Mobius transformation is uniquely determined by 3 distinct sample points. If one does not exist,
/// it is because some of the inputs are (nearly[^1]) equal to each other, or some of the outputs are (nearly) equal to each other.
///
/// [^1]: because of floating point approximation, the output matrix may be singular even with distinct but sufficient close numbers.
/// With infinite precision we could use exact equality.
pub fn compute_mobius_tform(
    inputs: &[ExtComplex; 3],
    outputs: &[ExtComplex; 3],
) -> Option<Matrix2<Complexf>> {
    let map_from_inputs = compute_partial_mobius_tform(inputs);
    let map_to_outputs = compute_partial_mobius_tform(outputs).try_inverse()?;
    let transform = map_to_outputs * map_from_inputs;

    // NOTE: can fine-tune this threshold to determine when a transformation counts as "singular".
    // higher thresholds will prevent curves from becoming visibly inaccurate as the input/output pairs approach each other,
    // but will reduce the range of transformations that can be computed.
    if approx::abs_diff_eq!(
        Complexf::ZERO,
        transform.determinant(),
        epsilon = f64::EPSILON * 100.0
    ) {
        None
    } else {
        Some(transform)
    }
}

/// Internal helper method used by [compute_mobius_tform].
///
/// Generates the Mobius tranformation that maps:
///  - z_1 -> 0
///  - z_2 -> infinity
///  - z_3 -> 1
/// assuming that one exists.
/// Does not check that the inputs are distinct (in which case a Mobius transformation does not exist).
/// In this case, the returned matrix will be singular.
#[inline(always)]
fn compute_partial_mobius_tform(inputs: &[ExtComplex; 3]) -> Matrix2<Complexf> {
    // Mobius transformation as described above is given by
    // (z - z_1) * (z_3 - z_2)
    // -----------------------
    // (z - z_2) * (z_3 - z_1)
    let mut m = na::UninitMatrix::uninit(U2, U2);
    let mut top_factor; // coefficient to multiply top row by, i.e. (z_3 - z_2)
    let mut bot_factor; // coefficient to multiply bottom row by, i.e. (z_3 - z_1)

    // initialize top row of matrix based on z_1
    if let ExtComplex::Val(v) = inputs[0] {
        m[(0, 0)].write(Complexf::ONE);
        m[(0, 1)].write(-v);
        bot_factor = v;
    } else {
        // handle infinite case
        m[(0, 0)].write(Complexf::ZERO);
        m[(0, 1)].write(Complexf::ONE);
        bot_factor = Complexf::from(f64::INFINITY);
    }

    // initialize bottom row of matrix based on z_2
    if let ExtComplex::Val(v) = inputs[1] {
        m[(1, 0)].write(Complexf::ONE);
        m[(1, 1)].write(-v);
        top_factor = v;
    } else {
        // handle infinite case
        m[(1, 0)].write(Complexf::ZERO);
        m[(1, 1)].write(Complexf::ONE);
        top_factor = Complexf::from(f64::INFINITY);
    }

    // SAFETY: all entries of m have been initialized via the last two if statements
    let mut m = unsafe { m.assume_init() };

    // initialize factors based on z_3
    let z_2 = match inputs[2] {
        ExtComplex::Val(v) => v,
        ExtComplex::Inf => Complexf::from(f64::INFINITY),
    };
    top_factor = z_2 - top_factor;
    bot_factor = z_2 - bot_factor;

    // adjust top_factor to handle edge cases due to duplicates
    let guard = top_factor.re;
    if guard.is_nan() {
        // nan implies z_2 and z_3 were both infinite; set factor to 0 to create degenerate matrix
        top_factor = Complexf::ZERO;
    } else if guard.is_infinite() {
        // infinity implies one of z_2 or z_3 were infinite; set factor to 1 to effectively ignore it
        // since we don't need to multiply by (z_3 - z_2) in this case.
        top_factor = Complexf::ONE;
    }
    // same logic applies to bot_factor
    let guard = bot_factor.re;
    if guard.is_nan() {
        bot_factor = Complexf::ZERO;
    } else if guard.is_infinite() {
        bot_factor = Complexf::ONE;
    }

    // multiply matrix rows by the corresponding factors to complete the result
    let mut top_row = m.row_mut(0);
    top_row *= top_factor;
    let mut bot_row = m.row_mut(1);
    bot_row *= bot_factor;

    return m;
}

#[cfg(test)]
#[path = "math_tests.rs"]
mod tests;
