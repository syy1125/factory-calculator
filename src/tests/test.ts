import * as fs from "fs";
import * as path from "path";
import { solveFactory } from "../factory/factory";
import { recipeSort } from "../utils/recipeSort";

function main() {
  // const solver = require("javascript-lp-solver/src/solver");

  // const results = solver.Solve({
  //   optimize: "cost",
  //   opType: "min",
  //   constraints: {
  //     coal: { min: 0 },
  //     "coal-coke": { min: 360 },
  //     sulfur: { min: 0 },
  //   },
  //   variables: {
  //     "import-coal": {
  //       coal: 1,
  //       cost: 0.5,
  //     },
  //     "import-sulfur": {
  //       sulfur: 1,
  //       cost: 2,
  //     },
  //     "coke-t1": {
  //       coal: -200,
  //       "coal-coke": 180,
  //     },
  //     "coke-t2": {
  //       coal: -200,
  //       "coal-coke": 165,
  //       sulfur: 15,
  //     },
  //   },
  // });

  // console.log(results);

  const dataPath = path.resolve(
    __dirname,
    "../../public/foxhole/FoxholeFactory.json"
  );
  const data = JSON.parse(fs.readFileSync(dataPath).toString());

  // const soln = solveFactory(data, {
  //   recipeCosts: {
  //     "coal-coke": 0,
  //     "coke-furnace": 0,
  //     "advanced-coal-liquefier": 0,
  //     "construction-materials": 0,
  //     "assembly-materials-1": 0,
  //     "assembly-materials-2": 0,
  //     "construction-materials-smelter": 0,
  //     "processed-construction-materials": 0,
  //     "assembly-materials-3": 0,
  //     "assembly-materials-4": 0,
  //     "processed-construction-materials-blast-furnace": 0,
  //     "steel-construction-materials": 0,
  //     "steel-construction-materials-enriched": 0,
  //     "assembly-materials-5": 0,
  //   },
  //   importResources: {
  //     "heavy-oil": 2,
  //   },
  //   inventory: {},
  //   desiredOutput: {
  //     "steel-construction-materials": 150,
  //     "assembly-materials-3": 65,
  //     "assembly-materials-4": 40,
  //     "assembly-materials-5": 85,
  //   },
  // });

  // console.log(soln);

  const [sortedResources, sortedRecipes] = recipeSort(data, Object.keys(data.recipes));

  console.log(sortedResources)
  console.log(sortedRecipes)
}

main();
