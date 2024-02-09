import { useState } from "react";
import styled from "styled-components";
import { FlexFiller } from "./FlexFiller";
import { ExpandToggle } from "./ExpandToggle";

interface Props {
  position: [number, number];

  resourceId: string;
  resourceName: string;
  imagePath: string | null;

  amount: number;
  setAmount: (resourceId: string, amount: number) => void;
  cost: number;
  setCost: (resourceId: string, cost: number) => void;
  allowImport: boolean;
  setAllowImport: (resourceId: string, allowImport: boolean) => void;

  imported?: number;
  produced?: number;
  consumed?: number;
  remaining?: number;
}

const Panel = styled.div`
  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 2px solid white;
  border-radius: 5px;

  span {
    font-size: 12px;
  }

  input {
    font-size: 12px;
  }
`;

const ResourceName = styled.div`
  font-size: 20px;
  margin-left: 5px;
  user-select: none;
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
    resourceId,
    resourceName,
    imagePath,
    amount,
    setAmount,
    cost,
    setCost,
    allowImport,
    setAllowImport,
    imported,
    produced,
    consumed,
    remaining,
  } = props;
  const [expanded, setExpanded] = useState(false);

  if (position == null) return null;

  return (
    <Panel style={{ left: position[0], top: position[1] }}>
      <Row>
        {imagePath == null ? null : (
          <img src={imagePath} alt={resourceId} width={32} height={32} />
        )}
        <ResourceName>{resourceName}</ResourceName>
        <FlexFiller />
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
          onChange={(e) => setAllowImport(resourceId, e.target.checked)}
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
        <NumberInput value={imported} readOnly={true} />
      </Row>
      <Row hidden={!expanded || produced == null}>
        <span>Produced</span>
        <FlexFiller />
        <NumberInput value={produced} readOnly={true} />
      </Row>
      <Row hidden={!expanded || consumed == null}>
        <span>Consumed</span>
        <FlexFiller />
        <NumberInput value={consumed} readOnly={true} />
      </Row>
      <Row hidden={!expanded || remaining == null}>
        <span>Remaining</span>
        <FlexFiller />
        <NumberInput value={remaining} readOnly={true} />
      </Row>
    </Panel>
  );
}
