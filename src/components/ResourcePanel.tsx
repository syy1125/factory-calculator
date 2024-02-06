import React, { useState } from "react";
import styled from "styled-components";
import expandLess from "../icons/expand_less.png";
import expandMore from "../icons/expand_more.png";

interface Props {
  position: [number, number];

  resourceId: string;
  resourceName: string;
  imagePath: string | null;

  amount: number;
  setAmount: (amount: number) => void;
  cost: number;
  setCost: (cost: number) => void;
  allowImport: boolean;
  setAllowImport: (allowImport: boolean) => void;

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

const ExpandButton = styled.button`
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 5px;

  transition: background-color 0.1s ease;

  &:hover {
    background-color: grey;
  }
`;

const FlexFiller = styled.div`
  min-width: 20px;
  flex-grow: 1;
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

  return (
    <Panel style={{ left: position[0], top: position[1] }}>
      <Row>
        {imagePath == null ? null : (
          <img src={imagePath} alt={resourceId} width={32} height={32} />
        )}
        <ResourceName>{resourceName}</ResourceName>
        <FlexFiller />
        <ExpandButton onClick={() => setExpanded((expanded) => !expanded)}>
          <img
            src={expanded ? expandLess : expandMore}
            width={24}
            height={24}
            alt="expand"
          />
        </ExpandButton>
      </Row>
      <Row hidden={!expanded}>
        <span>Current Amount</span>
        <FlexFiller />
        <NumberInput
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </Row>
      <Row hidden={!expanded}>
        <span>Allow Import</span>
        <input
          type="checkbox"
          checked={allowImport}
          onChange={(e) => setAllowImport(e.target.checked)}
        />
        <FlexFiller />
        <span>Cost:</span>
        <NumberInput
          type="number"
          style={{ width: "3em" }}
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
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
