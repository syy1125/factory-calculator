import { Dispatch, SetStateAction, useMemo } from "react";
import styled from "styled-components";
import { ResourceBox } from "../../components/ResourceBox";
import { FactoryData } from "../../factory/factory";
import { getActiveResources } from "../../utils/getActiveResources";
import { ResourceQuantityList } from "./ResourceQuantityList";

interface Props {
  factoryData: FactoryData;
  enableRecipe: { [recipeId: string]: boolean };
  desiredOutput: Array<{ resourceId: string | null; amount: number }>;
  setDesiredOutput: Dispatch<SetStateAction<Props["desiredOutput"]>>;
  solveFactory: () => void;
  clearSolution: () => void;
  importAmounts: { [resourceId: string]: number } | null;
}

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 0.5em;
  border-bottom: 2px solid white;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: center;
`;

const Section = styled.div`
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
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
  margin: 0 0.5em;

  transition: background-color 0.1s ease;
  &:hover {
    background-color: grey;
  }
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ImportResourceDisplay = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export function FactoryOverview(props: Props) {
  const {
    factoryData,
    enableRecipe,
    desiredOutput,
    setDesiredOutput,
    solveFactory,
    clearSolution,
    importAmounts,
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
      <Title>Factory</Title>
      <Content>
        <Section>
          <Subtitle>Production Targets</Subtitle>
          <ResourceQuantityList
            factoryData={factoryData}
            relevantResourceIds={Array.from(relevantResources)}
            resourceAmounts={desiredOutput}
            setResourceAmounts={setDesiredOutput}
          />
          <FlexRow>
            <Button onClick={solveFactory}>Solve Factory</Button>
            <Button onClick={clearSolution}>Reset Solution</Button>
          </FlexRow>
        </Section>
        <Section>
          <Subtitle>Required Imports</Subtitle>
          <ImportResourceDisplay>
            {importAmounts == null ? (
              <p>Solve the factory to see required imports</p>
            ) : (
              Object.keys(importAmounts).map((resourceId) => (
                <ResourceBox
                  key={resourceId}
                  resource={factoryData.resources[resourceId]}
                  amount={importAmounts[resourceId]}
                  size={48}
                />
              ))
            )}
          </ImportResourceDisplay>
        </Section>
      </Content>
    </Panel>
  );
}
