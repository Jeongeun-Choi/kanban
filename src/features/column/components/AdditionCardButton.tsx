import { AdditionCardButtonContainer } from "../styles/styled";

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
    <button onClick={onClick}>카드 추가</button>
  );
}
