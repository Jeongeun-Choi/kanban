import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type DragEvent } from "react";
import { FaTrash } from "react-icons/fa";
import * as Styled from "../styles/styled";
import { deleteCard } from "../api/deleteCard";
import CardDetailModal from "./CardDetailModal";

interface Card {
  id: string;
  title: string;
  column_id: string;
  description?: string;
  due_date?: string;
  order: number;
  created_at: string;
  updated_at: string;
  draggable?: boolean;
  onDragStart?: (event: DragEvent<HTMLLIElement>) => void;
  onDragEnd?: (event: DragEvent<HTMLLIElement>) => void;
  isDragging?: boolean;
}

export default function Card({
  id,
  title,
  column_id,
  description,
  due_date,
  order,
  created_at,
  updated_at,
  draggable,
  onDragStart,
  onDragEnd,
  isDragging,
}: Card) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
    onError: (error) => {
      console.error(error);
      alert("카드 삭제 중 오류가 발생했습니다.");
    },
  });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (confirm("정말로 삭제하시겠습니까?")) {
      mutation.mutate(id);
    }
  };

  return (
    <>
      <Styled.CardContainer
        onClick={() => setIsDetailOpen(true)}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        isDragging={isDragging}
        data-card-id={id}
      >
        <Styled.CardTitle>
          <span>{title}</span>
          <button onClick={handleDelete}>
            <FaTrash />
          </button>
        </Styled.CardTitle>
        <Styled.CardDeadline>{due_date}</Styled.CardDeadline>
      </Styled.CardContainer>
      <CardDetailModal
        card={{
          id,
          title,
          column_id,
          description,
          due_date,
          order,
          created_at,
          updated_at,
        }}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}
