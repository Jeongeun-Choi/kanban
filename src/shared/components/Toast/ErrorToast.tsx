import styled from "@emotion/styled";
import { FaExclamationTriangle } from "react-icons/fa";
import BaseToast from "./BaseToast";
import { ERROR_MESSAGES } from "../../constants/index";

interface ErrorToastProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  onClose: () => void;
}

const StyledErrorToast = styled(BaseToast)`
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
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
  width: 100%;
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
  const handleActionClick = () => {
    action?.onClick();
    onClose();
  };

  return (
    <StyledErrorToast type="error" duration={duration} onClose={onClose}>
      <ContentWrapper>
        <IconWrapper>
          <FaExclamationTriangle />
        </IconWrapper>
        <MessageWrapper>
          <Title>{ERROR_MESSAGES.TITLE}</Title>
          <Description>{message}</Description>
        </MessageWrapper>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </ContentWrapper>
      {action && (
        <ActionArea>
          <ActionButton onClick={handleActionClick}>{action.label}</ActionButton>
        </ActionArea>
      )}
    </StyledErrorToast>
  );
}
