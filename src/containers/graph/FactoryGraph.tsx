import { useEffect } from "react";
import { styled } from "styled-components";
import { RecipePanel } from "../../components/RecipePanel.tsx";
import { ResourcePanel } from "../../components/ResourcePanel.tsx";
import type { FactoryData } from "../../factory/factory.ts";
import { useMapState } from "../../utils/hooks.ts";
import { recipeSort } from "../../utils/recipeSort.ts";

interface Props {
  factoryData: FactoryData;

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
`;

export function FactoryGraph(props: Props) {
  const {
    factoryData,
    resourceAmounts,
    setResourceAmount,
    resourceCosts,
    setResourceCost,
    allowImports,
    setAllowImport,
  } = props;

  const [resourcePositions, setResourcePosition, setResourcePositions] =
    useMapState<[number, number]>();

  useEffect(() => {
    const [sortedResources, sortedRecipes] = recipeSort(factoryData);

    const targetResourcePositions: { [resourceId: string]: [number, number] } =
      {};
    for (let i = 0; i < sortedResources.length; i++) {
      for (let j = 0; j < sortedResources[i].length; j++) {
        targetResourcePositions[sortedResources[i][j]] = [
          i * 500 + 100,
          j * 150 + 100,
        ];
      }
    }

    setResourcePositions(targetResourcePositions);
  }, [factoryData, setResourcePositions]);

  return (
    <GraphContainer>
      {Object.keys(factoryData.resources).map((resourceId) => {
        const resource = factoryData.resources[resourceId];

        return (
          <ResourcePanel
            key={resourceId}
            position={resourcePositions[resourceId] ?? [0, 0]}
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
      <RecipePanel
        position={[350, 100]}
        factoryData={factoryData}
        recipeId="coal-coke"
      />
    </GraphContainer>
  );
}
