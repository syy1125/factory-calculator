import React from "react";
import styled from "styled-components";
import { FactoryData } from "../factory/factory";
import { RecipeDisplay } from "./RecipeDisplay";

interface Props {
  position: [number, number];

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
`;

const TitleRow = styled.div`
  font-size: 20px;
`;

const RecipeName = styled.div`
  margin-left: 5px;
  user-select: none;
  text-align: left;
`;

export function RecipePanel(props: Props) {
  const { position, factoryData, recipeId } = props;
  const { name } = factoryData.recipes[recipeId];

  return (
    <Panel style={{ left: position[0], top: position[1] }}>
      <TitleRow>
        <RecipeName>{name}</RecipeName>
      </TitleRow>
      <RecipeDisplay factoryData={factoryData} recipeId={recipeId} />
    </Panel>
  );
}
