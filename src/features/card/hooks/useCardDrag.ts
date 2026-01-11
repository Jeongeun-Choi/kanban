import { useState, useCallback, type DragEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveCard } from "../api/moveCard";
import type { Card as CardType, Column as ColumnType } from "../../../shared/types/kanban";

interface UseCardDragProps {
  localColumns: ColumnType[];
}

export function useCardDrag({ localColumns }: UseCardDragProps) {
  const [draggedCard, setDraggedCard] = useState<CardType | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    columnId: string;
    index: number;
  } | null>(null);

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
    onMutate: async ({ id, target_column_id, new_order }) => {
      await queryClient.cancelQueries({ queryKey: ["columns"] });
      const previousColumns = queryClient.getQueryData<ColumnType[]>(["columns"]);

      if (previousColumns) {
        const newColumns = structuredClone(previousColumns);
        const sourceColumn = newColumns.find((col: ColumnType) =>
          col.cards.some((c) => c.id === id)
        );
        const targetColumn = newColumns.find((col: ColumnType) => col.id === target_column_id);

        if (sourceColumn && targetColumn) {
          const sourceIndex = sourceColumn.cards.findIndex((c: CardType) => c.id === id);
          if (sourceIndex !== -1) {
            const [movedCard] = sourceColumn.cards.splice(sourceIndex, 1);
            movedCard.column_id = target_column_id;
            targetColumn.cards.splice(new_order, 0, movedCard);
            queryClient.setQueryData(["columns"], newColumns);
          }
        }
      }

      return { previousColumns };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(["columns"], context.previousColumns);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
    onSettled: () => {
      setDraggedCard(null);
      setDropIndicator(null);
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

      const targetColumn = localColumns.find((col) => col.id === targetColumnId);
      if (!targetColumn) return;

      const hoveredIndex = targetCardId
        ? targetColumn.cards.findIndex((card) => card.id === targetCardId)
        : -1;

      let targetIndex: number;

      if (hoveredIndex !== -1) {
        const rect = event.currentTarget.getBoundingClientRect();
        const isBottomHalf = event.clientY > rect.top + rect.height / 2;
        targetIndex = isBottomHalf ? hoveredIndex + 1 : hoveredIndex;
      } else {
        targetIndex = targetColumn.cards.length;
      }

      setDropIndicator((prev) => {
        if (prev?.columnId === targetColumnId && prev?.index === targetIndex) {
          return prev;
        }
        return { columnId: targetColumnId, index: targetIndex };
      });
    },
    [draggedCard, localColumns]
  );

  const handleCardDragEnd = useCallback((event?: DragEvent<HTMLElement> | Event) => {
    event?.preventDefault?.();
    setDraggedCard(null);
    setDropIndicator(null);
  }, []);

  const handleCardDrop = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();

      if (!draggedCard || !dropIndicator) return;

      const { columnId: targetColumnId, index: targetIndex } = dropIndicator;

      const sourceColumn = localColumns.find((col: ColumnType) =>
        col.cards.some((c) => c.id === draggedCard.id)
      );
      const targetColumn = localColumns.find((col: ColumnType) => col.id === targetColumnId);

      if (!sourceColumn || !targetColumn) return;

      const sourceIndex = sourceColumn.cards.findIndex((c: CardType) => c.id === draggedCard.id);
      if (sourceIndex === -1) return;

      const isSameColumn = sourceColumn.id === targetColumn.id;
      const movingDown = sourceIndex < targetIndex;
      const finalIndex = isSameColumn && movingDown ? Math.max(0, targetIndex - 1) : targetIndex;

      moveCardMutation.mutate({
        id: draggedCard.id,
        target_column_id: targetColumnId,
        new_order: finalIndex,
      });
    },
    [draggedCard, dropIndicator, localColumns, moveCardMutation]
  );

  return {
    draggedCard,
    dropIndicator,
    handleCardDragStart,
    handleCardDragOver,
    handleCardDragEnd,
    handleCardDrop,
  };
}
