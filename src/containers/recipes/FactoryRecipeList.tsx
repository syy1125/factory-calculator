import React, { useCallback, useEffect, useMemo } from "react";
import { FactoryData } from "../../factory/factory";
import styled from "styled-components";
import { TriStateCheckbox } from "../../components/TriStateCheckbox";
import { FlexFiller } from "../../components/FlexFiller";
import { ExpandToggle } from "../../components/ExpandToggle";
import { useMapState } from "../../utils/hooks";
import { RecipeDisplay } from "../../components/RecipeDisplay";

interface Props {
  factoryData: FactoryData;
  recipeCosts: { [recipeId: string]: number };
  setRecipeCost: (recipeId: string, cost: number) => void;
  enableRecipes: { [recipeId: string]: boolean };
  setEnableRecipe: (recipeId: string, enable: boolean) => void;
}

const Title = styled.div`
  position: relative;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  font-size: ${(props) => props.theme.fontSize.title}px;
`;

const AbsoluteButton = styled.button`
  position: absolute;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 2px;
  padding: 2px;

  background-color: transparent;
  transition: background-color 0.1s ease;
  &:hover {
    background-color: grey;
  }
`;

const ListContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const RecipeGroupRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;

  background-color: #0008;
  padding: 2px;
  margin-top: 0.5em;
  &:first-child {
    margin-top: 0;
  }
`;

const RecipeRow = styled.div<{ $hidden: boolean; $enabled: boolean }>`
  display: ${(props) => (props.$hidden ? "none" : "flex")};
  flex-direction: column;

  opacity: ${(props) => (props.$enabled ? 1 : 0.6)};
`;

const RecipeTitle = styled.div`
  font-size: 16px;
  text-align: left;
  margin-left: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export function FactoryRecipeList(props: Props) {
  const {
    factoryData,
    recipeCosts,
    setRecipeCost,
    enableRecipes,
    setEnableRecipe,
  } = props;

  const [expandGroups, setExpandGroup, setExpandGroups] =
    useMapState<boolean>();
  useEffect(
    () =>
      setExpandGroups(
        factoryData.recipeGroups.reduce(
          (expandGroups, { id }) => ({ ...expandGroups, [id]: true }),
          {}
        )
      ),
    [factoryData, setExpandGroups]
  );

  const setExpandAll = useCallback(
    (expand: boolean) =>
      setExpandGroups((expandGroups) =>
        Object.keys(expandGroups).reduce(
          (expandGroups, groupId) => ({ ...expandGroups, [groupId]: expand }),
          {}
        )
      ),
    [setExpandGroups]
  );

  const recipeByGroup = useMemo(
    () =>
      Object.keys(factoryData.recipes)
        .sort()
        .reduce((recipeByGroup, recipeId) => {
          const recipeGroupId = factoryData.recipes[recipeId].group;
          recipeByGroup[recipeGroupId] ??= [];
          recipeByGroup[recipeGroupId].push(recipeId);
          return recipeByGroup;
        }, {} as { [recipeGroupId: string]: string[] }),
    [factoryData]
  );

  const recipeGroupChecked = useMemo(
    () =>
      factoryData.recipeGroups.reduce((recipeGroupChecked, { id }) => {
        if (recipeByGroup[id] == null) {
          return {
            ...recipeGroupChecked,
            [id]: null,
          };
        }
        if (recipeByGroup[id].every((recipeId) => enableRecipes[recipeId])) {
          return {
            ...recipeGroupChecked,
            [id]: true,
          };
        } else if (
          recipeByGroup[id].every((recipeId) => !enableRecipes[recipeId])
        ) {
          return {
            ...recipeGroupChecked,
            [id]: false,
          };
        } else {
          return {
            ...recipeGroupChecked,
            [id]: null,
          };
        }
      }, {} as { [recipeGroupId: string]: boolean | null }),
    [enableRecipes, recipeByGroup, factoryData]
  );

  const setEnableRecipeGroup = useCallback(
    (recipeGroupId: string, enable: boolean) => {
      for (let recipeId of recipeByGroup[recipeGroupId]) {
        setEnableRecipe(recipeId, enable);
      }
    },
    [recipeByGroup, setEnableRecipe]
  );

  return (
    <>
      <Title>
        <span>Recipes</span>
        <AbsoluteButton
          style={{ right: 0, top: 0 }}
          onClick={() => setExpandAll(true)}
        >
          Expand All
        </AbsoluteButton>
        <AbsoluteButton
          style={{ right: 0, top: 20 }}
          onClick={() => setExpandAll(false)}
        >
          Collapse All
        </AbsoluteButton>
      </Title>
      <ListContainer>
        {factoryData.recipeGroups.map(({ id, name }) => {
          // If there are no recipes in the group, ignore the group.
          if (recipeByGroup[id] == null) return null;

          return (
            <React.Fragment key={id}>
              <RecipeGroupRow>
                <TriStateCheckbox
                  checked={recipeGroupChecked[id]}
                  onChange={(enable) => setEnableRecipeGroup(id, enable)}
                />
                <span>{name}</span>
                <FlexFiller />
                <ExpandToggle
                  expanded={expandGroups[id]}
                  setExpanded={(expanded) =>
                    typeof expanded === "function"
                      ? setExpandGroups((expandGroups) => ({
                          ...expandGroups,
                          [id]: expanded(expandGroups[id]),
                        }))
                      : setExpandGroup(id, expanded)
                  }
                />
              </RecipeGroupRow>
              {recipeByGroup[id].sort().map((recipeId) => {
                const recipe = factoryData.recipes[recipeId];

                return (
                  <RecipeRow
                    key={recipeId}
                    $hidden={!expandGroups[id]}
                    $enabled={enableRecipes[recipeId]}
                  >
                    <RecipeTitle>
                      <input
                        type="checkbox"
                        checked={enableRecipes[recipeId]}
                        onChange={(e) =>
                          setEnableRecipe(recipeId, e.target.checked)
                        }
                      />
                      <span>{recipe.name}</span>
                    </RecipeTitle>
                    <RecipeDisplay
                      factoryData={factoryData}
                      recipeId={recipeId}
                    />
                  </RecipeRow>
                );
              })}
            </React.Fragment>
          );
        })}
      </ListContainer>
    </>
  );
}
