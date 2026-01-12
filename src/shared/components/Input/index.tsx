import styled from "@emotion/styled";
import { type InputHTMLAttributes, type Ref } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

const Wrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
`;

const StyledInput = styled.input<Pick<InputProps, "fullWidth" | "error">>`
  padding: 0.5rem 0.75rem;
  border: 1px solid
    ${({ error }) => (error ? "var(--error-color, #d73a49)" : "var(--border-color, #e1e4e8)")};
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--text-main, #24292e);
  background-color: var(--bg-card, #ffffff);
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ error }) =>
      error ? "var(--error-color, #d73a49)" : "var(--color-point, #2da44e)"};
    box-shadow: 0 0 0 3px
      ${({ error }) => (error ? "rgba(215, 58, 73, 0.1)" : "rgba(45, 164, 78, 0.1)")};
  }

  &::placeholder {
    color: var(--text-sub, #9ca3af);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--bg-column, #f6f8fa);
  }
`;

const ErrorMessage = styled.span`
  color: var(--error-color, #d73a49);
  font-size: 0.75rem;
  margin-left: 0.25rem;
`;

export default function Input({ ref, error, fullWidth, ...props }: InputProps) {
  return (
    <Wrapper fullWidth={fullWidth}>
      <StyledInput ref={ref} error={error} fullWidth={fullWidth} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Wrapper>
  );
}
