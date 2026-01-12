import styled from "@emotion/styled";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import type { ToastType } from "../../types/toast";
import BaseToast from "./BaseToast";

interface ToastProps {
  message: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  onClose: () => void;
}

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
  line-height: 1.4;
`;

const ActionButton = styled.button`
  background-color: var(--bg-column, #f6f8fa);
  border: 1px solid var(--border-color, #e1e4e8);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-main, #24292e);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background-color: var(--border-color, #e1e4e8);
  }

  &:active {
    background-color: #d1d5da;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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

export default function Toast({ message, type, action, duration = 3000, onClose }: ToastProps) {
  const handleActionClick = () => {
    action?.onClick();
    onClose();
  };

  return (
    <BaseToast type={type} duration={duration} onClose={onClose}>
      <IconWrapper type={type}>{getIcon(type)}</IconWrapper>
      <Message>{message}</Message>
      {action && <ActionButton onClick={handleActionClick}>{action.label}</ActionButton>}
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </BaseToast>
  );
}
