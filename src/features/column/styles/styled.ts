import styled from "@emotion/styled";

export const ColumnContainer = styled.div<{ isDragging?: boolean }>`
  width: 280px;
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background-color: var(--bg-column);
  border-radius: 8px;
  padding: 1rem;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  transition: opacity 0.2s ease;
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-main);
  font-weight: 700;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;

export const TitleForm = styled.form`
  width: 100%;
  display: flex;
  flex: 1;
  align-items: center;
`;

export const ColumnTitle = styled.span`
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent; /* Match Input border width */
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  min-height: 34px; /* Approximate height of Input to be safe */
  box-sizing: border-box;
`;

export const ColumnContent = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  list-style: none;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

export const ColumnFooter = styled.div`
  padding-top: 0.75rem;
  flex-shrink: 0;
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
  height: 48px;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.02);
  color: var(--text-sub, #586069);
  border: 2px dashed rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-color: var(--accent-main, #3b82f6);
    color: var(--accent-main, #3b82f6);
  }
`;

export const AdditionColumnButton = styled.button`
  width: 280px;
  height: 50px;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-sub, #586069);
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    border-color: var(--accent-main, #3b82f6);
    color: var(--accent-main, #3b82f6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: translateY(0);
  }

  span {
    white-space: nowrap;
  }
`;

export const CreateColumnForm = styled.form`
  width: 280px;
  height: fit-content;
  padding: 0.75rem;
  background-color: var(--bg-column, #ebecf0);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.2s ease-out;
  box-sizing: border-box;
  flex-shrink: 0;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const CreateColumnButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
