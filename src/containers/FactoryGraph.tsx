import { Dispatch, SetStateAction, useEffect } from "react";
import { styled } from "styled-components";
import { ResourcePanel } from "../components/ResourcePanel";
import type { FactoryData } from "../factory/factory.ts";
import { useMapState } from "../utils/hooks.ts";
import { recipeSort } from "../utils/recipeSort.ts";
import { RecipePanel } from "../components/RecipePanel.tsx";

interface Props {
  factoryData: FactoryData | null;

  resourceAmounts: { [resourceId: string]: number };
  setResourceAmount: Dispatch<SetStateAction<Props["resourceAmounts"]>>;
  resourceCosts: { [resourceId: string]: number };
  setResourceCost: Dispatch<SetStateAction<Props["resourceCosts"]>>;
  allowImports: { [resourceId: string]: boolean };
  setAllowImport: Dispatch<SetStateAction<Props["allowImports"]>>;
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
    if (factoryData == null) return;

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

  if (factoryData == null) {
    return <div>Loading...</div>;
  }

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
            setAmount={(amount: number) =>
              setResourceAmount((resourceAmounts) => ({
                ...resourceAmounts,
                [resourceId]: amount,
              }))
            }
            cost={resourceCosts[resourceId] ?? 0}
            setCost={(cost: number) =>
              setResourceCost((resourceCosts) => ({
                ...resourceCosts,
                [resourceId]: cost,
              }))
            }
            allowImport={allowImports[resourceId] ?? true}
            setAllowImport={(allowImport: boolean) =>
              setAllowImport((allowResourceImports) => ({
                ...allowResourceImports,
                [resourceId]: allowImport,
              }))
            }
          />
        );
      })}
      <RecipePanel
        position={[350, 100]}
        factoryData={factoryData}
        recipeId="coal-coke"
        recipeName="Coal Coke"
      />
    </GraphContainer>
  );
}
