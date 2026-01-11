import { FaPlus } from "react-icons/fa";
import * as Styled from "../styles/styled";

interface AdditionColumnButtonProps {
  emptyColumn: boolean;
  onClick: () => void;
}

export default function AdditionColumnButton({ emptyColumn, onClick }: AdditionColumnButtonProps) {
  const text = emptyColumn ? "첫 번째 컬럼을 추가해보세요" : "컬럼 추가";

  return (
    <Styled.AdditionColumnButton onClick={onClick}>
      <FaPlus size={14} />
      <span>{text}</span>
    </Styled.AdditionColumnButton>
  );
}
