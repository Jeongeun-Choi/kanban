import styled from "@emotion/styled";
import { FaExclamationTriangle } from "react-icons/fa";
import { useEffect } from "react";

interface ErrorToastProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  onClose: () => void;
}

const ErrorToastItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(215, 58, 73, 0.2);
  min-width: 320px;
  max-width: 500px;
  animation: slideIn 0.3s ease-out;
  border-left: 5px solid #d73a49;

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

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const IconWrapper = styled.div`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  color: #d73a49;
  margin-top: 0.125rem;
`;

const MessageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.span`
  color: var(--text-main, #24292e);
  font-size: 0.875rem;
  font-weight: 700;
`;

const Description = styled.span`
  color: var(--text-sub, #586069);
  font-size: 0.8125rem;
  line-height: 1.4;
`;

const ActionArea = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid var(--border-color, #e1e4e8);
  padding-top: 0.75rem;
  margin-top: 0.25rem;
`;

const ActionButton = styled.button`
  background-color: #d73a49;
  border: none;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #cb2431;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

export default function ErrorToast({ message, action, duration = 0, onClose }: ErrorToastProps) {
  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const handleActionClick = () => {
    action?.onClick();
    onClose();
  };

  return (
    <ErrorToastItem>
      <ContentWrapper>
        <IconWrapper>
          <FaExclamationTriangle />
        </IconWrapper>
        <MessageWrapper>
          <Title>오류 발생</Title>
          <Description>{message}</Description>
        </MessageWrapper>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </ContentWrapper>
      {action && (
        <ActionArea>
          <ActionButton onClick={handleActionClick}>{action.label}</ActionButton>
        </ActionArea>
      )}
    </ErrorToastItem>
  );
}
