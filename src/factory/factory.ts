export interface FactoryData {
  readonly name: string;
  readonly resources: {
    readonly [resource: string]: {
      readonly name: string;
      readonly shortName?: string;
      readonly icon?: string;
      readonly value: number;
    };
  };
  readonly recipeGroups: Array<{
    readonly id: string;
    readonly name: string;
  }>;
  readonly recipes: {
    readonly [recipe: string]: {
      readonly name: string;
      readonly group: string;
      readonly timeSeconds: number;
      readonly power: number;
      readonly resourceDelta: {
        readonly [resource: string]: number;
      };
    };
  };
}

// Represents a user-set state on what the factory has, what recipes it can handle, and what it needs to produce.
export interface FactoryState {
  recipeCosts: { [recipeId: string]: number }; // Override the cost for each recipe. Recipes not listed are considered disabled.
  importResources: { [resourceId: string]: number }; // Override the cost for importing resources. If a resource is not produced in any recipe, it's always imported.
  inventory: { [resourceId: string]: number };
  desiredOutput: { [resourceId: string]: number };
}

const solver = require("javascript-lp-solver/src/solver");

export function solveFactory(
  data: FactoryData,
  state: FactoryState
): { [recipeId: string]: number } {
  const enabledRecipes = Object.keys(state.recipeCosts);

  const relevantResources = new Set<string>();
  const producedResources = new Set<string>(Object.keys(state.importResources));
  const importResources = new Set<string>(Object.keys(state.importResources));
  for (const recipeId of enabledRecipes) {
    if (state.recipeCosts[recipeId] == null) continue;
    const resourceDelta = data.recipes[recipeId].resourceDelta;
    for (const resourceId of Object.keys(resourceDelta)) {
      relevantResources.add(resourceId);
      if (resourceDelta[resourceId] > 0) {
        producedResources.add(resourceId);
      }
    }
  }
  for (const resourceId of relevantResources) {
    if (producedResources.has(resourceId)) continue;
    importResources.add(resourceId);
  }

  const constraints: { [resourceId: string]: { min: number } } = {};
  for (const resourceId of relevantResources) {
    constraints[resourceId] = { min: 0 };
  }
  for (const resourceId of Object.keys(state.inventory)) {
    constraints[resourceId] = { min: -state.inventory[resourceId] };
  }
  for (const resourceId of Object.keys(state.desiredOutput)) {
    constraints[resourceId] = { min: state.desiredOutput[resourceId] };
  }

  const recipes: { [recipeId: string]: { [variableId: string]: number } } = {};
  for (const resourceId of importResources) {
    recipes[`import:${resourceId}`] = {
      [resourceId]: 1,
      cost:
        state.importResources[resourceId] ?? data.resources[resourceId].value,
    };
  }
  for (const recipeId of enabledRecipes) {
    recipes[recipeId] = data.recipes[recipeId].resourceDelta;
    recipes[recipeId].cost = state.recipeCosts[recipeId];
  }

  const { feasible, result, bounded, ...recipeCounts } = solver.Solve({
    optimize: "cost",
    opType: "min",
    constraints,
    variables: recipes,
    ints: Object.keys(recipes).reduce(
      (ints, recipeId) => ({ ...ints, [recipeId]: 1 }),
      {}
    ),
  });

  return recipeCounts;
}
