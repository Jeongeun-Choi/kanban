import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getColumns } from "./features/column/api/getColumns";
import { updateColumn } from "./features/column/api/patchColumn";
import { type Column as ColumnType } from "./shared/types/kanban";
import Column from "./features/column/components/Column";
import styled from "@emotion/styled";
import AdditionColumnButton from "./features/column/components/AdditionColumnButton";
import CreateColumnForm from "./features/column/components/CreateColumnForm";
import { useState, useEffect, type DragEvent } from "react";
import { useCardDrag } from "./features/card/hooks/useCardDrag";

const BoardContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  height: 100vh;
  padding: 40px;
  overflow-x: scroll;
`;

function App() {
  const [open, setOpen] = useState(false);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [localColumns, setLocalColumns] = useState<ColumnType[]>([]);
  const queryClient = useQueryClient();

  const {
    draggedCard,
    handleCardDragStart,
    handleCardDragOver,
    handleCardDragEnd,
    handleCardDrop,
  } = useCardDrag({ localColumns, setLocalColumns });

  const { data: columns } = useQuery({
    queryKey: ["columns"],
    queryFn: () => getColumns(),
    staleTime: 60 * 60 * 1000,
  });

  const updateOrderMutation = useMutation({
    mutationFn: (newColumns: ColumnType[]) => {
      // 병렬로 모든 컬럼의 순서를 업데이트 (Optimistic UI가 이미 적용됨)
      const promises = newColumns.map((col, index) => updateColumn(col.id, { order: index }));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  const handleColumnDragStart = (id: string) => {
    setDraggedColumnId(id);
  };

  const handleColumnDragOver = (event: DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault();
    if (!draggedColumnId || draggedColumnId === targetId) return;

    const sourceIndex = localColumns.findIndex((col) => col.id === draggedColumnId);
    const targetIndex = localColumns.findIndex((col) => col.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newColumns = [...localColumns];
    const [draggedItem] = newColumns.splice(sourceIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItem);

    setLocalColumns(newColumns);
  };

  const handleColumnDragEnd = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDraggedColumnId(null);
    updateOrderMutation.mutate(localColumns);
  };

  useEffect(() => {
    if (columns) {
      setLocalColumns(columns);
    }
  }, [columns]);

  return (
    <BoardContainer>
      {localColumns.map((column) => (
        <Column
          key={column.id}
          id={column.id}
          title={column.title}
          cards={column.cards}
          draggable
          onDragStart={() => handleColumnDragStart(column.id)}
          onDragOver={(event) => handleColumnDragOver(event, column.id)}
          onDragEnd={handleColumnDragEnd}
          isDragging={draggedColumnId === column.id}
          onCardDragStart={handleCardDragStart}
          onCardDragOver={handleCardDragOver}
          onCardDragEnd={handleCardDragEnd}
          onDrop={(e) => handleCardDrop(e, column.id)}
          draggedCard={draggedCard}
        />
      ))}
      <CreateColumnForm open={open} onClose={() => setOpen(false)} />
      <AdditionColumnButton emptyColumn={columns?.length === 0} onClick={() => setOpen(true)} />
    </BoardContainer>
  );
}

export default App;
