import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { CardContainer, CardDeadline, CardTitle } from "../styles/styled";
import type { Card as CardType } from "../../../shared/types/kanban";
import { deleteCard } from "../api/deleteCard";
import CardDetailModal from "./CardDetailModal";

type CardProps = CardType;

export default function Card(card: CardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
    onError: (error) => {
      console.error(error);
      alert("카드 삭제 중 오류가 발생했습니다.");
    },
  });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (confirm("정말로 삭제하시겠습니까?")) {
      mutation.mutate(card.id);
    }
  };

  return (
    <>
      <CardContainer onClick={() => setIsDetailOpen(true)}>
        <CardTitle>
          <span>{card.title}</span>
          <button onClick={handleDelete}>
            <FaTrash />
          </button>
        </CardTitle>
        <CardDeadline>{card.due_date}</CardDeadline>
      </CardContainer>
      <CardDetailModal card={card} open={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
    </>
  );
}
