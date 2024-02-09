import { FactoryData } from "../factory/factory";

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
