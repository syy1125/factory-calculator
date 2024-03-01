import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import { RecipeDisplay } from "../../components/RecipeDisplay";
import { FactoryData } from "../../factory/factory";

interface Props {
  position: [number, number] | null;
  setPosition: (recipeId: string, position: [number, number]) => void;

  linkElementRef: (recipeId: string, element: HTMLElement | null) => void;

  factoryData: FactoryData;
  recipeId: string;

  amount: number | null;
}

const Panel = styled.div<{ $recipeId: string }>`
  position: absolute;
  min-width: 250px;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 2px solid white;
  border-radius: 5px;
  background-color: #282c34;

  &:hover ~.recipe-${(props) => props.$recipeId} {
    opacity: 1;
    color: gold;
    z-index: 20;
  }

  &:after { // Ensures a bit of padding for scrolling
    position: absolute;
    content: '';
    bottom: -20px;
    right: -20px;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.2em;
  padding-right: 0.2em;
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
  const {
    position,
    setPosition,
    linkElementRef,
    factoryData,
    recipeId,
    amount,
  } = props;
  const { name } = factoryData.recipes[recipeId];

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `recipe-${recipeId}`,
  });

  useDndMonitor({
    onDragEnd: (e) => {
      if (e.active.id === `recipe-${recipeId}`) {
        setPosition(recipeId, [
          (position?.[0] ?? 0) + e.delta.x,
          (position?.[1] ?? 0) + e.delta.y,
        ]);
      }
    },
  });

  if (position == null) return null;

  return (
    <Panel
      style={{
        left: position[0],
        top: position[1],
        transform: CSS.Transform.toString(transform),
      }}
      ref={setNodeRef}
      $recipeId={recipeId}
    >
      <TitleRow
        {...attributes}
        {...listeners}
        ref={(element) => linkElementRef(recipeId, element)}
      >
        <RecipeName>{name}</RecipeName>
        {amount != null ? <AmountTag>{amount.toLocaleString()}</AmountTag> : null}
      </TitleRow>
      <RecipeDisplay factoryData={factoryData} recipeId={recipeId} />
    </Panel>
  );
}
