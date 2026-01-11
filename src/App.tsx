import { useQuery } from "@tanstack/react-query";
import { getColumns } from "./features/column/api/getColumns";
import Column from "./features/column/components/Column";
import * as Styled from "./features/column/styles/styled";
import styled from "@emotion/styled";
import AdditionColumnButton from "./features/column/components/AdditionColumnButton";
import CreateColumnForm from "./features/column/components/CreateColumnForm";
import { useState, Fragment } from "react";
import { useCardDrag } from "./features/card/hooks/useCardDrag";
import { useColumnDrag } from "./features/column/hooks/useColumnDrag";

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

  const { data: columns = [] } = useQuery({
    queryKey: ["columns"],
    queryFn: () => getColumns(),
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
    </BoardContainer>
  );
}

export default App;
