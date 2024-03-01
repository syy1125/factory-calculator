import { useMemo, useState } from "react";
import styled from "styled-components";
import { FlexFiller } from "../../components/FlexFiller";
import { ExpandToggle } from "../../components/ExpandToggle";
import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  position: [number, number] | null;
  setPosition: (resourceId: string, position: [number, number]) => void;
  linkElementRef: (resourceId: string, element: HTMLElement | null) => void;

  resourceId: string;
  resourceName: string;
  imagePath: string | null;

  amount: number;
  setAmount: (resourceId: string, amount: number) => void;
  cost: number;
  setCost: (resourceId: string, cost: number) => void;
  allowImport: boolean;
  setAllowImport?: (resourceId: string, allowImport: boolean) => void;
  changed: boolean;

  imported?: number;
  produced?: number;
  consumed?: number;
  remaining?: number;
}

const Panel = styled.div<{ $expanded: boolean; $resourceId: string }>`
  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 2px solid white;
  border-radius: 5px;
  background-color: #282c34;
  font-size: 12px;

  z-index: ${(props) => (props.$expanded ? 1 : 0)};

  &:hover ~ .resource-${(props) => props.$resourceId} {
    opacity: 1;
    color: gold;
  }
`;

const ResourceName = styled.div`
  font-size: 20px;
  margin-left: 5px;
  user-select: none;
`;

const OverrideTag = styled.span`
  border-radius: 2px;
  border: 1px solid grey;
  padding: 0px 2px;
  margin-left: 0.5em;
`;

const AmountTag = styled.span<{ $delta: number }>`
  position: relative;
  font-size: 16px;
  margin-left: 0.5em;
  margin-right: 0.2em;
  padding: 0px 2px;
  border-radius: 3px;
  color: ${(props) =>
    props.$delta > 0 ? "#dcedc8" : props.$delta < 0 ? "#ffccbc" : "#ffecb3"};
  background-color: ${(props) =>
    props.$delta > 0
      ? "#64dd1766"
      : props.$delta < 0
      ? "#dd2c0066"
      : "#ffab0066"};
`;

const Row = styled.div<{ hidden?: boolean }>`
  display: ${(props) => (props.hidden ? "none" : "flex")};
  min-width: 200px;
  padding: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: start;

  ${Panel} > &:not(:first-child) {
    border-width: 1px 0px 0px;
    border-style: solid;
    border-color: white;
  }
`;

const NumberInput = styled.input`
  border-radius: 2px;
  width: 5em;

  &:read-only {
    background-color: #aaa;
    outline-width: 0;
  }
`;

export function ResourcePanel(props: Props) {
  const {
    position,
    setPosition,
    linkElementRef,
    resourceId,
    resourceName,
    imagePath,

    amount,
    setAmount,
    cost,
    setCost,
    allowImport,
    setAllowImport,
    changed,

    imported,
    produced,
    consumed,
    remaining,
  } = props;
  const [expanded, setExpanded] = useState(false);

  const delta = useMemo(() => {
    if (produced == null && consumed == null) return null;
    return (produced ?? 0) - (consumed ?? 0);
  }, [produced, consumed]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `resource-${resourceId}`,
  });

  useDndMonitor({
    onDragEnd: (e) => {
      if (e.active.id === `resource-${resourceId}`) {
        setPosition(resourceId, [
          (position?.[0] ?? 0) + e.delta.x,
          (position?.[1] ?? 0) + e.delta.y,
        ]);
      }
    },
  });

  if (position == null) return null;

  return (
    <Panel
      ref={setNodeRef}
      style={{
        left: position[0],
        top: position[1],
        transform: CSS.Translate.toString(transform),
      }}
      $resourceId={resourceId}
      $expanded={expanded}
    >
      <Row ref={(element) => linkElementRef(resourceId, element)}>
        {imagePath == null ? null : (
          <img
            src={imagePath}
            alt={resourceId}
            width={32}
            height={32}
            {...attributes}
            {...listeners}
          />
        )}
        <ResourceName {...attributes} {...listeners}>
          {resourceName}
        </ResourceName>
        {changed ? <OverrideTag>CHG</OverrideTag> : null}
        <FlexFiller />
        {delta != null ? (
          <AmountTag $delta={delta}>
            {delta > 0 ? "+" : ""}
            {delta}
          </AmountTag>
        ) : null}
        <ExpandToggle expanded={expanded} setExpanded={setExpanded} />
      </Row>
      <Row hidden={!expanded}>
        <span>Current Amount</span>
        <FlexFiller />
        <NumberInput
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(resourceId, Number(e.target.value))}
        />
      </Row>
      <Row hidden={!expanded}>
        <span>Allow Import</span>
        <input
          type="checkbox"
          checked={allowImport}
          disabled={setAllowImport == null}
          onChange={(e) => setAllowImport?.(resourceId, e.target.checked)}
        />
        <FlexFiller />
        <span>Cost:</span>
        <NumberInput
          type="number"
          style={{ width: "3em" }}
          value={cost}
          onChange={(e) => setCost(resourceId, Number(e.target.value))}
          min={0}
          step={0.01}
          readOnly={!allowImport}
        />
      </Row>
      <Row hidden={!expanded || imported == null}>
        <span>Imported</span>
        <FlexFiller />
        <NumberInput value={imported ?? 0} readOnly={true} />
      </Row>
      <Row hidden={!expanded || produced == null}>
        <span>Produced</span>
        <FlexFiller />
        <NumberInput value={produced ?? 0} readOnly={true} />
      </Row>
      <Row hidden={!expanded || consumed == null}>
        <span>Consumed</span>
        <FlexFiller />
        <NumberInput value={consumed ?? 0} readOnly={true} />
      </Row>
      <Row hidden={!expanded || remaining == null}>
        <span>Remaining</span>
        <FlexFiller />
        <NumberInput value={remaining ?? 0} readOnly={true} />
      </Row>
    </Panel>
  );
}
