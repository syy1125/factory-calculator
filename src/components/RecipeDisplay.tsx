import { useMemo } from "react";
import { styled } from "styled-components";
import { FactoryData } from "../factory/factory";
import arrowRight from "../icons/arrow_right.png";
import { ResourceBox } from "./ResourceBox";

interface Props {
  factoryData: FactoryData;
  recipeId: string;
}

const RecipeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  span {
    font-size: 12px;
  }
`;

const InputResources = styled.div`
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const OutputResources = styled.div`
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export function RecipeDisplay(props: Props) {
  const { factoryData, recipeId } = props;
  const { resourceDelta } = factoryData.recipes[recipeId];

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
    <RecipeContainer>
      <InputResources>
        {inputResources.map((resourceId) => (
          <ResourceBox
            key={resourceId}
            resource={factoryData.resources[resourceId]}
            amount={-resourceDelta[resourceId]}
          />
        ))}
      </InputResources>
      <img src={arrowRight} width={24} height={24} alt="to" />
      <OutputResources>
        {outputResources.map((resourceId) => (
          <ResourceBox
            key={resourceId}
            resource={factoryData.resources[resourceId]}
            amount={resourceDelta[resourceId]}
          />
        ))}
      </OutputResources>
    </RecipeContainer>
  );
}
