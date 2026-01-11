import { useState, useCallback, type DragEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveCard } from "../api/moveCard";
import type { Card as CardType, Column as ColumnType } from "../../../shared/types/kanban";

interface UseCardDragProps {
  localColumns: ColumnType[];
  setLocalColumns: (columns: ColumnType[]) => void;
}

export function useCardDrag({ localColumns, setLocalColumns }: UseCardDragProps) {
  const [draggedCard, setDraggedCard] = useState<CardType | null>(null);
  const queryClient = useQueryClient();

  const moveCardMutation = useMutation({
    mutationFn: ({
      id,
      target_column_id,
      new_order,
    }: {
      id: string;
      target_column_id: string;
      new_order: number;
    }) => moveCard(id, { target_column_id, new_order }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  const handleCardDragStart = useCallback((event: DragEvent<HTMLElement>, card: CardType) => {
    event.stopPropagation();
    setDraggedCard(card);
  }, []);

  const handleCardDragOver = useCallback(
    (event: DragEvent<HTMLElement>, targetColumnId: string, targetCardId?: string) => {
      event.preventDefault();
      event.stopPropagation();
      if (!draggedCard) return;

      // 현재 카드가 어디에 있는지 찾기 (Source Column)
      const sourceColumn = localColumns.find((col) =>
        col.cards.some((card) => card.id === draggedCard.id)
      );
      const targetColumn = localColumns.find((col) => col.id === targetColumnId);
      if (!sourceColumn || !targetColumn) return;

      // 같은 위치면 무시 (하지만 카드가 서로 다른 경우 순서 변경 필요)
      if (sourceColumn.id === targetColumn.id && draggedCard.id === targetCardId) return;

      const newColumns = [...localColumns];
      const newSourceColumn = newColumns.find((col) => col.id === sourceColumn.id);
      const newTargetColumn = newColumns.find((col) => col.id === targetColumnId);

      if (!newSourceColumn || !newTargetColumn) return;

      const sourceIndex = newSourceColumn.cards.findIndex((card) => card.id === draggedCard.id);
      const targetIndex = targetCardId
        ? newTargetColumn.cards.findIndex((card) => card.id === targetCardId)
        : newTargetColumn.cards.length; // 빈 공간이나 컬럼 자체에 드롭할 때

      // 같은 컬럼 내 이동
      if (newSourceColumn.id === newTargetColumn.id) {
        const [movedCard] = newSourceColumn.cards.splice(sourceIndex, 1);
        newSourceColumn.cards.splice(targetIndex, 0, movedCard);
      }
      // 다른 컬럼으로 이동
      else {
        const [movedCard] = newSourceColumn.cards.splice(sourceIndex, 1);
        // 중요: 이동한 카드의 소속 컬럼 ID 정보를 업데이트!
        movedCard.column_id = targetColumnId;
        newTargetColumn.cards.splice(targetIndex, 0, movedCard);
      }

      setLocalColumns(newColumns);
    },
    [draggedCard, localColumns, setLocalColumns]
  );

  const handleCardDragEnd = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDraggedCard(null);
  }, []);

  const handleCardDrop = useCallback(
    (event: DragEvent<HTMLElement>, targetColumnId: string) => {
      event.preventDefault();
      event.stopPropagation();

      if (draggedCard) {
        const targetColumn = localColumns.find((col) => col.id === targetColumnId);
        if (targetColumn) {
          const newIndex = targetColumn.cards.findIndex((c) => c.id === draggedCard.id);
          if (newIndex !== -1) {
            moveCardMutation.mutate({
              id: draggedCard.id,
              target_column_id: targetColumn.id,
              new_order: newIndex,
            });
          }
        }
        setDraggedCard(null);
      }
    },
    [draggedCard, localColumns, moveCardMutation]
  );

  return {
    draggedCard,
    handleCardDragStart,
    handleCardDragOver,
    handleCardDragEnd,
    handleCardDrop,
  };
}
