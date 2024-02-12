import React, { useMemo, useState } from "react";
import { FactoryData } from "../../factory/factory";
import { getActiveResources } from "../../utils/getActiveResources";
import { ResourceSelect } from "../../components/ResourceSelect";

interface Props {
  factoryData: FactoryData;
  enableRecipe: { [recipeId: string]: boolean };
}

export function FactoryOutputSelection(props: Props) {
  const { factoryData, enableRecipe } = props;

  const { relevantResources } = useMemo(
    () =>
      getActiveResources(
        factoryData,
        Object.keys(enableRecipe).filter((recipeId) => enableRecipe[recipeId])
      ),
    [factoryData, enableRecipe]
  );

  const [resourceId, setResourceId] = useState<string | null>(null);

  return (
    <div>
      <ResourceSelect
        resources={Array.from(relevantResources).reduce(
          (resources, resourceId) => ({
            ...resources,
            [resourceId]: factoryData.resources[resourceId],
          }),
          {}
        )}
        resourceId={resourceId}
        onChange={(resourceId) => setResourceId(resourceId)}
      />
    </div>
  );
}
