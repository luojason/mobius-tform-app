//! Contains definitions of the standard curve sets (i.e. gridlines) to be transformed and displayed.

use nalgebra::Matrix2;

use super::*;

pub fn lookup_curve_family(name: &str) -> Option<&'static [Matrix2<Complexf>]> {
    CURVE_FAMILY_MAPPING.get(name).copied()
}

/// Lookup table mapping a name to the family of curves it represents
const CURVE_FAMILY_MAPPING: phf::Map<&'static str, &'static [Matrix2<Complexf>]> = phf::phf_map! {
    "xy" => XY_GRIDLINES,
};

/// Generates the 2x2 matrix representation of the line equation `x=...`
macro_rules! y_axis_gridline {
    ($x:expr) => {
        {
            Matrix2::new(
                Complexf::ONE,
                Complexf::new($x - 1.0, 0.0),
                Complexf::ONE,
                Complexf::new($x + 1.0, 0.0),
            )
        }
    };
}

/// Generates the 2x2 matrix representation of the line equation `y=...`
macro_rules! x_axis_gridline {
    ($y:expr) => {
        {
            Matrix2::new(
                Complexf::ONE,
                Complexf::new(0.0, $y - 1.0),
                Complexf::ONE,
                Complexf::new(0.0, $y + 1.0),
            )
        }
    };
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
