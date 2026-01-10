import Modal from "../../../shared/components/Modal";
import * as Styled from "../styles/styled";
import type { Card } from "../../../shared/types/kanban";

interface CardDetailModalProps {
  card: Card;
  open: boolean;
  onClose: () => void;
}

export default function CardDetailModal({ card, open, onClose }: CardDetailModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Styled.DetailContainer>
        <Styled.DetailSection>
          <Styled.DetailTitle>{card.title}</Styled.DetailTitle>
        </Styled.DetailSection>
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
      </Styled.DetailContainer>
    </Modal>
  );
}
