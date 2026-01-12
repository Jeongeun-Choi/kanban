import styled from "@emotion/styled";
import { type ButtonHTMLAttributes, type Ref } from "react";
import Spinner from "../Loading/Spinner";

export { default as IconButton } from "./IconButton";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "outlined" | "text";
  fullWidth?: boolean;
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "fit-content")};
  gap: 0.5rem;
  min-height: 34px;

  ${({ variant = "contained" }) => {
    switch (variant) {
      case "contained":
        return `
          background-color: var(--color-point, #2DA44E);
          color: white;
          border: 1px solid var(--color-point, #2DA44E);
          &:hover {
            opacity: 0.9;
          }
        `;
      case "outlined":
        return `
          background-color: white;
          color: var(--text-main, #24292E);
          border: 1px solid var(--border-color, #E1E4E8);
        `;
      case "text":
        return `
          background-color: white;
          color: var(--text-sub, #586069);
          border: none;
          &:hover {
            background-color: rgba(0, 0, 0, 0.04);
            color: var(--text-main, #24292E);
          }
        `;
      default:
        return "";
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function Button({ children, loading, disabled, ref, ...props }: ButtonProps) {
  return (
    <StyledButton ref={ref} disabled={disabled || loading} {...props}>
      {loading && <Spinner size={14} color="currentColor" thickness={2} />}
      {children}
    </StyledButton>
  );
}
