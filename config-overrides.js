module.exports = function override(config, env) {
  return {
    ...config,
    externals: { "javascript-lp-solver/src/solver": "solver" },
  };
};
