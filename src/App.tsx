import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getColumns } from "./features/column/api/getColumns";
import { updateColumn } from "./features/column/api/patchColumn";
import { type Card as CardType, type Column as ColumnType } from "./shared/types/kanban";
import Column from "./features/column/components/Column";
import styled from "@emotion/styled";
import AdditionColumnButton from "./features/column/components/AdditionColumnButton";
import CreateColumnForm from "./features/column/components/CreateColumnForm";
import { useState, useEffect, type DragEvent } from "react";
import { moveCard } from "./features/card/api/moveCard";

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
  const [draggedCard, setDraggedCard] = useState<CardType | null>(null);
  const [localColumns, setLocalColumns] = useState<ColumnType[]>([]);
  const queryClient = useQueryClient();

  const { data: columns } = useQuery({
    queryKey: ["columns"],
    queryFn: () => getColumns(),
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (columns) {
      setLocalColumns(columns);
    }
  }, [columns]);

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
    console.log("column drag start");
    setDraggedColumnId(id);
  };

  const handleColumnDragOver = (event: DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault();
    console.log("column drag over");
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

  const handleCardDragStart = (event: DragEvent<HTMLElement>, card: CardType) => {
    event.stopPropagation();
    setDraggedCard(card);
  };

  const handleCardDragOver = (
    event: DragEvent<HTMLElement>,
    targetColumnId: string,
    targetCardId?: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!draggedCard) return;

    // 1. 현재 카드가 어디에 있는지 찾기 (Source Column)
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
  };

  const handleCardDragEnd = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDraggedCard(null);
  };

  const handleCardDrop = (event: DragEvent<HTMLElement>, targetColumnId: string) => {
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
  };

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
