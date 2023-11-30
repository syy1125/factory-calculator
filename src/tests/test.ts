import { solveFactory } from "../solver/factory";
import { solveLinearOptimization } from "../solver/linearOptimization";

function main() {

  // const solution = solveFactory(
  //   [{ id: "coal" }, { id: "coal-coke" }, { id: "sulfur" }],
  //   [
  //     {
  //       id: "import-coal",
  //       inputs: {},
  //       outputs: { coal: 1 },
  //       cost: 0.5,
  //     },
  //     {
  //       id: "import-sulfur",
  //       inputs: {},
  //       outputs: { sulfur: 1 },
  //       cost: 2,
  //     },
  //     {
  //       id: "coke-t1",
  //       inputs: { coal: 200 },
  //       outputs: { "coal-coke": 180 },
  //       cost: 0,
  //     },
  //     {
  //       id: "coke-t2",
  //       inputs: { coal: 200 },
  //       outputs: { "coal-coke": 165, sulfur: 15 },
  //       cost: 0,
  //     },
  //   ],
  //   {},
  //   { "coal-coke": 360 }
  // );

  // console.log(solution);
}

main();
