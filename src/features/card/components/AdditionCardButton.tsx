import { FaPlus } from "react-icons/fa";
import { AdditionCardButtonContainer } from "../../column/styles/styled";
import Button from "../../../shared/components/Button";

interface AdditionCardButtonProps {
  emptyColumn: boolean;
  onClick: () => void;
}

export default function AdditionCardButton({ emptyColumn, onClick }: AdditionCardButtonProps) {
  return emptyColumn ? (
    <AdditionCardButtonContainer onClick={onClick}>
      <FaPlus size={14} />
      <span>카드를 추가해보세요!</span>
    </AdditionCardButtonContainer>
  ) : (
    <Button variant="text" fullWidth onClick={onClick}>
      <FaPlus size={12} style={{ marginRight: "6px" }} />
      <span>카드 추가</span>
    </Button>
  );
}
