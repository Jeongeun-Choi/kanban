import styled from "@emotion/styled";
import { useEffect, type ReactNode } from "react";
import type { ToastType } from "../../types/toast";

export interface BaseToastProps {
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const ToastItem = styled.div<{ type: ToastType }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-width: 500px;
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

export default function BaseToast({
  type = "info",
  duration = 3000,
  onClose,
  children,
  className,
}: BaseToastProps) {
  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <ToastItem type={type} className={className}>
      {children}
    </ToastItem>
  );
}
