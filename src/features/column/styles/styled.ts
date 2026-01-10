import styled from "@emotion/styled";

export const ColumnContainer = styled.div`
  width: 240px;
  min-height: 240px;
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
  font-weight: 700;
`;

export const TitleForm = styled.form`
  width: 100%;
  display: flex;
  flex: 1;
`;

export const Title = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  font-size: 1rem;
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

export const CreateColumnButton = styled.button<{ variant?: "contained" | "outlined" }>`
  background-color: ${(props) => (props.variant === "contained" ? "#21728dff" : "white")};
  border: ${(props) => (props.variant === "contained" ? "none" : "1px solid #191919")};
  color: ${(props) => (props.variant === "contained" ? "white" : "#191919")};
  padding: 0.5rem;
  border-radius: 4px;
`;
