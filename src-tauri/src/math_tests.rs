use paste::paste;

use super::*;

/* compute_partial_mobius_tform tests */

// this is a private function, but we write tests for it due to the large number of edge cases handled within it.

#[test]
fn partial_mob_tform_identity() {
    // test that the identity transform is correctly computed
    // TODO: this test is not resilient to scalar multiples of matrices
    let inputs = [
        ExtComplex::new(0.0, 0.0),
        ExtComplex::Inf,
        ExtComplex::new(1.0, 0.0),
    ];
    let tform = compute_partial_mobius_tform(&inputs);
    let expected = Matrix2::identity();

    assert_eq!(tform, expected);
}

// test that duplicate ExtComplex::Inf values are handled appropriately (i.e. singular matrix is returned)
macro_rules! partial_mob_tform_dupe_inf {
    ($case:ident, $z1:expr, $z2:expr, $z3:expr) => {
        paste! {
            #[test]
            fn [<partial_mob_tform_dupe_inf_ $case>]() {
                let inputs = [
                    $z1, $z2, $z3
                ];
                let tform = compute_partial_mobius_tform(&inputs);
                assert!(tform.try_inverse().is_none(), "returned matrix should be singular");
            }
        }
    };
}

partial_mob_tform_dupe_inf!(
    case1,
    ExtComplex::Inf,
    ExtComplex::Inf,
    ExtComplex::new(1.0, 0.0)
);
partial_mob_tform_dupe_inf!(
    case2,
    ExtComplex::Inf,
    ExtComplex::new(1.0, 0.0),
    ExtComplex::Inf
);
partial_mob_tform_dupe_inf!(
    case3,
    ExtComplex::new(1.0, 0.0),
    ExtComplex::Inf,
    ExtComplex::Inf
);
partial_mob_tform_dupe_inf!(case4, ExtComplex::Inf, ExtComplex::Inf, ExtComplex::Inf);

// test that the returned Mobius transformation maps the input values to the expected outputs
macro_rules! partial_mob_tform_eval {
    ($case:ident, $z1:expr, $z2:expr, $z3:expr) => {
        paste! {
            #[test]
            fn [<partial_mob_tform_eval_ $case>]() {
                let inputs = [
                    $z1, $z2, $z3
                ];
                let t = compute_partial_mobius_tform(&inputs);

                assert_eq!(apply_mobius_tform(&t, &inputs[0]), ExtComplex::new(0.0, 0.0));
                assert_eq!(apply_mobius_tform(&t, &inputs[1]), ExtComplex::Inf);
                assert_eq!(apply_mobius_tform(&t, &inputs[2]), ExtComplex::new(1.0, 0.0));
            }
        }
    };
}

partial_mob_tform_eval!(
    case1,
    ExtComplex::Inf,
    ExtComplex::new(1.0, 0.0),
    ExtComplex::new(0.0, 1.0)
);
partial_mob_tform_eval!(
    case2,
    ExtComplex::new(1.0, 0.0),
    ExtComplex::Inf,
    ExtComplex::new(0.0, 1.0)
);
partial_mob_tform_eval!(
    case3,
    ExtComplex::new(1.0, 0.0),
    ExtComplex::new(0.0, 1.0),
    ExtComplex::Inf
);
partial_mob_tform_eval!(
    case4,
    ExtComplex::new(2.0, 3.0),
    ExtComplex::new(1.0, 0.0),
    ExtComplex::new(0.0, 1.0)
);
