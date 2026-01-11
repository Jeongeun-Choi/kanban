import styled from "@emotion/styled";
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "small" | "medium" | "large";
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

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ children, ...props }, ref) => {
  return (
    <StyledIconButton ref={ref} {...props}>
      {children}
    </StyledIconButton>
  );
});

IconButton.displayName = "IconButton";

export default IconButton;
