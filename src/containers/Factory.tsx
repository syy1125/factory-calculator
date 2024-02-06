import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FactoryGraph } from "./FactoryGraph";
import { FactoryData } from "../factory/factory";
import { FactoryOutputSelection } from "./FactoryOutputSelection";
import { FactoryRecipes } from "./FactoryRecipes";

const OuterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-grow: 3;
  flex-direction: column;
`;

const RightContainer = styled.div`
  display: flex;
  flex-grow: 1;
`;

export function Factory() {
  const [factoryData, setFactoryData] = useState<FactoryData | null>(null);
  const [resourceAmounts, setResourceAmount] = useState<{
    [resourceId: string]: number;
  }>({});
  const [resourceCosts, setResourceCost] = useState<{
    [resourceId: string]: number;
  }>({});
  const [allowImports, setAllowImport] = useState<{
    [resourceId: string]: boolean;
  }>({});

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
        setResourceCost(initialResourceCost);
      });
  }, [setFactoryData]);

  return (
    <OuterContainer>
      <LeftContainer>
        <FactoryGraph
          factoryData={factoryData}
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
        <FactoryRecipes />
      </RightContainer>
    </OuterContainer>
  );
}
