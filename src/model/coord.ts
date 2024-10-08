/**
 * This module contains types and functions related to different coordinate systems used to represent values.
 * Primarily there are 2 coordinate systems used here:
 * 
 * 1. Complex numbers:
 *   This is the "logical" coordinate system used as the source of truth.
 *   The origin is at the center of the rendering window, and units are abstract.
 *   The imaginary axis points *upwards* in the positive direction.
 * 
 * 2. Positional coordinates:
 *   This is the "physical" coordinate system we transform complex numbers into before displaying them.
 *   The origin is at the top-left of the rendering window, and units are in pixels.
 *   The y-axis (corresponding to the imaginary axis) points *downwards* in the positive direction.
 */

/**
 * How many pixels correspond to one unit along either the real/imaginary axis.
 * Used to determine scaling between complex and positional coordinates.
 */
export const PIXELS_PER_UNIT = 15;

/** A complex number. Represented as a compact tuple [real, imaginary] to match with format used in backend. */
export type Complex = [number, number];

/** Represents a 2d point in the viewing window, typically represented in offset coordinate space. */
export interface Position2d {
    readonly x: number;
    readonly y: number;
}

/** Represents a 2d rectangle in the viewing window in pixels, e.g. the bounding rectangle for an element. */
export interface Extent2d {
    readonly width: number;
    readonly height: number;
}

/**
 * Transforms from complex coordinates to positional coordinates.
 * @param c The complex number.
 * @param extent The rendering window c will be transformed with respect to.
 * @returns The corresponding physical coordinates.
 */
export function transformPhysical(c: Complex, extent: Extent2d): Position2d {
    return {
        x: (extent.width / 2) + (c[0] * PIXELS_PER_UNIT),
        y: (extent.height / 2) - (c[1] * PIXELS_PER_UNIT),
    }
}

/**
 * Transforms from positional coordinates to complex coordinates.
 * @param p The positional coordinates.
 * @param extent The rendering window p will be transformed with respect to.
 * @returns The corresponding complex number.
 */
export function transformComplex(p: Position2d, extent: Extent2d): Complex {
    return [
        (p.x - (extent.width / 2)) / PIXELS_PER_UNIT,
        ((extent.height / 2) - p.y) / PIXELS_PER_UNIT,
    ];
}

/**
 * Clamps a positional coordinate so that it lies within an extent.
 * @param p The positional coordinates.
 * @param extent The extent p will be clamped with respect to.
 * @returns 
 */
export function constrainCoord(p: Position2d, extent: Extent2d): Position2d {
    return {
        x: Math.min(extent.width, Math.max(0, p.x)),
        y: Math.min(extent.height, Math.max(0, p.y)),
    }
}
