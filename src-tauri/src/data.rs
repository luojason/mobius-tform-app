//! Contains definitions of the standard curve sets (i.e. gridlines) to be transformed and displayed.

use nalgebra::Matrix2;
use std::f64::consts::SQRT_2;

use super::*;

pub fn lookup_curve_family(name: &str) -> Option<&'static [Matrix2<Complexf>]> {
    CURVE_FAMILY_MAPPING.get(name).copied()
}

/// Lookup table mapping a name to the family of curves it represents
const CURVE_FAMILY_MAPPING: phf::Map<&'static str, &'static [Matrix2<Complexf>]> = phf::phf_map! {
    "xy" => XY_GRIDLINES,
    "polar" => POLAR_GRIDLINES,
    "apollo" => APOLLONIAN_CIRCLES,
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

/// Generates the 2x2 matrix representation of the circle `|z - c| = r`
macro_rules! circle {
    (c = [$x:expr, $y:expr], r = $r:expr) => {{
        Matrix2::new(
            Complexf::ONE,
            Complexf::new(-2.0 * $r - $x, -$y),
            Complexf::new(2.0, 0.0),
            Complexf::new(-$r - 2.0 * $x, -2.0 * $y),
        )
    }};
}

/// Generates the 2x2 matrix representation of the circle `|z| = r`
macro_rules! centered_circle {
    ($r:expr) => {
        circle!(c = [0.0, 0.0], r = $r)
    };
}

const POLAR_GRIDLINES: &[Matrix2<Complexf>] = &[
    /* radial lines */
    radial_line!(rise = -SQRT_3, run = 1.0), // theta = -2pi/3
    radial_line!(rise = -1.0, run = SQRT_3), // theta = -pi/3
    radial_line!(rise = 0.0, run = 1.0),     // theta = 0
    radial_line!(rise = 1.0, run = SQRT_3),  // theta = pi/3
    radial_line!(rise = SQRT_3, run = 1.0),  // theta = 2pi/3
    radial_line!(rise = 1.0, run = 0.0),     // theta = pi
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

/// 4th root of 2 made available as a max precision constant for use in the geometric mean to interpolate between apollonian circles
const SQRT_SQRT_2: f64 = 1.18920711500272102689734765590401366353034973144531250f64;

/// Generates the 2x2 matrix representation of the circles `|z - 5| = p|z + 5|` and `|z + 5| = p|z - 5|`
macro_rules! apollonian_circle_pair {
    ($p:expr, left) => {{
        Matrix2::new(
            Complexf::ONE,
            Complexf::new(-5.0, 0.0),
            Complexf::new($p, 0.0),
            Complexf::new($p * 5.0, 0.0),
        )
    }};
    ($p:expr, right) => {{
        Matrix2::new(
            Complexf::ONE,
            Complexf::new(5.0, 0.0),
            Complexf::new($p, 0.0),
            Complexf::new($p * -5.0, 0.0),
        )
    }};
}

#[rustfmt::skip]
const APOLLONIAN_CIRCLES: &[Matrix2<Complexf>] = &[
    /* circle pairs running along the x-axis and converging around -5.0 and 5.0 */
    apollonian_circle_pair!(1.0, left),
    apollonian_circle_pair!(1.0 * SQRT_SQRT_2, left),
    apollonian_circle_pair!(SQRT_2, left),
    apollonian_circle_pair!(SQRT_2 * SQRT_SQRT_2, left),
    apollonian_circle_pair!(2.0, left),
    apollonian_circle_pair!(2.0 * SQRT_SQRT_2, left),
    apollonian_circle_pair!(2.0 * SQRT_2, left),
    apollonian_circle_pair!(4.0, left),
    apollonian_circle_pair!(4.0 * SQRT_2, left),
    apollonian_circle_pair!(8.0, left),
    apollonian_circle_pair!(8.0 * SQRT_2, left),
    apollonian_circle_pair!(16.0, left),
    apollonian_circle_pair!(16.0 * SQRT_2, left),
    apollonian_circle_pair!(32.0, left),
    apollonian_circle_pair!(1.0 * SQRT_SQRT_2, right),
    apollonian_circle_pair!(SQRT_2, right),
    apollonian_circle_pair!(SQRT_2 * SQRT_SQRT_2, right),
    apollonian_circle_pair!(2.0, right),
    apollonian_circle_pair!(2.0 * SQRT_SQRT_2, right),
    apollonian_circle_pair!(2.0 * SQRT_2, right),
    apollonian_circle_pair!(4.0, right),
    apollonian_circle_pair!(4.0 * SQRT_2, right),
    apollonian_circle_pair!(8.0, right),
    apollonian_circle_pair!(8.0 * SQRT_2, right),
    apollonian_circle_pair!(16.0, right),
    apollonian_circle_pair!(16.0 * SQRT_2, right),
    apollonian_circle_pair!(32.0, right),
    /*
     Circles running along the y-axis passing through -5.0 and 5.0.
     The radii are hard-coded and computed based on `sqrt(c^2 + r^2)` (where r = 5),
     since const sqrt is not available to do this computation at compile time.
     TODO: may be worth investigating initializing this lazily at runtime to avoid needing to hardcode this
    */
    circle!(c = [0.0, 0.0], r = 5.0f64),
    circle!(c = [0.0, 1.0], r = 5.09901951359278449160683521768078207969665527343750f64),
    circle!(c = [0.0, 2.0], r = 5.385164807134503739405317901400849223136901855468750f64),
    circle!(c = [0.0, 3.0], r = 5.83095189484530074253143538953736424446105957031250f64),
    circle!(c = [0.0, 4.0], r = 6.4031242374328485311707481741905212402343750f64),
    circle!(c = [0.0, 5.0], r = 7.071067811865475505328504368662834167480468750f64),
    circle!(c = [0.0, 6.0], r = 7.810249675906653976653615245595574378967285156250f64),
    circle!(c = [0.0, 7.0], r = 8.6023252670426266774938994785770773887634277343750f64),
    circle!(c = [0.0, 8.0], r = 9.43398113205660315827572048874571919441223144531250f64),
    circle!(c = [0.0, 9.0], r = 10.29563014098700080012349644675850868225097656250f64),
    circle!(c = [0.0, 10.0], r = 11.1803398874989490252573887119069695472717285156250f64),
    circle!(c = [0.0, 11.0], r = 12.083045973594572330966911977156996726989746093750f64),
    circle!(c = [0.0, 12.0], r = 13.0f64),
    circle!(c = [0.0, 13.0], r = 13.928388277184119203866430325433611869812011718750f64),
    circle!(c = [0.0, 14.0], r = 14.86606874731850602699978480814024806022644042968750f64),
    circle!(c = [0.0, 15.0], r = 15.81138830084189628166768670780584216117858886718750f64),
    circle!(c = [0.0, 16.0], r = 16.763054614240211037667904747650027275085449218750f64),
    circle!(c = [0.0, 17.0], r = 17.72004514666934937849873676896095275878906250f64),
    circle!(c = [0.0, 18.0], r = 18.6815416922694055301690241321921348571777343750f64),
    circle!(c = [0.0, 19.0], r = 19.6468827043884992633593356003984808921813964843750f64),
    circle!(c = [0.0, 20.0], r = 20.6155281280883038164120080182328820228576660156250f64),
    circle!(c = [0.0, -1.0], r = 5.09901951359278449160683521768078207969665527343750f64),
    circle!(c = [0.0, -2.0], r = 5.385164807134503739405317901400849223136901855468750f64),
    circle!(c = [0.0, -3.0], r = 5.83095189484530074253143538953736424446105957031250f64),
    circle!(c = [0.0, -4.0], r = 6.4031242374328485311707481741905212402343750f64),
    circle!(c = [0.0, -5.0], r = 7.071067811865475505328504368662834167480468750f64),
    circle!(c = [0.0, -6.0], r = 7.810249675906653976653615245595574378967285156250f64),
    circle!(c = [0.0, -7.0], r = 8.6023252670426266774938994785770773887634277343750f64),
    circle!(c = [0.0, -8.0], r = 9.43398113205660315827572048874571919441223144531250f64),
    circle!(c = [0.0, -9.0], r = 10.29563014098700080012349644675850868225097656250f64),
    circle!(c = [0.0, -10.0], r = 11.1803398874989490252573887119069695472717285156250f64),
    circle!(c = [0.0, -11.0], r = 12.083045973594572330966911977156996726989746093750f64),
    circle!(c = [0.0, -12.0], r = 13.0f64),
    circle!(c = [0.0, -13.0], r = 13.928388277184119203866430325433611869812011718750f64),
    circle!(c = [0.0, -14.0], r = 14.86606874731850602699978480814024806022644042968750f64),
    circle!(c = [0.0, -15.0], r = 15.81138830084189628166768670780584216117858886718750f64),
    circle!(c = [0.0, -16.0], r = 16.763054614240211037667904747650027275085449218750f64),
    circle!(c = [0.0, -17.0], r = 17.72004514666934937849873676896095275878906250f64),
    circle!(c = [0.0, -18.0], r = 18.6815416922694055301690241321921348571777343750f64),
    circle!(c = [0.0, -19.0], r = 19.6468827043884992633593356003984808921813964843750f64),
    circle!(c = [0.0, -20.0], r = 20.6155281280883038164120080182328820228576660156250f64),
];
