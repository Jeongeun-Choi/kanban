import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, memo, useCallback, type DragEvent } from "react";
import { FaTrash, FaExclamationCircle } from "react-icons/fa";
import * as Styled from "../styles/styled";
import { deleteCard } from "../api/deleteCard";
import CardDetailModal from "./CardDetailModal";
import IconButton from "../../../shared/components/Button/IconButton";
import { isOverdue as checkOverdue } from "../../../shared/utils/date";
import { useToast } from "../../../shared/hooks/useToast";

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
  onCardDragStart?: (event: DragEvent<HTMLElement>, card: Card) => void;
  onCardDragEnd?: (event: DragEvent<HTMLElement>) => void;
  onCardDragOver?: (event: DragEvent<HTMLElement>, columnId: string, cardId: string) => void;
  isDragging?: boolean;
}

const Card = memo(function Card({
  id,
  title,
  column_id,
  description,
  due_date,
  order,
  created_at,
  updated_at,
  draggable,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
  isDragging,
}: Card) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      showToast("카드가 삭제되었습니다.", "success");
    },
    onError: (error) => {
      console.error(error);
      showToast("카드 삭제 중 오류가 발생했습니다.", "error");
    },
  });

  const isOverdue = checkOverdue(due_date);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (confirm("정말로 삭제하시겠습니까?")) {
      mutation.mutate(id);
    }
  };

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLLIElement>) => {
      onCardDragStart?.(e, {
        id,
        title,
        column_id,
        description,
        due_date,
        order,
        created_at,
        updated_at,
      });
    },
    [onCardDragStart, id, title, column_id, description, due_date, order, created_at, updated_at]
  );
  const handleDragEnd = useCallback(
    (e: DragEvent<HTMLLIElement>) => {
      onCardDragEnd?.(e);
    },
    [onCardDragEnd]
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLLIElement>) => {
      onCardDragOver?.(e, column_id, id);
    },
    [onCardDragOver, column_id, id]
  );

  return (
    <>
      <Styled.CardContainer
        onClick={() => setIsDetailOpen(true)}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        isDragging={isDragging}
        isOverdue={isOverdue}
        data-card-id={id}
      >
        <Styled.CardTitle>
          <span>{title}</span>
          <IconButton size="small" onClick={handleDelete} aria-label="Delete card">
            <FaTrash />
          </IconButton>
        </Styled.CardTitle>
        {due_date && (
          <Styled.CardDeadline isOverdue={isOverdue}>
            {isOverdue && <FaExclamationCircle />}
            {due_date}
          </Styled.CardDeadline>
        )}
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
});

export default Card;
