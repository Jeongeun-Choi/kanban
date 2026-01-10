import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import * as Styled from "../styles/styled";
import type { Card } from "../../../shared/types/kanban";
import { deleteCard } from "../api/deleteCard";

interface CardDetailContentProps {
  card: Card;
  onEdit: () => void;
}

export default function CardDetailContent({ card, onEdit }: CardDetailContentProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
    onError: (err) => {
      console.error(err);
      alert("카드 삭제 중 오류가 발생했습니다.");
    },
  });

  const handleDelete = () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      deleteMutation.mutate(card.id);
    }
  };

  return (
    <Styled.DetailContainer>
      <Styled.DetailHeader>
        <Styled.DetailTitle>{card.title}</Styled.DetailTitle>
        <button onClick={onEdit}>
          <FaRegEdit size={20} />
        </button>
      </Styled.DetailHeader>
      <Styled.DetailSection>
        <Styled.DetailLabel>설명</Styled.DetailLabel>
        <Styled.DetailText>{card.description}</Styled.DetailText>
      </Styled.DetailSection>
      <Styled.DetailSection>
        <Styled.DetailLabel>마감일</Styled.DetailLabel>
        <Styled.DetailText>{card.due_date || "-"}</Styled.DetailText>
      </Styled.DetailSection>
      <Styled.DetailSection>
        <Styled.DetailLabel>생성일</Styled.DetailLabel>
        <Styled.DetailText>{card.created_at || "-"}</Styled.DetailText>
      </Styled.DetailSection>
      <Styled.DetailSection>
        <Styled.DetailLabel>수정일</Styled.DetailLabel>
        <Styled.DetailText>{card.updated_at || "-"}</Styled.DetailText>
      </Styled.DetailSection>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
        <Styled.DangerButton onClick={handleDelete} type="button">
          Delete Card
        </Styled.DangerButton>
      </div>
    </Styled.DetailContainer>
  );
}
