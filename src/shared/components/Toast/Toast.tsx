import styled from "@emotion/styled";
import { useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import type { ToastType } from "../../types/toast";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const ToastItem = styled.div<{ type: ToastType }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 450px;
  animation: slideIn 0.3s ease-out;
  border-left: 5px solid
    ${({ type }) => {
      switch (type) {
        case "success":
          return "#2da44e";
        case "error":
          return "#d73a49";
        case "warning":
          return "#eabb26";
        default:
          return "#3b82f6";
      }
    }};

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const IconWrapper = styled.div<{ type: ToastType }>`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  color: ${({ type }) => {
    switch (type) {
      case "success":
        return "#2da44e";
      case "error":
        return "#d73a49";
      case "warning":
        return "#eabb26";
      default:
        return "#3b82f6";
    }
  }};
`;

const Message = styled.span`
  color: var(--text-main, #24292e);
  font-size: 0.875rem;
  font-weight: 500;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  line-height: 1;
  &:hover {
    color: #333;
  }
`;

const getIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return <FaCheckCircle />;
    case "error":
      return <FaExclamationCircle />;
    case "warning":
      return <FaExclamationTriangle />;
    default:
      return <FaInfoCircle />;
  }
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastItem type={type}>
      <IconWrapper type={type}>{getIcon(type)}</IconWrapper>
      <Message>{message}</Message>
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </ToastItem>
  );
}
