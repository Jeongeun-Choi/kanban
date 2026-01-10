import { useEffect, useRef, useState, type FormEvent } from "react";
import * as Styled from "../styles/styled";
import AdditionCardButton from "./AdditionCardButton";
import Card from "../../card/components/Card";
import type { Card as CardType } from "../../../shared/types/kanban";

interface ColumnProps {
  title: string;
}

export default function Column({ title }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const MOCK_CARDS: CardType[] = [];

  const handleSubmitTitle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      titleRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <Styled.ColumnContainer>
      <Styled.ColumnHeader>
        <Styled.TitleForm onSubmit={handleSubmitTitle}>
          {isEditing ? (
            <Styled.Title ref={titleRef} defaultValue={title} />
          ) : (
            <span onClick={() => setIsEditing(true)}>{title}</span>
          )}
        </Styled.TitleForm>
        {/* hover시 삭제 버튼 보여짐 */}
        {/* <button>삭제 버튼</button> */}
      </Styled.ColumnHeader>
      <Styled.ColumnContent>
        {MOCK_CARDS.map((card) => (
          <Card key={card.id} {...card} />
        ))}
        <AdditionCardButton emptyColumn={MOCK_CARDS.length === 0} onClick={() => {}} />
      </Styled.ColumnContent>
    </Styled.ColumnContainer>
  );
}
