import { useQuery } from "@tanstack/react-query";
import { useState, Fragment } from "react";
import styled from "@emotion/styled";

import { getColumns } from "../../column/api/getColumns";
import Column from "../../column/components/Column";
import * as Styled from "../../column/styles/styled";
import AdditionColumnButton from "../../column/components/AdditionColumnButton";
import CreateColumnForm from "../../column/components/CreateColumnForm";
import { useCardDrag } from "../../card/hooks/useCardDrag";
import { useColumnDrag } from "../../column/hooks/useColumnDrag";
import BoardSkeleton from "./BoardSkeleton";

const BoardContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  height: 100vh;
  padding: 40px;
  overflow-x: scroll;
`;

export default function KanbanBoard() {
  const [open, setOpen] = useState(false);

  const { data: columns = [], isLoading } = useQuery({
    queryKey: ["columns"],
    queryFn: () => getColumns(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    draggedCard,
    dropIndicator: cardDropIndicator,
    handleCardDragStart,
    handleCardDragOver,
    handleCardDragEnd,
    handleCardDrop,
  } = useCardDrag({ localColumns: columns || [] });

  const {
    draggedColumnId,
    dropIndicator: columnDropIndicator,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDragEnd,
    handleColumnDrop,
  } = useColumnDrag({ columns: columns || [] });

  return (
    <BoardContainer
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        handleCardDragEnd(e);
        handleColumnDrop(e);
        handleColumnDragEnd();
      }}
    >
      {isLoading ? (
        <BoardSkeleton />
      ) : (
        <>
          {columns.map((column, index) => (
            <Fragment key={column.id}>
              {columnDropIndicator?.index === index && <Styled.ColumnDropIndicator />}
              <Column
                id={column.id}
                title={column.title}
                cards={column.cards}
                draggable
                onColumnDragStart={handleColumnDragStart}
                onColumnDragOver={handleColumnDragOver}
                onColumnDragEnd={handleColumnDragEnd}
                isDragging={draggedColumnId === column.id}
                onCardDragStart={handleCardDragStart}
                onCardDragOver={handleCardDragOver}
                onCardDragEnd={handleCardDragEnd}
                onColumnDrop={handleCardDrop}
                draggedCard={draggedCard}
                dropIndicator={cardDropIndicator}
              />
            </Fragment>
          ))}
          {columnDropIndicator?.index === columns.length && <Styled.ColumnDropIndicator />}
          <CreateColumnForm open={open} onClose={() => setOpen(false)} />
          <AdditionColumnButton emptyColumn={columns?.length === 0} onClick={() => setOpen(true)} />
        </>
      )}
    </BoardContainer>
  );
}
