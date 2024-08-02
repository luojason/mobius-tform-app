//! Contains the definitions of the math objects/concepts we will be using.

use nalgebra as na;
use serde::{de, ser, Deserialize, Serialize};

/// Convenient type alias for [`na::Complex`].
///
/// We use double-precision floating point numbers for the components of the complex number
/// to match the Javascript Number type.
pub type Complexf = na::Complex<f64>;

/// The curves we're interested in are lines and circles.
/// A Mobius transformation will map a circle/line to another circle/line.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Curve {
    /// A line represents the set of points `point + slope * t`
    #[serde(rename = "line")]
    Line { point: Complexf, slope: Complexf },
    /// A circle represents the set of points `|z - center| = radius`
    #[serde(rename = "circle")]
    Circle { center: Complexf, radius: f32 },
}

/// An element of the extended complex plane (i.e. the Riemann sphere).
///
/// Can either be a regular/finite complex number, or the "point at infinity".
/// We need this type rather than just relying on infinite floating point numbers since those are not representable in JSON.
/// We attempt to maintain the invariant that when this enum contains a value, both the real and imaginary parts are finite and non-nan.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ExtComplex {
    Inf,
    Val(Complexf),
}

impl ExtComplex {
    /// Initialize a regular (finite) complex value from real and imaginary components.
    ///
    /// It is recommended not to pass nan or infinite values into this method.
    pub fn new(re: f64, im: f64) -> Self {
        ExtComplex::Val(Complexf::new(re, im))
    }
}

// need custom Serialize implementation to serialize to either string or struct
impl Serialize for ExtComplex {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match self {
            Self::Inf => serializer.serialize_str("inf"),
            Self::Val(c) if c.is_infinite() => serializer.serialize_str("inf"),
            Self::Val(c) if c.is_nan() => Err(ser::Error::custom("value contains nan")),
            Self::Val(c) => c.serialize(serializer),
        }
    }
}

// need custom Deserialize implementation to deserialize from either string or struct
impl<'de> Deserialize<'de> for ExtComplex {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        struct ExtComplexVisitor;

        impl<'de> de::Visitor<'de> for ExtComplexVisitor {
            type Value = ExtComplex;

            fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
                formatter.write_str("the string \"inf\" or a tuple of 2 numbers")
            }

            // parse string if string is detected
            fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                match v {
                    "inf" => Ok(Self::Value::Inf),
                    _ => Err(de::Error::invalid_value(de::Unexpected::Str(v), &self)),
                }
            }

            // otherwise parse as a standard complex number
            fn visit_seq<A>(self, seq: A) -> Result<Self::Value, A::Error>
            where
                A: de::SeqAccess<'de>,
            {
                Complexf::deserialize(de::value::SeqAccessDeserializer::new(seq))
                    .map(|value| {
                        if value.is_infinite() {
                            Self::Value::Inf
                        } else {
                            Self::Value::Val(value)
                        }
                    })
                    .or_else(|err| {
                        // treat numbers that can't fit inside the internal floating point type as Inf
                        if err.to_string().contains("number out of range") {
                            Ok(Self::Value::Inf)
                        } else {
                            Err(err)
                        }
                    })
            }
        }

        deserializer.deserialize_any(ExtComplexVisitor)
    }
}

#[cfg(test)]
#[path = "model_tests.rs"]
mod tests;
