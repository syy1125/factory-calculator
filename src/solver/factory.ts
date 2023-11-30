import { solveLinearOptimization } from "./linearOptimization";

interface Resource {
  id: string;
}

interface Recipe {
  id: string;
  inputs: {
    [resourceId: string]: number;
  };
  outputs: {
    [resourceId: string]: number;
  };
  cost: number; // The cost of running this recipe. Note that this is in addition to whatever the resource may cost if imported.
}

// A generic factory solver. Solving a factory by formulating it as a linear programming problem.
export function solveFactory(
  resources: Resource[],
  recipes: Recipe[],
  inputs: { [resourceId: string]: number }, // What we already have
  outputs: { [resourceId: string]: number } // What need to be produced
): { [recipeId: string]: number } {
  console.assert(resources.length > 0);
  console.assert(recipes.length > 0);

  // Set up the environment
  const resourceById = lookupById(resources);
  const recipeById = lookupById(recipes);
  const [recipesByInput, recipesByOutput] = recipesByResources(recipes);

  // All resource must be producable in at least one recipe.
  // Note that importing resource can be considered a type of recipe with the cost coming from the resource.
  for (const resource of resources) {
    if (!(resource.id in recipesByOutput)) {
      throw new Error(
        `Resource ${resource.id} cannot be produced with the given recipes. If it is imported, consider adding an "import recipe" that simply produces the resource.`
      );
    }
  }

  // Linear programming problem formulation.
  // The number of times each recipe is run provides the coordinates x_i in the LP problem. Obviously x_i >= 0 as constraints.
  // The cost function is simply the cost of all recipes combined. To formulate this as standard form of linear optimization, the objective function is negative cost.
  // Each resource forms a constraint. At the end of the production line, all resource amounts must be >= 0. To formulate this as standard form of linear optimization, resources consumed are positive and resources produced are negative. The constraint bounds are then positive for resources owned and negative for resources requested.

  // Since the origin is most likely not a feasible solution, we transform the problem using the Big M method.
  // https://en.wikipedia.org/wiki/Big_M_method

  const objective = recipes.map((recipe) => -recipe.cost);

  const constraintMatrix = resources.map((resource) =>
    recipes.map(
      (recipe) =>
        (recipe.inputs[resource.id] ?? 0) - (recipe.outputs[resource.id] ?? 0)
    )
  );

  const constraint = new Array(resources.length).fill(0);
  for (const resourceId in inputs) {
    constraint[resourceById[resourceId]] += inputs[resourceId];
  }
  for (const resourceId in outputs) {
    constraint[resourceById[resourceId]] -= outputs[resourceId];
  }


  const solution = solveLinearOptimization(
    objective,
    constraintMatrix,
    constraint,
    console.log
  );

  return solution.reduce(
    (result, amount, index) => ({
      ...result,
      [recipes[index].id]: amount,
    }),
    {}
  );
}

interface Lookup<T> {
  [id: string]: T;
}

function lookupById(input: Array<{ id: string }>): Lookup<number> {
  const lookup: Lookup<number> = {};
  for (let i = 0; i < input.length; i++) {
    lookup[input[i].id] = i;
  }
  return lookup;
}

function recipesByResources(
  recipes: Recipe[]
): [Lookup<string[]>, Lookup<string[]>] {
  const inputLookup: Lookup<string[]> = {};
  const outputLookup: Lookup<string[]> = {};

  for (const recipe of recipes) {
    for (const input in recipe.inputs) {
      if (input in inputLookup) {
        inputLookup[input].push(recipe.id);
      } else {
        inputLookup[input] = [recipe.id];
      }
    }
    for (const output in recipe.outputs) {
      if (output in outputLookup) {
        outputLookup[output].push(recipe.id);
      } else {
        outputLookup[output] = [recipe.id];
      }
    }
  }

  return [inputLookup, outputLookup];
}
