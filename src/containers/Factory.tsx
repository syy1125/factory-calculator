import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FactoryGraph } from "./graph/FactoryGraph";
import { FactoryData } from "../factory/factory";
import { FactoryOutputSelection } from "./output/FactoryOutputSelection";
import { FactoryRecipeList } from "./recipes/FactoryRecipeList";
import { useMapState } from "../utils/hooks";

const OuterContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const LeftContainer = styled.div`
  flex-grow: 4;
  display: flex;
  flex-direction: column;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 2px solid white;
  overflow-y: auto;
`;

export function Factory() {
  const [factoryData, setFactoryData] = useState<FactoryData | null>(null);
  const [resourceAmounts, setResourceAmount] = useMapState<number>();
  const [resourceCosts, setResourceCost, setResourceCosts] =
    useMapState<number>();
  const [allowImports, setAllowImport] = useMapState<boolean>();
  const [recipeCosts, setRecipeCost] = useMapState<number>();
  const [enableRecipe, setEnableRecipe, setEnableRecipes] =
    useMapState<boolean>();

  useEffect(() => {
    const dataPath = process.env.PUBLIC_URL + "/foxhole/FoxholeFactory.json";
    fetch(dataPath)
      .then((data) => data.json())
      .then((data: FactoryData) => {
        setFactoryData(data);

        const initialResourceCost: { [resourceId: string]: number } = {};
        for (let resourceId of Object.keys(data.resources)) {
          initialResourceCost[resourceId] = data.resources[resourceId].value;
        }
        setResourceCosts(initialResourceCost);

        setEnableRecipes(
          Object.keys(data.recipes).reduce(
            (enableRecipe, recipeId) => ({
              ...enableRecipe,
              [recipeId]: true,
            }),
            {}
          )
        );
      });
  }, [setFactoryData, setEnableRecipes, setResourceCosts]);

  if (factoryData == null) {
    return <div>Loading...</div>;
  }

  return (
    <OuterContainer>
      <LeftContainer>
        <FactoryGraph
          factoryData={factoryData}
          enableRecipes={enableRecipe}
          resourceAmounts={resourceAmounts}
          setResourceAmount={setResourceAmount}
          resourceCosts={resourceCosts}
          setResourceCost={setResourceCost}
          allowImports={allowImports}
          setAllowImport={setAllowImport}
        />
        <FactoryOutputSelection />
      </LeftContainer>
      <RightContainer>
        <FactoryRecipeList
          factoryData={factoryData}
          recipeCosts={recipeCosts}
          setRecipeCost={setRecipeCost}
          enableRecipes={enableRecipe}
          setEnableRecipe={setEnableRecipe}
        />
      </RightContainer>
    </OuterContainer>
  );
}
