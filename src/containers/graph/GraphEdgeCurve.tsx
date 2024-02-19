import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

interface Props {
  begin: [number, number];
  end: [number, number];
  lineWidth?: number;
  value?: string;
}

const Canvas = styled.canvas`
  position: absolute;
  pointer-events: none;
`;

const TextContainer = styled.div`
  position: absolute;
  pointer-events: none;
  font-size: 16px;
  color: #fff8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > span {
    background-color: #0008;
    border-radius: 5px;
    padding: 2px;
    pointer-events: all;
  }
`;

export function GraphEdgeCurve(props: Props) {
  const {
    begin: [beginX, beginY],
    end: [endX, endY],
    lineWidth = 2,
    value,
  } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const minX = Math.min(beginX, endX);
  const minY = Math.min(beginY, endY);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx == null) return;

    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

    ctx.moveTo(beginX - minX, beginY - minY + lineWidth / 2);
    const midX = Math.abs(endX - beginX) / 2;
    ctx.bezierCurveTo(
      midX,
      beginY - minY + lineWidth / 2,
      midX,
      endY - minY + lineWidth / 2,
      endX - minX,
      endY - minY + lineWidth / 2
    );
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#fff8";
    ctx.stroke();
  }, [beginX, beginY, endX, endY, minX, minY, lineWidth]);

  return (
    <>
      <Canvas
        ref={canvasRef}
        style={{ left: minX, top: minY - lineWidth / 2 }}
        width={Math.abs(endX - beginX)}
        height={Math.abs(endY - beginY) + lineWidth}
      />
      {value != null ? (
        <TextContainer
          style={{
            left: minX,
            top: minY,
            width: Math.abs(endX - beginX),
            height: Math.abs(endY - beginY),
          }}
        >
          <span>{value}</span>
        </TextContainer>
      ) : null}
    </>
  );
}
