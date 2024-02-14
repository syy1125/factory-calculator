import { styled } from "styled-components";
import deleteIcon from "../icons/delete.png";
import { useCallback, useRef, useState } from "react";

interface Props {
  holdTime?: number;
  onDelete: () => void;
}

const IconButton = styled.button`
  position: relative;
  border: none;
  background-color: transparent;
  width: 40px;
  height: 40px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: background-color 0.1s ease;
  &:hover {
    background-color: #f657;
  }
`;

const HoldProgress = styled.div<{ $active: boolean; $time: number }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 50%;

  @property --progress {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 0%;
  }
  --progress: ${(props) => (props.$active ? 100 : 0)}%;

  background: conic-gradient(
    #f55d 0%,
    #f55d var(--progress),
    transparent var(--progress),
    transparent 100%
  );
  transition-property: --progress;
  transition-timing-function: linear;
  transition-duration: ${(props) => (props.$active ? props.$time : 0)}ms;
`;

export function DeleteButton(props: Props) {
  const { holdTime = 1000, onDelete } = props;

  const holdTimeRef = useRef<NodeJS.Timeout>();
  const [mouseDown, setMouseDown] = useState(false);

  const startDelete = useCallback(() => {
    holdTimeRef.current = setTimeout(() => {
      onDelete();
    }, holdTime);
    setMouseDown(true);
  }, [holdTimeRef, holdTime, setMouseDown, onDelete]);

  const cancelDelete = useCallback(() => {
    if (holdTimeRef.current != null) {
      clearTimeout(holdTimeRef.current);
      holdTimeRef.current = undefined;
    }
    setMouseDown(false);
  }, [holdTimeRef, setMouseDown]);

  return (
    <IconButton
      onMouseDown={startDelete}
      onMouseUp={cancelDelete}
      onMouseLeave={cancelDelete}
    >
      <HoldProgress $active={mouseDown} $time={holdTime} />
      <img src={deleteIcon} width={24} height={24} alt="delete" />
    </IconButton>
  );
}
