import { Dispatch, SetStateAction } from "react";
import { styled } from "styled-components";
import expandLess from "../icons/expand_less.png";
import expandMore from "../icons/expand_more.png";

interface Props {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}

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

export function ExpandToggle(props: Props) {
  const { expanded, setExpanded } = props;

  return (
    <ExpandButton onClick={() => setExpanded((expanded) => !expanded)}>
      <img
        src={expanded ? expandLess : expandMore}
        width={24}
        height={24}
        alt="expand"
      />
    </ExpandButton>
  );
}
