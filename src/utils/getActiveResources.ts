import { FactoryData } from "../factory/factory";

/**
 * `relevantResources` lists all resources that are involved in the given recipes.
 * `producedResources` lists all resources that can be produced by the given recipes.
 * `importedResources` lists all resources that must be imported - i.e. no recipe can produce them.
 */
export function getActiveResources(
  data: FactoryData,
  enabledRecipes: string[],
  importResources: string[] = []
) {
  const relevantResources = new Set<string>();
  const producedResources = new Set<string>(importResources);
  const importedResources = new Set<string>(importResources);
  for (const recipeId of enabledRecipes) {
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
    importedResources.add(resourceId);
  }

  return { relevantResources, producedResources, importedResources };
}
