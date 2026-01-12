import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegEdit, FaExclamationCircle } from "react-icons/fa";
import * as Styled from "../styles/styled";
import type { Card } from "../../../shared/types/kanban";
import { deleteCard } from "../api/deleteCard";
import IconButton from "../../../shared/components/IconButton";
import { isOverdue as checkOverdue } from "../../../shared/utils/date";
import { useToast } from "../../../shared/hooks/useToast";

interface CardDetailContentProps {
  card: Card;
  onEdit: () => void;
}

export default function CardDetailContent({ card, onEdit }: CardDetailContentProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const isOverdue = checkOverdue(card.due_date);

  const deleteMutation = useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      showToast("카드가 삭제되었습니다.", "success");
    },
    onError: (err) => {
      console.error(err);
      showToast("카드 삭제 중 오류가 발생했습니다.", "error");
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
        <IconButton size="small" onClick={onEdit}>
          <FaRegEdit size={20} />
        </IconButton>
      </Styled.DetailHeader>
      <Styled.DetailSection>
        <Styled.DetailLabel>설명</Styled.DetailLabel>
        <Styled.DetailText>{card.description}</Styled.DetailText>
      </Styled.DetailSection>
      <Styled.DetailSection>
        <Styled.DetailLabel>마감일</Styled.DetailLabel>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {isOverdue && (
            <Styled.OverdueIconWrapper>
              <FaExclamationCircle size={18} />
            </Styled.OverdueIconWrapper>
          )}
          <Styled.DetailText isOverdue={isOverdue}>{card.due_date || "-"}</Styled.DetailText>
        </div>
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
