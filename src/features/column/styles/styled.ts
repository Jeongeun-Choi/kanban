import styled from "@emotion/styled";

export const ColumnContainer = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--bg-column);
  border-radius: 8px;
  padding: 1rem;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-main);
  font-weight: 600;
`;

export const TitleForm = styled.form`
  width: 100%;
`;

export const Title = styled.input`
  width: 100%;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  background-color: transparent;
  color: var(--text-main);
`;

export const ColumnContent = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

export const AdditionCardButtonContainer = styled.button`
  width: 100%;
  height: 50px;
  padding: 0.5rem;
  background-color: #cacacaff;
  border: none;
  border-radius: 4px;
`;
