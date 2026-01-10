import { useEffect, useRef, useState, type FormEvent } from "react";

import * as Styled from "../styles/styled";
import AdditionCardButton from "./AdditionCardButton";
import Card from "../../card/components/Card";
import type { Card as CardType } from "../../../shared/types/kanban";
import { FaRegEdit, FaTrash } from "react-icons/fa";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateColumn } from "../api/patchColumn";

interface ColumnProps {
  id: string;
  title: string;
}

export default function Column({ id, title }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const MOCK_CARDS: CardType[] = [];

  const updateMutation = useMutation({
    mutationFn: (newTitle: string) => updateColumn(id, { title: newTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      setIsEditing(false);
    },
  });

  const handleSubmitTitle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (titleRef.current?.value && titleRef.current.value !== title) {
      updateMutation.mutate(titleRef.current.value.trim());
    } else {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (titleRef.current?.value && titleRef.current.value !== title) {
      updateMutation.mutate(titleRef.current.value.trim());
    } else {
      setIsEditing(false);
    }
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
            <Styled.Title ref={titleRef} defaultValue={title} onBlur={handleBlur} />
          ) : (
            <span onClick={() => setIsEditing(true)}>{title}</span>
          )}
        </Styled.TitleForm>
        <button onClick={() => setIsEditing(true)}>
          <FaRegEdit />
        </button>
        <button>
          <FaTrash />
        </button>
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
