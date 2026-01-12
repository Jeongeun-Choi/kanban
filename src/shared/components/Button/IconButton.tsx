import styled from "@emotion/styled";
import { type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";
import Spinner from "../Loading/Spinner";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "small" | "medium" | "large";
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

const StyledIconButton = styled.button<IconButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: transparent;
  color: var(--text-sub, #586069);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  padding: ${({ size = "medium" }) => {
    switch (size) {
      case "small":
        return "4px";
      case "large":
        return "12px";
      default: // medium
        return "8px";
    }
  }};

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-main, #24292e);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function IconButton({
  children,
  loading,
  disabled,
  size,
  ref,
  ...props
}: IconButtonProps) {
  const spinnerSize = size === "small" ? 12 : size === "large" ? 20 : 16;

  return (
    <StyledIconButton ref={ref} disabled={disabled || loading} size={size} {...props}>
      {loading ? (
        <Spinner size={spinnerSize} color="currentColor" thickness={size === "small" ? 1.5 : 2} />
      ) : (
        children
      )}
    </StyledIconButton>
  );
}
