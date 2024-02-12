import { useEffect, useMemo } from "react";
import { styled } from "styled-components";
import { RecipePanel } from "../../components/RecipePanel.tsx";
import { ResourcePanel } from "../../components/ResourcePanel.tsx";
import { type FactoryData } from "../../factory/factory.ts";
import { getActiveResources } from "../../utils/getActiveResources.ts";
import { useMapState } from "../../utils/hooks.ts";
import { recipeSort } from "../../utils/recipeSort.ts";
import simpleFrame from './SimpleFrame.png'

interface Props {
  factoryData: FactoryData;

  enableRecipes: { [recipeId: string]: boolean };

  resourceAmounts: { [resourceId: string]: number };
  setResourceAmount: (resourceId: string, amount: number) => void;
  resourceCosts: { [resourceId: string]: number };
  setResourceCost: (resourceId: string, cost: number) => void;
  allowImports: { [resourceId: string]: boolean };
  setAllowImport: (resourceId: string, allowImport: boolean) => void;
}

const GraphContainer = styled.div`
  position: relative;
  flex-grow: 1;
  padding: 0px;
  overflow: auto;

  background-image: url(${simpleFrame});
  background-attachment: local;
  background-size: 20px;
`;

export function FactoryGraph(props: Props) {
  const {
    factoryData,
    enableRecipes,
    resourceAmounts,
    setResourceAmount,
    resourceCosts,
    setResourceCost,
    allowImports,
    setAllowImport,
  } = props;

  const enabledRecipes = useMemo(
    () =>
      Object.keys(enableRecipes).filter((recipeId) => enableRecipes[recipeId]),
    [enableRecipes]
  );

  const { relevantResources } = useMemo(
    () => getActiveResources(factoryData, enabledRecipes),
    [factoryData, enabledRecipes]
  );

  const [resourcePositions, setResourcePosition, setResourcePositions] =
    useMapState<[number, number]>();
  const [recipePositions, setRecipePosition, setRecipePositions] =
    useMapState<[number, number]>();

  useEffect(() => {
    const [sortedResources, sortedRecipes] = recipeSort(
      factoryData,
      enabledRecipes
    );

    const targetResourcePositions: { [resourceId: string]: [number, number] } =
      {};
    for (let i = 0; i < sortedResources.length; i++) {
      for (let j = 0; j < sortedResources[i].length; j++) {
        targetResourcePositions[sortedResources[i][j]] = [
          i * 600 + 100,
          j * 150 + 100,
        ];
      }
    }
    const targetRecipePositions: { [recipeId: string]: [number, number] } = {};
    for (let i = 0; i < sortedRecipes.length; i++) {
      for (let j = 0; j < sortedRecipes[i].length; j++) {
        targetRecipePositions[sortedRecipes[i][j]] = [
          i * 600 + 350,
          j * 150 + 100,
        ];
      }
    }

    setResourcePositions(targetResourcePositions);
    setRecipePositions(targetRecipePositions);
  }, [factoryData, enabledRecipes, setResourcePositions, setRecipePositions]);

  return (
    <GraphContainer>
      {Array.from(relevantResources).map((resourceId) => {
        const resource = factoryData.resources[resourceId];

        return (
          <ResourcePanel
            key={resourceId}
            position={resourcePositions[resourceId]}
            resourceId={resourceId}
            resourceName={resource.shortName ?? resource.name}
            imagePath={
              resource.icon == null
                ? null
                : process.env.PUBLIC_URL + resource.icon
            }
            amount={resourceAmounts[resourceId] ?? 0}
            setAmount={setResourceAmount}
            cost={resourceCosts[resourceId] ?? 0}
            setCost={setResourceCost}
            allowImport={allowImports[resourceId] ?? true}
            setAllowImport={setAllowImport}
          />
        );
      })}
      {enabledRecipes.map((recipeId) => {
        return (
          <RecipePanel
            key={recipeId}
            position={recipePositions[recipeId]}
            factoryData={factoryData}
            recipeId={recipeId}
          />
        );
      })}
    </GraphContainer>
  );
}
