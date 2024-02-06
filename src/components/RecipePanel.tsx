import React, { useMemo } from "react";
import styled from "styled-components";
import { FactoryData } from "../factory/factory";
import arrowRight from "../icons/arrow_right.png";

interface Props {
  position: [number, number];

  factoryData: FactoryData;
  recipeId: string;
  recipeName: string;
}

const Panel = styled.div`
  position: absolute;
  min-width: 200px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 2px solid white;
  border-radius: 5px;
  padding: 2px;
`;

const TitleRow = styled.div`
  font-size: 20px;
`;

const RecipeName = styled.div`
  margin-left: 5px;
  user-select: none;
  text-align: left;
`;

const RecipeRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  span {
    font-size: 12px;
  }
`;

const InputResources = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const OutputResources = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export function RecipePanel(props: Props) {
  const { position, factoryData, recipeId, recipeName } = props;

  const [inputResources, outputResources] = useMemo(() => {
    const { resourceDelta } = factoryData.recipes[recipeId];
    return [
      Object.keys(resourceDelta).filter(
        (resourceId) => resourceDelta[resourceId] < 0
      ),
      Object.keys(resourceDelta).filter(
        (resourceId) => resourceDelta[resourceId] > 0
      ),
    ];
  }, [factoryData, recipeId]);

  return (
    <Panel style={{ left: position[0], top: position[1] }}>
      <TitleRow>
        <RecipeName>{recipeName}</RecipeName>
      </TitleRow>
      <RecipeRow>
        <InputResources>
          {inputResources.map((resourceId) => {
            const resource = factoryData.resources[resourceId];
            if (resource == null) return null;
            if (resource.icon == null) {
              return <span key={resourceId}>{resource.shortName}</span>;
            }

            return (
              <img
                key={resourceId}
                src={process.env.PUBLIC_URL + resource.icon}
                width={32}
                height={32}
                alt={resource.name}
              />
            );
          })}
        </InputResources>
        <img src={arrowRight} width={24} height={24} alt="to" />
        <OutputResources>
          {outputResources.map((resourceId) => {
            const resource = factoryData.resources[resourceId];
            if (resource == null) return null;
            if (resource.icon == null) {
              return <span key={resourceId}>{resource.shortName}</span>;
            }

            return (
              <img
                key={resourceId}
                src={process.env.PUBLIC_URL + resource.icon}
                width={32}
                height={32}
                alt={resource.name}
              />
            );
          })}
        </OutputResources>
      </RecipeRow>
    </Panel>
  );
}
