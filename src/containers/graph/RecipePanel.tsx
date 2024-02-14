import React from "react";
import styled from "styled-components";
import { FactoryData } from "../../factory/factory";
import { RecipeDisplay } from "../../components/RecipeDisplay";

interface Props {
  position: [number, number]|null;

  factoryData: FactoryData;
  recipeId: string;
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
  background-color: #282c34;
`;

const TitleRow = styled.div`
  font-size: 20px;
`;

const RecipeName = styled.div`
  margin-left: 0.2em;
  margin-right: 0.2em;
  user-select: none;
  text-align: left;
`;

export function RecipePanel(props: Props) {
  const { position, factoryData, recipeId } = props;
  const { name } = factoryData.recipes[recipeId];

  if (position == null) return null;

  return (
    <Panel style={{ left: position[0], top: position[1] }}>
      <TitleRow>
        <RecipeName>{name}</RecipeName>
      </TitleRow>
      <RecipeDisplay factoryData={factoryData} recipeId={recipeId} />
    </Panel>
  );
}
