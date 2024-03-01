import { styled } from "styled-components";
import { ResourceData } from "../factory/factory";

interface Props {
  resource: ResourceData | null;
  amount: number;
  size?: number;
}

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
  font-size: 12px;
`;

const ResourceNameTooltip = styled.span`
  position: absolute;
  padding: 2px;
  opacity: 0;
  z-index: 100;
  background-color: #000c;
  user-select: none;
  pointer-events: none;
  transition: opacity 0.1s linear;

  ${ResourceContainer}:hover > & {
    opacity: 1;
  }
`;

export function ResourceBox(props: Props) {
  const { resource, amount, size = 32 } = props;
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
        width={size}
        height={size}
        alt={resource.name}
      />
      <AmountTag>{amount.toLocaleString()}</AmountTag>
      <ResourceNameTooltip>{resource.name}</ResourceNameTooltip>
    </ResourceContainer>
  );
}
