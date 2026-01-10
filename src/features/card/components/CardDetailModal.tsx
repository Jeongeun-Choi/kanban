import { useState } from "react";

import Modal from "../../../shared/components/Modal";
import type { Card } from "../../../shared/types/kanban";
import CardEditContent from "./CardEditContent";
import CardDetailContent from "./CardDetailContent";

interface CardDetailModalProps {
  card: Card;
  open: boolean;
  onClose: () => void;
}

export default function CardDetailModal({ card, open, onClose }: CardDetailModalProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleChangeEdit = () => {
    setIsEdit((prev) => !prev);
  };

  const handleClose = () => {
    if (isEdit && isDirty) {
      const isCancel = confirm("변경사항이 있습니다. 정말로 취소하시겠습니까?");
      if (!isCancel) return;
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      {isEdit ? (
        <CardEditContent card={card} onEdit={handleChangeEdit} setIsDirty={setIsDirty} />
      ) : (
        <CardDetailContent card={card} onEdit={handleChangeEdit} />
      )}
    </Modal>
  );
}
