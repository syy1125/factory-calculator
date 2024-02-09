import { error } from "console";
import {
  FactoryData,
  FactoryState,
  getActiveResources,
} from "../factory/factory";

// Topological sort of recipes and resources. First array is the sorted resources and second array is the sorted recipes.
export function recipeSort(
  data: FactoryData,
  enabledRecipes: string[]
): [string[][], string[][]] {
  // These also track how many incoming connections these unsorted resources/recipes have.
  const unsortedResources: { [resourceId: string]: number } = {};
  const unsortedRecipes: { [recipeId: string]: number } = {};
  const resourceOutEdges: { [resourceId: string]: string[] } = {};

  const { relevantResources } = getActiveResources(data, enabledRecipes, []);

  for (let resourceId of relevantResources) {
    unsortedResources[resourceId] = 0;
  }
  for (let recipeId of enabledRecipes) {
    const { resourceDelta } = data.recipes[recipeId];
    unsortedRecipes[recipeId] = 0;

    for (let resourceId of Object.keys(resourceDelta)) {
      if (resourceDelta[resourceId] < 0) {
        unsortedRecipes[recipeId] += 1;
        resourceOutEdges[resourceId] ??= [];
        resourceOutEdges[resourceId].push(recipeId);
      } else if (resourceDelta[resourceId] > 0) {
        unsortedResources[resourceId] += 1;
      }
    }
  }

  const sortedResources: string[][] = [];
  const sortedRecipes: string[][] = [];

  let nextResources: string[] = [];
  let nextRecipes: string[] = [];

  // Run a pass through resources to kick start the sorting
  for (let resourceId of Object.keys(unsortedResources)) {
    if (unsortedResources[resourceId] === 0) {
      nextResources.push(resourceId);
    }
  }
  for (let resourceId of nextResources) {
    if (resourceOutEdges[resourceId] != null) {
      for (let recipeId of resourceOutEdges[resourceId]) {
        unsortedRecipes[recipeId] -= 1;
        if (unsortedRecipes[recipeId] <= 0) {
          nextRecipes.push(recipeId);
        }
      }
    }

    delete unsortedResources[resourceId];
  }

  sortedResources.push(nextResources);
  nextResources = [];

  while (
    Object.keys(unsortedResources).length > 0 ||
    Object.keys(unsortedRecipes).length > 0
  ) {
    if (Object.keys(unsortedRecipes).length > 0 && nextRecipes.length === 0) {
      throw new Error("Failed to sort recipes");
    }

    for (let recipeId of nextRecipes) {
      const { resourceDelta } = data.recipes[recipeId];

      for (let resourceId of Object.keys(resourceDelta)) {
        if (resourceDelta[resourceId] > 0) {
          unsortedResources[resourceId] -= 1;
          if (unsortedResources[resourceId] <= 0) {
            nextResources.push(resourceId);
          }
        }
      }

      delete unsortedRecipes[recipeId];
    }

    sortedRecipes.push(nextRecipes);
    nextRecipes = [];

    if (
      Object.keys(unsortedResources).length > 0 &&
      nextResources.length === 0
    ) {
      throw new Error("Failed to sort resources");
    }

    for (let resourceId of nextResources) {
      if (resourceOutEdges[resourceId] != null) {
        for (let recipeId of resourceOutEdges[resourceId]) {
          unsortedRecipes[recipeId] -= 1;
          if (unsortedRecipes[recipeId] <= 0) {
            nextRecipes.push(recipeId);
          }
        }
      }

      delete unsortedResources[resourceId];
    }

    sortedResources.push(nextResources);
    nextResources = [];
  }

  return [sortedResources, sortedRecipes];
}
