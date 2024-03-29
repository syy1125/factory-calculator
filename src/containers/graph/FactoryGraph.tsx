import { DndContext } from "@dnd-kit/core";
import { useMemo, useRef } from "react";
import { styled } from "styled-components";
import { type FactoryData } from "../../factory/factory.ts";
import { getActiveResources } from "../../utils/getActiveResources.ts";
import { useMapState } from "../../utils/hooks.ts";
import { recipeSort } from "../../utils/recipeSort.ts";
import { GraphEdgeCurve } from "./GraphEdgeCurve.tsx";
import { RecipePanel } from "./RecipePanel.tsx";
import { ResourcePanel } from "./ResourcePanel.tsx";
import simpleFrame from "./SimpleFrame.png";

interface Props {
  factoryData: FactoryData;

  enableRecipes: { [recipeId: string]: boolean };

  resourceAmounts: { [resourceId: string]: number };
  setResourceAmount: (resourceId: string, amount: number) => void;
  resourceCosts: { [resourceId: string]: number };
  setResourceCost: (resourceId: string, cost: number) => void;
  allowImports: { [resourceId: string]: boolean };
  setAllowImport: (resourceId: string, allowImport: boolean) => void;

  importAmounts: { [resourceId: string]: number } | null;
  recipeAmounts: { [recipeId: string]: number } | null;
}

const GraphContainer = styled.div`
  position: relative;
  flex-grow: 1;
  padding: 0px;
  overflow: auto;

  background-image: url(${simpleFrame});
  background-attachment: local;
  background-size: 20px;
`;

export function FactoryGraph(props: Props) {
  const {
    factoryData,
    enableRecipes,
    resourceAmounts,
    setResourceAmount,
    resourceCosts,
    setResourceCost,
    allowImports,
    setAllowImport,

    importAmounts,
    recipeAmounts,
  } = props;

  const enabledRecipes = useMemo(
    () =>
      Object.keys(enableRecipes).filter((recipeId) => enableRecipes[recipeId]),
    [enableRecipes]
  );

  const { relevantResources, importedResources } = useMemo(
    () => getActiveResources(factoryData, enabledRecipes),
    [factoryData, enabledRecipes]
  );

  const [resourcePositions, setResourcePosition] =
    useMapState<[number, number]>();
  const [recipePositions, setRecipePosition] = useMapState<[number, number]>();

  const [defaultResourcePositions, defaultRecipePositions] = useMemo(() => {
    const [sortedResources, sortedRecipes] = recipeSort(
      factoryData,
      enabledRecipes
    );

    const resourcePositions: { [resourceId: string]: [number, number] } = {};
    for (let i = 0; i < sortedResources.length; i++) {
      for (let j = 0; j < sortedResources[i].length; j++) {
        resourcePositions[sortedResources[i][j]] = [i * 800 + 20, j * 150 + 20];
      }
    }
    const recipePositions: { [recipeId: string]: [number, number] } = {};
    for (let i = 0; i < sortedRecipes.length; i++) {
      for (let j = 0; j < sortedRecipes[i].length; j++) {
        recipePositions[sortedRecipes[i][j]] = [i * 800 + 400, j * 150 + 20];
      }
    }

    return [resourcePositions, recipePositions];
  }, [factoryData, enabledRecipes]);

  const containerRef = useRef<HTMLElement | null>(null);
  const resourcePanelRefs = useRef<{
    [resourceId: string]: HTMLElement | null;
  }>({});
  const recipePanelRefs = useRef<{ [recipeId: string]: HTMLElement | null }>(
    {}
  );

  const [producedAmounts, consumedAmounts, remainingAmounts] = useMemo(() => {
    if (recipeAmounts == null || importAmounts == null)
      return [null, null, null];

    const produced: { [resourceId: string]: number } = {};
    const consumed: { [resourceId: string]: number } = {};
    const remaining: { [resourceId: string]: number } = { ...resourceAmounts };

    for (let resourceId of Object.keys(importAmounts)) {
      remaining[resourceId] =
        (remaining[resourceId] ?? 0) + importAmounts[resourceId];
    }

    for (let recipeId of Object.keys(recipeAmounts)) {
      const { resourceDelta } = factoryData.recipes[recipeId];
      for (let resourceId of Object.keys(resourceDelta)) {
        const delta = resourceDelta[resourceId] * recipeAmounts[recipeId];
        remaining[resourceId] = (remaining[resourceId] ?? 0) + delta;

        if (delta > 0) {
          produced[resourceId] = (produced[resourceId] ?? 0) + delta;
        } else if (delta < 0) {
          consumed[resourceId] = (consumed[resourceId] ?? 0) - delta;
        }
      }
    }

    return [produced, consumed, remaining];
  }, [factoryData, recipeAmounts, resourceAmounts, importAmounts]);

  const edgeCurves = useMemo(() => {
    const edges: Array<{
      id: string;
      classes: string[];
      begin: [number, number];
      end: [number, number];
      value: string | null;
    }> = [];

    const container = containerRef.current;
    if (container == null) return [];
    const containerRect = container.getBoundingClientRect();
    const leftCorrection = -containerRect.left + container.scrollLeft;
    const topCorrection = -containerRect.top + container.scrollTop;

    for (let recipeId of enabledRecipes) {
      const { resourceDelta } = factoryData.recipes[recipeId];
      const recipePanel = recipePanelRefs.current[recipeId];
      const recipeAmount = recipeAmounts?.[recipeId];
      if (recipePanel == null) continue;
      const recipePanelRect = recipePanel.getBoundingClientRect();

      for (let resourceId of Object.keys(resourceDelta)) {
        const resourcePanel = resourcePanelRefs.current[resourceId];
        if (resourcePanel == null) continue;
        const resourcePanelRect = resourcePanel.getBoundingClientRect();

        const classes = [`resource-${resourceId}`, `recipe-${recipeId}`];

        if (resourceDelta[resourceId] < 0) {
          edges.push({
            id: `${recipeId}-${resourceId}`,
            classes,
            begin: [
              resourcePanelRect.left + leftCorrection + resourcePanelRect.width,
              resourcePanelRect.top +
                topCorrection +
                resourcePanelRect.height / 2,
            ],
            end: [
              recipePanelRect.left + leftCorrection,
              recipePanelRect.top + topCorrection + recipePanelRect.height / 2,
            ],
            value:
              recipeAmount == null
                ? null
                : (-(
                    recipeAmount * resourceDelta[resourceId]
                  )).toLocaleString(),
          });
        } else if (resourceDelta[resourceId] > 0) {
          edges.push({
            id: `${recipeId}-${resourceId}`,
            classes,
            begin: [
              recipePanelRect.left + leftCorrection + recipePanelRect.width,
              recipePanelRect.top + topCorrection + recipePanelRect.height / 2,
            ],
            end: [
              resourcePanelRect.left + leftCorrection,
              resourcePanelRect.top +
                topCorrection +
                resourcePanelRect.height / 2,
            ],
            value:
              recipeAmount == null
                ? null
                : (recipeAmount * resourceDelta[resourceId]).toLocaleString(),
          });
        }
      }
    }

    return edges;
    // resourcePositons and recipePositions are indeed needed in the dependency array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    factoryData,
    enabledRecipes,
    recipeAmounts,
    resourcePanelRefs,
    recipePanelRefs,
    resourcePositions,
    recipePositions,
  ]);

  return (
    <DndContext>
      <GraphContainer ref={(element) => (containerRef.current = element)}>
        {Array.from(relevantResources).map((resourceId) => {
          const resource = factoryData.resources[resourceId];

          return (
            <ResourcePanel
              key={resourceId}
              position={
                resourcePositions[resourceId] ??
                defaultResourcePositions[resourceId]
              }
              setPosition={setResourcePosition}
              linkElementRef={(resourceId, element) =>
                (resourcePanelRefs.current[resourceId] = element)
              }
              resourceId={resourceId}
              resourceName={resource.shortName ?? resource.name}
              imagePath={
                resource.icon == null
                  ? null
                  : process.env.PUBLIC_URL + resource.icon
              }
              amount={resourceAmounts[resourceId] ?? 0}
              setAmount={setResourceAmount}
              cost={resourceCosts[resourceId] ?? resource.value}
              setCost={setResourceCost}
              changed={
                (resourceAmounts[resourceId] != null &&
                  resourceAmounts[resourceId] !== 0) ||
                (resourceCosts[resourceId] != null &&
                  resourceCosts[resourceId] !== resource.value) ||
                (!importedResources.has(resourceId) && allowImports[resourceId])
              }
              allowImport={
                importedResources.has(resourceId) || allowImports[resourceId]
              }
              setAllowImport={
                importedResources.has(resourceId) ? undefined : setAllowImport
              }
              imported={importAmounts?.[resourceId]}
              produced={producedAmounts?.[resourceId]}
              consumed={consumedAmounts?.[resourceId]}
              remaining={remainingAmounts?.[resourceId]}
            />
          );
        })}
        {enabledRecipes.map((recipeId) => {
          return (
            <RecipePanel
              key={recipeId}
              position={
                recipePositions[recipeId] ?? defaultRecipePositions[recipeId]
              }
              setPosition={setRecipePosition}
              linkElementRef={(recipeId, element) =>
                (recipePanelRefs.current[recipeId] = element)
              }
              factoryData={factoryData}
              recipeId={recipeId}
              amount={recipeAmounts?.[recipeId] ?? null}
            />
          );
        })}
        {edgeCurves.map((curve) => (
          <GraphEdgeCurve
            key={curve.id}
            classes={curve.classes}
            begin={curve.begin}
            end={curve.end}
            value={curve.value ?? undefined}
          />
        ))}
      </GraphContainer>
    </DndContext>
  );
}
