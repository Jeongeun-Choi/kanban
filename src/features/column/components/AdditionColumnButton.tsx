import * as Styled from "../styles/styled";

interface AdditionColumnButtonProps {
  emptyColumn: boolean;
}

export default function AdditionColumnButton({ emptyColumn }: AdditionColumnButtonProps) {
  const text = emptyColumn ? "첫 번째 컬럼을 추가해보세요" : "컬럼 추가";

  return <Styled.AdditionColumnButton>{text}</Styled.AdditionColumnButton>;
}
