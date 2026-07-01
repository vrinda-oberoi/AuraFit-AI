/**
 * fashionBrainConfig.js
 *
 * Centralized, overridable configuration for the Fashion Brain.
 * Tunable numbers live here instead of being hardcoded inside engine
 * logic, so behavior can be tuned — or overridden per call via an
 * `options` param — without touching scoring/assembly code.
 */

const DEFAULT_CONFIG = {
  // How many top-scoring candidates per role are considered when
  // searching for the best-compatible combination. Higher = more
  // thorough search, but grows combinatorially with required roles
  // (roughly candidateLimit ^ numberOfRequiredRolesWithCandidates).
  candidateLimit: 4,
};

/**
 * Merges caller-supplied overrides on top of the defaults.
 * Never mutates DEFAULT_CONFIG.
 *
 * @param {Object} [overrides]
 * @returns {Object} resolved config
 */
function resolveConfig(overrides = {}) {
  return { ...DEFAULT_CONFIG, ...overrides };
}

export { DEFAULT_CONFIG, resolveConfig };