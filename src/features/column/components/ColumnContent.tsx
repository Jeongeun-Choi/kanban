import { useState, Fragment, memo, type DragEvent } from "react";
import * as Styled from "../styles/styled";
import AdditionCardButton from "./AdditionCardButton";
import Card from "../../card/components/Card";
import type { Card as CardType } from "../../../shared/types/kanban";
import CreateCardForm from "../../card/components/CreateCardForm";

interface ColumnContentProps {
  id: string;
  cards: CardType[];
  draggedCard?: CardType | null;
  dropIndicator?: { columnId: string; index: number } | null;
  onCardDragStart?: (event: DragEvent<HTMLElement>, card: CardType) => void;
  onCardDragEnd?: (event: DragEvent<HTMLElement>) => void;
  onCardDragOver?: (
    event: DragEvent<HTMLElement>,
    targetColumnId: string,
    targetCardId?: string
  ) => void;
}

export default memo(function ColumnContent({
  id,
  cards,
  draggedCard,
  dropIndicator,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
}: ColumnContentProps) {
  const [createCardOpen, setCreateCardOpen] = useState(false);

  return (
    <Styled.ColumnContent>
      {cards?.map((card, index) => (
        <Fragment key={card.id}>
          {dropIndicator?.columnId === id && dropIndicator.index === index && (
            <Styled.DropIndicator />
          )}
          <Card
            {...card}
            draggable
            onCardDragStart={onCardDragStart}
            onCardDragEnd={onCardDragEnd}
            onCardDragOver={onCardDragOver}
            isDragging={draggedCard?.id === card.id}
          />
        </Fragment>
      ))}
      {dropIndicator?.columnId === id &&
        (dropIndicator.index === cards?.length || cards?.length === 0) && <Styled.DropIndicator />}
      <CreateCardForm
        open={createCardOpen}
        columnId={id}
        onClose={() => setCreateCardOpen(false)}
      />
      <AdditionCardButton
        emptyColumn={cards?.length === 0}
        onClick={() => setCreateCardOpen(true)}
      />
    </Styled.ColumnContent>
  );
});
