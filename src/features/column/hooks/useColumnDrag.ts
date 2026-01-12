import { useState, useCallback, type DragEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateColumn } from "../api/patchColumn";
import type { Column as ColumnType } from "../../../shared/types/kanban";
import { useToast } from "../../../shared/hooks/useToast";

interface UseColumnDragProps {
  columns: ColumnType[];
}

export function useColumnDrag({ columns }: UseColumnDragProps) {
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    index: number;
  } | null>(null);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const updateOrderMutation = useMutation({
    mutationFn: (newColumns: ColumnType[]) => {
      const promises = newColumns.map((col, index) => updateColumn(col.id, { order: index }));
      return Promise.all(promises);
    },
    onMutate: async (newColumns) => {
      await queryClient.cancelQueries({ queryKey: ["columns"] });
      const previousColumns = queryClient.getQueryData<ColumnType[]>(["columns"]);
      queryClient.setQueryData(["columns"], newColumns);
      return { previousColumns };
    },
    onError: (_err, _newColumns, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(["columns"], context.previousColumns);
      }
      showToast("컬럼 순서 변경 중 오류가 발생했습니다.", "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
    onSettled: () => {
      setDraggedColumnId(null);
      setDropIndicator(null);
    },
  });

  const handleColumnDragStart = useCallback((_event: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedColumnId(id);
  }, []);

  const handleColumnDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>, targetId?: string) => {
      event.preventDefault();
      event.stopPropagation();
      if (!draggedColumnId) return;
      if (draggedColumnId === targetId) return;

      if (!targetId) {
        setDropIndicator({ index: columns.length });
        return;
      }

      const hoveredIndex = columns.findIndex((col) => col.id === targetId);
      if (hoveredIndex === -1) return;

      // Calculate cursor position relative to element
      const rect = event.currentTarget.getBoundingClientRect();
      const isRightHalf = event.clientX > rect.left + rect.width / 2;

      const targetIndex = isRightHalf ? hoveredIndex + 1 : hoveredIndex;

      setDropIndicator({ index: targetIndex });
    },
    [columns, draggedColumnId]
  );

  const handleColumnDragEnd = useCallback(() => {
    setDraggedColumnId(null);
    setDropIndicator(null);
  }, []);

  const handleColumnDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!draggedColumnId || !dropIndicator) return;

      const { index: targetIndex } = dropIndicator;
      const newColumns = structuredClone(columns);

      const sourceIndex = newColumns.findIndex((col: ColumnType) => col.id === draggedColumnId);

      if (sourceIndex === -1) return;

      const [movedColumn] = newColumns.splice(sourceIndex, 1);

      const movingDown = sourceIndex < targetIndex;
      const finalIndex = movingDown ? Math.max(0, targetIndex - 1) : targetIndex;

      newColumns.splice(finalIndex, 0, movedColumn);

      updateOrderMutation.mutate(newColumns);
    },
    [columns, draggedColumnId, dropIndicator, updateOrderMutation]
  );

  return {
    draggedColumnId,
    dropIndicator,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDragEnd,
    handleColumnDrop,
  };
}
