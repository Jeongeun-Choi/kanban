import * as Styled from "../styles/styled";
import { FaRegEdit } from "react-icons/fa";
import type { Card } from "../../../shared/types/kanban";

interface CardDetailContentProps {
  card: Card;
  onEdit: () => void;
}

export default function CardDetailContent({ card, onEdit }: CardDetailContentProps) {
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
    </Styled.DetailContainer>
  );
}
