import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FactoryData, FactoryState, solveFactory } from "../factory/factory";
import { getActiveResources } from "../utils/getActiveResources";
import { useMapState } from "../utils/hooks";
import { FactoryGraph } from "./graph/FactoryGraph";
import { FactoryOverview } from "./overview/FactoryOverview";
import { FactoryRecipeList } from "./recipes/FactoryRecipeList";

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
  const [desiredOutput, setDesiredOutput] = useState<
    Array<{ resourceId: string | null; amount: number }>
  >([]);

  const [importAmounts, , setImportAmounts] = useMapState<number>();
  const [recipeAmounts, , setRecipeAmounts] = useMapState<number>();

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

  const doSolveFactory = useCallback(() => {
    if (factoryData == null) {
      console.error("Cannot solve factory before it is ready");
      return;
    }

    const { importedResources } = getActiveResources(
      factoryData,
      Object.keys(enableRecipe).filter((recipeId) => enableRecipe[recipeId])
    );

    const state: FactoryState = {
      recipeCosts: Object.keys(enableRecipe)
        .filter((recipeId) => enableRecipe[recipeId])
        .reduce(
          (costs, recipeId) => ({
            ...costs,
            [recipeId]: recipeCosts[recipeId] ?? 0,
          }),
          {}
        ),
      importResources: [
        ...Array.from(importedResources),
        ...Object.keys(allowImports).filter(
          (resourceId) => allowImports[resourceId]
        ),
      ].reduce(
        (importResources, resourceId) => ({
          ...importResources,
          [resourceId]: resourceCosts[resourceId],
        }),
        {}
      ),
      inventory: resourceAmounts,
      desiredOutput: desiredOutput.reduce(
        (output, { resourceId, amount }) =>
          resourceId == null || amount <= 0
            ? output
            : { ...output, [resourceId]: amount },
        {}
      ),
    };

    const result = solveFactory(factoryData, state);

    const importAmounts: { [resourceId: string]: number } = {};
    const recipeAmounts: { [recipeId: string]: number } = {};
    for (let recipeId of Object.keys(result)) {
      if (recipeId.startsWith("import:")) {
        importAmounts[recipeId.substring(7)] = result[recipeId];
      } else if (recipeId in factoryData.recipes) {
        recipeAmounts[recipeId] = result[recipeId];
      }
    }
    setImportAmounts(importAmounts);
    setRecipeAmounts(recipeAmounts);
  }, [
    factoryData,
    enableRecipe,
    allowImports,
    desiredOutput,
    recipeCosts,
    resourceAmounts,
    resourceCosts,
    setImportAmounts,
    setRecipeAmounts,
  ]);

  if (factoryData == null) {
    return <div>Loading...</div>;
  }

  return (
    <OuterContainer>
      <LeftContainer>
        <FactoryOverview
          factoryData={factoryData}
          enableRecipe={enableRecipe}
          desiredOutput={desiredOutput}
          setDesiredOutput={setDesiredOutput}
          solveFactory={doSolveFactory}
          clearSolution={() => {}}
        />
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
