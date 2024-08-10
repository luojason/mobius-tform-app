//! Contains definitions for the API exposed to the frontend.

use serde::Serialize;

use super::*;

/// Visualizes a Mobius transformation based on the provided data.
///
/// This method is provided to the frontend to invoke via Tauri.
///
/// The Mobius transformation corresponding to the provided input/output provides is computed (if one exists),
/// then is applied to pre-defined [`Curves`][Curve] which are returned in the response.
/// The frontend can use the returned data to visualize the Mobius transformation.
///
/// Returns an error when the Mobius transformation is unable to be computed for whatever reason.
#[tauri::command]
pub fn generate_mobius_transformation(
    inputs: [ExtComplex; 3],
    outputs: [ExtComplex; 3],
) -> Result<GenerateMobiusResponse, Error> {
    // compute inverse transform since that is what is needed for transforming the curves.
    // in more detail, curves are represented as a constraint on the *input* of a function
    // (as opposed to the mapping *output* of a function), hence it is contravariant w.r.t. transformations.
    // to transform contravariant variables, we apply the inverse transform to it.
    let inv_tform = math::compute_mobius_tform(&outputs, &inputs).ok_or(Error::DoesNotExist)?;
    let curves = data::XY_GRIDLINES
        .iter()
        .map(|m| math::matrix_to_curve(&(m * inv_tform)))
        .collect::<Vec<_>>();
    return Ok(GenerateMobiusResponse { curves });
}

/// The output of [`generate_mobius_transformation`].
#[derive(Debug, Serialize)]
pub struct GenerateMobiusResponse {
    /// The list of requested [`Curves`][Curve] after being transformed by the computed Mobius transformation.
    pub curves: Vec<Curve>,
}

/// Represents the errors that can occur when calling [`generate_mobius_transformation`].
#[derive(Debug, Serialize)]
#[serde(tag = "kind")]
pub enum Error {
    /// Indicates that no Mobius transformation satisfies the input/output pairs provided,
    /// i.e. the corresponding matrix is singular.
    ///
    /// This occurs when the input/output pairs contains duplicates,
    /// meaning the defined relation is not one-to-one.
    DoesNotExist,
}

#[cfg(test)]
#[path = "api_tests.rs"]
mod tests;
