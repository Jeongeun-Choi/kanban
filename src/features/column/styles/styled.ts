import styled from "@emotion/styled";

export const ColumnContainer = styled.div<{ isDragging?: boolean }>`
  width: 240px;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--bg-column);
  border-radius: 8px;
  padding: 1rem;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  transition: opacity 0.2s ease;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-main);
  font-weight: 700;
`;

export const TitleForm = styled.form`
  width: 100%;
  display: flex;
  flex: 1;
`;

export const ColumnContent = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
`;

export const DropIndicator = styled.li`
  height: 4px;
  background-color: var(--accent-main, #3b82f6);
  border-radius: 2px;
  margin: 4px 0;
  list-style: none;
`;

export const ColumnDropIndicator = styled.div`
  width: 4px;
  background-color: var(--accent-main, #3b82f6);
  border-radius: 2px;
  margin: 0 2px;
`;

export const AdditionCardButtonContainer = styled.button`
  width: 100%;
  height: 50px;
  padding: 0.5rem;
  background-color: #cacacaff;
  border: none;
  border-radius: 4px;
`;

export const AdditionColumnButton = styled.button`
  width: 240px;
  height: 50px;
  padding: 0.5rem;
  background-color: #cacacaff;
  border: none;
  border-radius: 4px;
`;

export const CreateColumnForm = styled.form`
  width: 240px;
  height: 100px;
  padding: 0.5rem;
  background-color: #cacacaff;
  border: none;
  border-radius: 4px;
  gap: 0.5rem;
`;

export const CreateColumnButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.3rem;
`;
