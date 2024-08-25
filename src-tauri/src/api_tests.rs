use serde_json::json;

use super::*;

#[test]
fn serialize_error_nexist() {
    let err = Error::DoesNotExist;
    let json = serde_json::to_string(&err).expect("serialization should succeed");
    let expected = serde_json::to_string(&json!(
        {
            "kind": "DoesNotExist"
        }
    ))
    .unwrap();

    assert_eq!(json, expected);
}

#[test]
fn serialize_response() {
    let response = GenerateMobiusResponse {
        curves: HashMap::from([(
            "xy",
            vec![
                Curve::Line {
                    point: Complexf::ZERO,
                    slope: Complexf::new(0.0, 1.0),
                },
                Curve::Circle {
                    center: Complexf::ZERO,
                    radius: 5.0,
                },
            ],
        )]),
    };
    let json = serde_json::to_string(&response).expect("serialization should succeed");
    let expected = serde_json::to_string(&json!(
        {
            "curves": {
                "xy": [
                    {
                        "type": "line",
                        "point": [0.0, 0.0],
                        "slope": [0.0, 1.0]
                    },
                    {
                        "type": "circle",
                        "center": [0.0, 0.0],
                        "radius": 5.0
                    }
                ]
            }
        }
    ))
    .unwrap();

    assert_eq!(json, expected);
}

#[test]
fn serialize_empty_response() {
    let response = GenerateMobiusResponse {
        curves: HashMap::new(),
    };
    let json = serde_json::to_string(&response).expect("serialization should succeed");
    let expected = serde_json::to_string(&json!(
        {
            "curves": {}
        }
    ))
    .unwrap();

    assert_eq!(json, expected);
}

#[test]
fn invoke_api_error_nexist() {
    // provide duplicate input/output pairs to trigger error scenario
    let inputs = [ExtComplex::Inf, ExtComplex::Inf, ExtComplex::Inf];
    let outputs = [ExtComplex::Inf, ExtComplex::Inf, ExtComplex::Inf];
    let curves = vec![];
    let result = generate_mobius_transformation(inputs, outputs, curves);

    assert!(result.is_err());
}
