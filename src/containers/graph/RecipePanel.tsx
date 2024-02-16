import React from "react";
import styled from "styled-components";
import { FactoryData } from "../../factory/factory";
import { RecipeDisplay } from "../../components/RecipeDisplay";

interface Props {
  position: [number, number] | null;

  factoryData: FactoryData;
  recipeId: string;

  amount: number | null;
}

const Panel = styled.div`
  position: absolute;
  min-width: 250px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 2px solid white;
  border-radius: 5px;
  padding: 2px;
  background-color: #282c34;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.1em;
  padding-right: 0.1em;
`;

const RecipeName = styled.span`
  font-size: 20px;
  user-select: none;
  text-align: left;
`;

const AmountTag = styled.span`
  position: relative;
  font-size: 16px;
  margin-left: 0.5em;
  padding: 0px 2px;
  border-radius: 3px;
  color: #ffecb3;
  background-color: #ffab0066;
`;

export function RecipePanel(props: Props) {
  const { position, factoryData, recipeId, amount } = props;
  const { name } = factoryData.recipes[recipeId];

  if (position == null) return null;

  return (
    <Panel style={{ left: position[0], top: position[1] }}>
      <TitleRow>
        <RecipeName>{name}</RecipeName>
        {amount != null ? <AmountTag>{amount}</AmountTag> : null}
      </TitleRow>
      <RecipeDisplay factoryData={factoryData} recipeId={recipeId} />
    </Panel>
  );
}
