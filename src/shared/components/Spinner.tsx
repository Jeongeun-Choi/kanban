import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface SpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
}

const SpinnerContainer = styled.div<SpinnerProps>`
  width: ${({ size = 24 }) => size}px;
  height: ${({ size = 24 }) => size}px;
  border: ${({ thickness = 2 }) => thickness}px solid rgba(0, 0, 0, 0.1);
  border-top-color: ${({ color = "#3b82f6" }) => color};
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;
  display: inline-block;
`;

export default function Spinner(props: SpinnerProps) {
  return <SpinnerContainer {...props} />;
}
