function main() {
  const solver = require('javascript-lp-solver/src/solver')

  const results = solver.Solve({
    optimize: "cost",
    opType: "min",
    constraints: {
      coal: { min: 0 },
      "coal-coke": { min: 360 },
      sulfur: { min: 0 },
    },
    variables: {
      "import-coal": {
        coal: 1,
        cost: 0.5,
      },
      "import-sulfur": {
        sulfur: 1,
        cost: 2,
      },
      "coke-t1": {
        coal: -200,
        "coal-coke": 180,
      },
      "coke-t2": {
        coal: -200,
        "coal-coke": 165,
        sulfur: 15,
      },
    },
  });

  console.log(results);
}

main();
