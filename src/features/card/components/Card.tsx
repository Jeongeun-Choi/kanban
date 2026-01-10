import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { CardContainer, CardDeadline, CardTitle } from "../styles/styled";
import type { Card as CardType } from "../../../shared/types/kanban";
import CardDetailModal from "./CardDetailModal";

type CardProps = CardType;

export default function Card(card: CardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
      <CardContainer onClick={() => setIsDetailOpen(true)}>
        <CardTitle>
          <span>{card.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Todo: Delete card
            }}
          >
            <FaTrash />
          </button>
        </CardTitle>
        <CardDeadline>{card.due_date}</CardDeadline>
      </CardContainer>
      <CardDetailModal card={card} open={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
    </>
  );
}
