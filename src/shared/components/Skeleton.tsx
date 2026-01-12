import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  variant?: "text" | "circular" | "rectangular";
}

const SkeletonBase = styled.div<SkeletonProps>`
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "20px"};
  background: #f6f7f8;
  background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
  background-repeat: no-repeat;
  background-size: 800px 100%;
  display: inline-block;
  border-radius: ${({ variant, borderRadius }) => {
    if (borderRadius) return borderRadius;
    if (variant === "circular") return "50%";
    if (variant === "text") return "4px";
    return "0";
  }};
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export default function Skeleton(props: SkeletonProps) {
  return <SkeletonBase {...props} />;
}
