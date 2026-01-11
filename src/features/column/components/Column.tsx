import { useEffect, useRef, useState, memo, type FormEvent, type DragEvent } from "react";

import * as Styled from "../styles/styled";
import type { Card as CardType } from "../../../shared/types/kanban";
import { FaRegEdit, FaTrash } from "react-icons/fa";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateColumn } from "../api/patchColumn";
import ColumnContent from "./ColumnContent";
import DeleteColumnModal from "./DeleteColumnModal";
import Input from "../../../shared/components/Input";
import IconButton from "../../../shared/components/IconButton";
import { useToast } from "../../../shared/hooks/useToast";

interface ColumnProps {
  id: string;
  title: string;
  cards: CardType[];
  draggable?: boolean;
  onColumnDragStart?: (event: DragEvent<HTMLDivElement>, id: string) => void;
  onColumnDragOver?: (event: DragEvent<HTMLDivElement>, id: string) => void;
  onColumnDragEnd?: (event: DragEvent<HTMLDivElement>) => void;
  onColumnDrop?: (event: DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  onCardDragStart?: (event: DragEvent<HTMLElement>, card: CardType) => void;
  onCardDragOver?: (
    event: DragEvent<HTMLElement>,
    targetColumnId: string,
    targetCardId?: string
  ) => void;
  onCardDragEnd?: (event: DragEvent<HTMLElement>) => void;
  draggedCard?: CardType | null;
  dropIndicator?: { columnId: string; index: number } | null;
}

export default memo(function Column({
  id,
  title,
  cards,
  draggable,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDragEnd,
  onColumnDrop,
  isDragging,
  onCardDragStart,
  onCardDragOver,
  onCardDragEnd,
  draggedCard,
  dropIndicator,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const updateMutation = useMutation({
    mutationFn: (newTitle: string) => updateColumn(id, { title: newTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      showToast("컬럼 제목이 수정되었습니다.", "success");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error(error);
      showToast("컬럼 제목 수정 중 오류가 발생했습니다.", "error");
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
    <>
      <Styled.ColumnContainer
        draggable={draggable}
        onDragStart={(e) => onColumnDragStart?.(e, id)}
        onDragOver={(e) => {
          if (draggedCard && onCardDragOver) {
            e.preventDefault();
            const targetEl = document.elementFromPoint(e.clientX, e.clientY);
            const cardEl = targetEl?.closest("[data-card-id]");
            const targetCardId = cardEl?.getAttribute("data-card-id") || undefined;
            onCardDragOver(e, id, targetCardId);
          } else if (onColumnDragOver) {
            onColumnDragOver(e, id);
          }
        }}
        onDragEnd={onColumnDragEnd}
        onDrop={onColumnDrop}
        isDragging={isDragging}
      >
        <Styled.ColumnHeader>
          <Styled.TitleForm onSubmit={handleSubmitTitle}>
            {isEditing ? (
              <Input ref={titleRef} defaultValue={title} onBlur={handleBlur} fullWidth />
            ) : (
              <Styled.ColumnTitle onClick={() => setIsEditing(true)}>{title}</Styled.ColumnTitle>
            )}
          </Styled.TitleForm>
          <IconButton size="small" onClick={() => setIsEditing(true)}>
            <FaRegEdit />
          </IconButton>
          <IconButton size="small" onClick={() => setModalOpen(true)}>
            <FaTrash />
          </IconButton>
        </Styled.ColumnHeader>
        <ColumnContent
          id={id}
          cards={cards}
          draggedCard={draggedCard}
          dropIndicator={dropIndicator}
          onCardDragStart={onCardDragStart}
          onCardDragEnd={onCardDragEnd}
          onCardDragOver={onCardDragOver}
        />
      </Styled.ColumnContainer>
      <DeleteColumnModal open={modalOpen} onClose={() => setModalOpen(false)} columnId={id} />
    </>
  );
});
