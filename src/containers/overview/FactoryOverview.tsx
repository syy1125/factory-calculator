import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ResourceQuantityList } from "./ResourceQuantityList";
import { FactoryData } from "../../factory/factory";
import { getActiveResources } from "../../utils/getActiveResources";
import styled from "styled-components";

interface Props {
  factoryData: FactoryData;
  enableRecipe: { [recipeId: string]: boolean };
  desiredOutput: Array<{ resourceId: string | null; amount: number }>;
  setDesiredOutput: Dispatch<SetStateAction<Props["desiredOutput"]>>;
  solveFactory: () => void;
  clearSolution: () => void;
}

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0.5em;
`;

const Title = styled.div`
  font-size: ${(props) => props.theme.fontSize.title}px;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
`;

const Subtitle = styled.div`
  font-size: ${(props) => props.theme.fontSize.subtitle}px;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  color: white;
  font-size: 16px;
  align-self: center;
  border-radius: 5px;
  padding: 2px 5px;

  transition: background-color 0.1s ease;
  &:hover {
    background-color: grey;
  }
`;

export function FactoryOverview(props: Props) {
  const {
    factoryData,
    enableRecipe,
    desiredOutput,
    setDesiredOutput,
    solveFactory,
  } = props;

  const { relevantResources } = useMemo(
    () =>
      getActiveResources(
        factoryData,
        Object.keys(enableRecipe).filter((recipeId) => enableRecipe[recipeId])
      ),
    [factoryData, enableRecipe]
  );

  return (
    <Panel>
      <Title>
        <span>Factory</span>
      </Title>
      <Subtitle>
        <span>Desired Output</span>
      </Subtitle>
      <ResourceQuantityList
        factoryData={factoryData}
        relevantResourceIds={Array.from(relevantResources)}
        resourceAmounts={desiredOutput}
        setResourceAmounts={setDesiredOutput}
      />
      <Button onClick={solveFactory}>Solve Factory</Button>
    </Panel>
  );
}
