import { AdditionCardButtonContainer } from "../styles/styled";
import Button from "../../../shared/components/Button";

interface AdditionCardButtonProps {
  emptyColumn: boolean;
  onClick: () => void;
}

export default function AdditionCardButton({ emptyColumn, onClick }: AdditionCardButtonProps) {
  return emptyColumn ? (
    <AdditionCardButtonContainer onClick={onClick}>
      카드를 추가해보세요!
    </AdditionCardButtonContainer>
  ) : (
    <Button variant="text" fullWidth onClick={onClick}>
      카드 추가
    </Button>
  );
}
