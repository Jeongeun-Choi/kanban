import styled from "@emotion/styled";

export const CardContainer = styled.li`
  width: 100%;
  border-radius: 4px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const CardTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: bold;
`;

export const CardDeadline = styled.div`
  font-size: 0.75rem;
  color: #666;
`;

export const CreateCardForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  width: 100%;
  border-radius: 4px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const CreateCardButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DetailLabel = styled.div`
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--text-sub, #586069);
`;

export const DetailTitle = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-main, #24292e);
  word-break: break-word;
`;

export const DetailText = styled.span`
  font-size: 0.9375rem;
  color: var(--text-main, #24292e);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const EditLabel = styled.label`
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-sub, #586069);
`;

export const EditButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;
