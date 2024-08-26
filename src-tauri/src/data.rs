//! Contains definitions of the standard curve sets (i.e. gridlines) to be transformed and displayed.

use nalgebra::Matrix2;

use super::*;

pub fn lookup_curve_family(name: &str) -> Option<&'static [Matrix2<Complexf>]> {
    CURVE_FAMILY_MAPPING.get(name).copied()
}

/// Lookup table mapping a name to the family of curves it represents
const CURVE_FAMILY_MAPPING: phf::Map<&'static str, &'static [Matrix2<Complexf>]> = phf::phf_map! {
    "xy" => XY_GRIDLINES,
    "polar" => POLAR_GRIDLINES,
};

/// Generates the 2x2 matrix representation of the line equation `x = c`
macro_rules! y_axis_gridline {
    ($x:expr) => {{
        Matrix2::new(
            Complexf::ONE,
            Complexf::new(-$x - 1.0, 0.0),
            Complexf::ONE,
            Complexf::new(-$x + 1.0, 0.0),
        )
    }};
}

/// Generates the 2x2 matrix representation of the line equation `y = c`
macro_rules! x_axis_gridline {
    ($y:expr) => {{
        Matrix2::new(
            Complexf::ONE,
            Complexf::new(0.0, -$y - 1.0),
            Complexf::ONE,
            Complexf::new(0.0, -$y + 1.0),
        )
    }};
}

const XY_GRIDLINES: &[Matrix2<Complexf>] = &[
    /* y-axis lines */
    y_axis_gridline!(-20.0),
    y_axis_gridline!(-19.0),
    y_axis_gridline!(-18.0),
    y_axis_gridline!(-17.0),
    y_axis_gridline!(-16.0),
    y_axis_gridline!(-15.0),
    y_axis_gridline!(-14.0),
    y_axis_gridline!(-13.0),
    y_axis_gridline!(-12.0),
    y_axis_gridline!(-11.0),
    y_axis_gridline!(-10.0),
    y_axis_gridline!(-9.0),
    y_axis_gridline!(-8.0),
    y_axis_gridline!(-7.0),
    y_axis_gridline!(-6.0),
    y_axis_gridline!(-5.0),
    y_axis_gridline!(-4.0),
    y_axis_gridline!(-3.0),
    y_axis_gridline!(-2.0),
    y_axis_gridline!(-1.0),
    y_axis_gridline!(0.0),
    y_axis_gridline!(1.0),
    y_axis_gridline!(2.0),
    y_axis_gridline!(3.0),
    y_axis_gridline!(4.0),
    y_axis_gridline!(5.0),
    y_axis_gridline!(6.0),
    y_axis_gridline!(7.0),
    y_axis_gridline!(8.0),
    y_axis_gridline!(9.0),
    y_axis_gridline!(10.0),
    y_axis_gridline!(11.0),
    y_axis_gridline!(12.0),
    y_axis_gridline!(13.0),
    y_axis_gridline!(14.0),
    y_axis_gridline!(15.0),
    y_axis_gridline!(16.0),
    y_axis_gridline!(17.0),
    y_axis_gridline!(18.0),
    y_axis_gridline!(19.0),
    y_axis_gridline!(20.0),
    /* x-axis lines */
    x_axis_gridline!(-20.0),
    x_axis_gridline!(-19.0),
    x_axis_gridline!(-18.0),
    x_axis_gridline!(-17.0),
    x_axis_gridline!(-16.0),
    x_axis_gridline!(-15.0),
    x_axis_gridline!(-14.0),
    x_axis_gridline!(-13.0),
    x_axis_gridline!(-12.0),
    x_axis_gridline!(-11.0),
    x_axis_gridline!(-10.0),
    x_axis_gridline!(-9.0),
    x_axis_gridline!(-8.0),
    x_axis_gridline!(-7.0),
    x_axis_gridline!(-6.0),
    x_axis_gridline!(-5.0),
    x_axis_gridline!(-4.0),
    x_axis_gridline!(-3.0),
    x_axis_gridline!(-2.0),
    x_axis_gridline!(-1.0),
    x_axis_gridline!(0.0),
    x_axis_gridline!(1.0),
    x_axis_gridline!(2.0),
    x_axis_gridline!(3.0),
    x_axis_gridline!(4.0),
    x_axis_gridline!(5.0),
    x_axis_gridline!(6.0),
    x_axis_gridline!(7.0),
    x_axis_gridline!(8.0),
    x_axis_gridline!(9.0),
    x_axis_gridline!(10.0),
    x_axis_gridline!(11.0),
    x_axis_gridline!(12.0),
    x_axis_gridline!(13.0),
    x_axis_gridline!(14.0),
    x_axis_gridline!(15.0),
    x_axis_gridline!(16.0),
    x_axis_gridline!(17.0),
    x_axis_gridline!(18.0),
    x_axis_gridline!(19.0),
    x_axis_gridline!(20.0),
];

/// sqrt(3) made available as a max precision constant for use in const trigonometric expressions
/// The constant provided in [`std::f64::consts`] is still experimental
const SQRT_3: f64 = 1.7320508075688771931766041234368458390235900878906250f64;

/// Generates the 2x2 matrix representation of the line `run * y = rise * x`
macro_rules! radial_line {
    (rise = $a:expr, run = $b:expr) => {{
        Matrix2::new(
            Complexf::ONE,
            Complexf::new(-$a, $b),
            Complexf::ONE,
            Complexf::new($a, -$b),
        )
    }};
}

/// Generates the 2x2 matrix representation of the circle `|z| = r`
macro_rules! centered_circle {
    ($r:expr) => {{
        Matrix2::new(
            Complexf::ONE,
            Complexf::new(-2.0 * $r, 0.0),
            Complexf::new(2.0, 0.0),
            Complexf::new(-$r, 0.0),
        )
    }};
}

const POLAR_GRIDLINES: &[Matrix2<Complexf>] = &[
    /* radial lines */
    radial_line!(rise = -SQRT_3, run = 1.0), // theta = -2pi/3
    radial_line!(rise = -1.0, run = SQRT_3), // theta = -pi/3
    radial_line!(rise = 0.0, run = 1.0),    // theta = 0
    radial_line!(rise = 1.0, run = SQRT_3),  // theta = pi/3
    radial_line!(rise = SQRT_3, run = 1.0),  // theta = 2pi/3
    radial_line!(rise = 1.0, run = 0.0),    // theta = pi
    /* circles centered at the origin */
    centered_circle!(1.0),
    centered_circle!(2.0),
    centered_circle!(3.0),
    centered_circle!(4.0),
    centered_circle!(5.0),
    centered_circle!(6.0),
    centered_circle!(7.0),
    centered_circle!(8.0),
    centered_circle!(9.0),
    centered_circle!(10.0),
    centered_circle!(11.0),
    centered_circle!(12.0),
    centered_circle!(13.0),
    centered_circle!(14.0),
    centered_circle!(15.0),
    centered_circle!(16.0),
    centered_circle!(17.0),
    centered_circle!(18.0),
    centered_circle!(19.0),
    centered_circle!(20.0),
];
