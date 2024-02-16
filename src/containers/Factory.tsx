import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FactoryData, FactoryState, solveFactory } from "../factory/factory";
import { getActiveResources } from "../utils/getActiveResources";
import { useLocalStorageMapState, useMapState } from "../utils/hooks";
import { FactoryGraph } from "./graph/FactoryGraph";
import { FactoryOverview } from "./overview/FactoryOverview";
import { FactoryRecipeList } from "./recipes/FactoryRecipeList";
import { useLocalStorage } from "usehooks-ts";

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
  const [resourceAmounts, setResourceAmount] = useLocalStorageMapState<number>(
    "current-resource-amounts"
  );
  const [resourceCosts, setResourceCost, setResourceCosts] =
    useLocalStorageMapState<number>("resource-costs");
  const [allowImports, setAllowImport] =
    useLocalStorageMapState<boolean>("allow-imports");
  const [recipeCosts, setRecipeCost] =
    useLocalStorageMapState<number>("recipe-costs");

  const [enableRecipe, setEnableRecipe, setEnableRecipes] =
    useLocalStorageMapState<boolean>("enable-recipe");

  const [desiredOutput, setDesiredOutput] = useLocalStorage<
    Array<{ resourceId: string | null; amount: number }>
  >("desired-output", [], {
    serializer: JSON.stringify,
    deserializer: JSON.parse,
  });

  useEffect(() => {
    if (factoryData == null) return;

    const { producedResources } = getActiveResources(
      factoryData,
      Object.keys(enableRecipe).filter((recipeId) => enableRecipe[recipeId])
    );

    setDesiredOutput((desiredOutput) =>
      desiredOutput.map(({ resourceId, ...output }) => {
        return {
          resourceId:
            resourceId != null && producedResources.has(resourceId)
              ? resourceId
              : null,
          ...output,
        };
      })
    );
  }, [factoryData, enableRecipe, setDesiredOutput]);

  const [importAmounts, setImportAmounts] = useState<{
    [resourceId: string]: number;
  } | null>(null);
  const [recipeAmounts, setRecipeAmounts] = useState<{
    [recipeId: string]: number;
  } | null>(null);

  useEffect(() => {
    const dataPath = process.env.PUBLIC_URL + "/foxhole/FoxholeFactory.json";
    fetch(dataPath)
      .then((data) => data.json())
      .then((data: FactoryData) => {
        setFactoryData(data);
        setEnableRecipes((enableRecipe) => {
          return Object.keys(data.recipes).reduce((enabled, recipeId) => {
            return {
              [recipeId]: true,
              ...enabled,
            };
          }, enableRecipe);
        });
      });
  }, [setFactoryData, setEnableRecipes]);

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
          [resourceId]:
            resourceCosts[resourceId] ??
            factoryData.resources[resourceId].value,
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

    console.log("Solving factory for state", state);

    const result = solveFactory(factoryData, state);

    console.log("Factory solution", result);

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

  const clearSolution = useCallback(() => {
    setImportAmounts(null);
    setRecipeAmounts(null);
  }, [setImportAmounts, setRecipeAmounts]);

  useEffect(clearSolution, [
    clearSolution,
    resourceAmounts,
    resourceCosts,
    allowImports,
    recipeCosts,
    enableRecipe,
    desiredOutput,
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
          importAmounts={importAmounts}
          recipeAmounts={recipeAmounts}
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
