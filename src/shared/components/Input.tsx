import styled from "@emotion/styled";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

const StyledInput = styled.input<InputProps>`
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #e1e4e8);
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--text-main, #24292e);
  background-color: var(--bg-card, #ffffff);
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-point, #2da44e);
    box-shadow: 0 0 0 3px rgba(45, 164, 78, 0.1);
  }

  &::placeholder {
    color: var(--text-sub, #9ca3af);
  }
`;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <StyledInput ref={ref} {...props} />;
});

Input.displayName = "Input";

export default Input;
