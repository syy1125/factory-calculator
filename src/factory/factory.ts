import { getActiveResources } from "../utils/getActiveResources";

export interface ResourceData {
  readonly name: string;
  readonly shortName?: string;
  readonly icon?: string;
  readonly value: number;
}

export interface RecipeData {
  readonly name: string;
  readonly group: string;
  readonly timeSeconds: number;
  readonly power: number;
  readonly resourceDelta: {
    readonly [resource: string]: number;
  };
}

export interface FactoryData {
  readonly name: string;
  readonly resources: {
    readonly [resource: string]: ResourceData;
  };
  readonly recipeGroups: Array<{
    readonly id: string;
    readonly name: string;
  }>;
  readonly recipes: {
    readonly [recipe: string]: RecipeData;
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

function getNonNullKeys(obj: { [key: string]: unknown }): string[] {
  return Object.keys(obj).filter((key) => obj[key] != null);
}

export function solveFactory(
  data: FactoryData,
  state: FactoryState
): { [recipeId: string]: number } {
  const enabledRecipes = getNonNullKeys(state.recipeCosts);
  const importResources = getNonNullKeys(state.importResources);

  const { relevantResources, importedResources } = getActiveResources(
    data,
    enabledRecipes,
    importResources
  );

  const constraints: { [resourceId: string]: { min: number } } = {};
  for (const resourceId of relevantResources) {
    constraints[resourceId] = { min: 0 };
  }
  for (const resourceId of Object.keys(state.inventory)) {
    constraints[resourceId] =
      constraints[resourceId] != null
        ? { min: constraints[resourceId].min - state.inventory[resourceId] }
        : { min: -state.inventory[resourceId] };
  }
  for (const resourceId of Object.keys(state.desiredOutput)) {
    constraints[resourceId] =
      constraints[resourceId] != null
        ? { min: constraints[resourceId].min + state.desiredOutput[resourceId] }
        : { min: state.desiredOutput[resourceId] };
  }

  const recipes: { [recipeId: string]: { [variableId: string]: number } } = {};
  for (const resourceId of importedResources) {
    recipes[`import:${resourceId}`] = {
      [resourceId]: 1,
      cost:
        state.importResources[resourceId] ?? data.resources[resourceId].value,
    };
  }
  for (const recipeId of enabledRecipes) {
    recipes[recipeId] = {
      ...data.recipes[recipeId].resourceDelta,
      cost: state.recipeCosts[recipeId] ?? 0,
    };
  }

  const { feasible, result, bounded, isIntegral, ...recipeCounts } =
    solver.Solve({
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
