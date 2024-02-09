import { useMemo } from "react";
import { styled } from "styled-components";
import { FactoryData, ResourceData } from "../factory/factory";
import arrowRight from "../icons/arrow_right.png";

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

const ResourceContainer = styled.div`
  position: relative;
  min-height: 36px;
  display: flex;
  flex-direction: row;
`;

const ResourceNameTag = styled.span`
  user-select: none;
  align-self: start;
  padding: 2px;
`;

const AmountTag = styled.span`
  user-select: none;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 1px 2px;
  background-color: #0008;
`;

const ResourceNameTooltip = styled.span`
  position: absolute;
  padding: 2px;
  opacity: 0;
  z-index: 1;
  background-color: #000C;
  user-select: none;
  transition: opacity 0.1s linear;

  ${ResourceContainer}:hover > & {
    opacity: 1;
  }
`;

function RecipeResourceBox(props: {
  resource: ResourceData | null;
  amount: number;
}) {
  const { resource, amount } = props;
  if (resource == null) return null;
  if (resource.icon == null) {
    return (
      <ResourceContainer>
        <ResourceNameTag>{resource.shortName ?? resource.name}</ResourceNameTag>
        <AmountTag>{amount}</AmountTag>
      </ResourceContainer>
    );
  }

  return (
    <ResourceContainer>
      <img
        src={process.env.PUBLIC_URL + resource.icon}
        width={32}
        height={32}
        alt={resource.name}
      />
      <AmountTag>{amount}</AmountTag>
      <ResourceNameTooltip>{resource.name}</ResourceNameTooltip>
    </ResourceContainer>
  );
}

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
          <RecipeResourceBox
            key={resourceId}
            resource={factoryData.resources[resourceId]}
            amount={-resourceDelta[resourceId]}
          />
        ))}
      </InputResources>
      <img src={arrowRight} width={24} height={24} alt="to" />
      <OutputResources>
        {outputResources.map((resourceId) => (
          <RecipeResourceBox
            key={resourceId}
            resource={factoryData.resources[resourceId]}
            amount={resourceDelta[resourceId]}
          />
        ))}
      </OutputResources>
    </RecipeContainer>
  );
}
