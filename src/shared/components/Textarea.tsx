import styled from "@emotion/styled";
import { type TextareaHTMLAttributes, type Ref } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

const StyledTextarea = styled.textarea<TextareaProps>`
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #e1e4e8);
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--text-main, #24292e);
  background-color: var(--bg-card, #ffffff);
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
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

export default function Textarea({ ref, ...props }: TextareaProps) {
  return <StyledTextarea ref={ref} {...props} />;
}
