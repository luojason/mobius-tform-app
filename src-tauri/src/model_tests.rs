use serde_json::{json, Value};

use super::*;

/* ExtComplex (de)-serialization tests */

#[test]
fn serialize_extcomplex_inf_variant() {
    let c = ExtComplex::Inf;
    let json = serde_json::to_string(&c).expect("serialization should succeed");

    assert_eq!(json, "\"inf\"");
}

#[test]
fn serialize_extcomplex_inf_value() {
    let c = ExtComplex::new(0.0, f64::INFINITY);
    let json = serde_json::to_string(&c).expect("serialization should succeed");

    assert_eq!(json, "\"inf\"");
}

#[test]
fn serialize_extcomplex_finite_value() {
    let c = ExtComplex::new(1.0, 2.0);
    let json = serde_json::to_string(&c).expect("serialization should succeed");

    assert_eq!(json, "[1.0,2.0]");
}

#[test]
fn serialize_extcomplex_nan_failure() {
    let c = ExtComplex::new(f64::NAN, 0.0);
    let err = serde_json::to_string(&c).expect_err("serialization should fail");

    assert!(err.to_string().contains("value contains nan"));
}

#[test]
fn deserialize_extcomplex_inf_variant() {
    let c = serde_json::from_str::<ExtComplex>("\"inf\"").expect("deserialization should succeed");

    assert_eq!(c, ExtComplex::Inf);
}

#[test]
fn deserialize_extcomplex_inf_value() {
    // should deserialize to Inf variant when numbers are too large to fit inside the internal floating point type
    let c =
        serde_json::from_str::<ExtComplex>("[1, 1e1000]").expect("deserialization should succeed");

    assert_eq!(c, ExtComplex::Inf);
}

#[test]
fn deserialize_extcomplex_finite_value() {
    let c = serde_json::from_str::<ExtComplex>("[1, 2.0]").expect("deserialization should succeed");
    let expected = ExtComplex::new(1.0, 2.0);

    assert_eq!(c, expected);
}

#[test]
fn deserialize_extcomplex_invalid_value_failure() {
    let err = serde_json::from_str::<ExtComplex>("{}").expect_err("deserialization should fail");

    assert!(err
        .to_string()
        .contains("the string \"inf\" or a tuple of 2 numbers"));
}

#[test]
fn deserialize_extcomplex_nan_failure() {
    let err = serde_json::from_str::<ExtComplex>("[null, null]")
        .expect_err("deserialization should fail");

    assert!(err.is_data());
}

/* Curve (de)-serialization tests */

#[test]
fn serialize_curve_line() {
    let curve = Curve::Line {
        point: Complexf::new(1.0, 2.0),
        slope: Complexf::new(3.0, 4.0),
    };
    let json = serde_json::to_string(&curve).expect("serialization should succeed");
    let expected = json!({
        "type": "line",
        "point": [1.0, 2.0],
        "slope": [3.0, 4.0]
    });

    assert_eq!(serde_json::from_str::<Value>(&json).unwrap(), expected);
}

#[test]
fn serialize_curve_circle() {
    let curve = Curve::Circle {
        center: Complexf::new(1.0, 2.0),
        radius: 3.0,
    };
    let json = serde_json::to_string(&curve).expect("serialization should succeed");
    let expected = json!({
        "type": "circle",
        "center": [1.0, 2.0],
        "radius": 3.0
    });

    assert_eq!(serde_json::from_str::<Value>(&json).unwrap(), expected);
}

#[test]
fn deserialize_curve_line() {
    let data = r#"{
        "slope": [3.0, 4.0],
        "point": [1.0, 2.0],
        "type": "line"
    }"#;
    let curve = serde_json::from_str::<Curve>(&data).expect("deserialization should succeed");
    let expected = Curve::Line {
        point: Complexf::new(1.0, 2.0),
        slope: Complexf::new(3.0, 4.0),
    };

    assert_eq!(curve, expected);
}

#[test]
fn deserialize_curve_circle() {
    let data = r#"{
        "radius": 3.0,
        "center": [1.0, 2.0],
        "type": "circle"
    }"#;
    let curve = serde_json::from_str::<Curve>(&data).expect("deserialization should succeed");
    let expected = Curve::Circle {
        center: Complexf::new(1.0, 2.0),
        radius: 3.0,
    };

    assert_eq!(curve, expected);
}
