import { useEffect, useRef, useState, type FormEvent, type DragEvent } from "react";

import * as Styled from "../styles/styled";
import AdditionCardButton from "./AdditionCardButton";
import Card from "../../card/components/Card";
import type { Card as CardType } from "../../../shared/types/kanban";
import { FaRegEdit, FaTrash } from "react-icons/fa";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateColumn } from "../api/patchColumn";
import Modal from "../../../shared/components/Modal";
import { deleteColumn } from "../api/deleteColumn";
import CreateCardForm from "../../card/components/CreateCardForm";

interface ColumnProps {
  id: string;
  title: string;
  cards: CardType[];
  draggable?: boolean;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
}

export default function Column({
  id,
  title,
  cards,
  draggable,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [createCardOpen, setCreateCardOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (newTitle: string) => updateColumn(id, { title: newTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteColumn({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  const handleSubmitTitle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (titleRef.current?.value && titleRef.current.value !== title) {
      updateMutation.mutate(titleRef.current.value.trim());
    } else {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (titleRef.current?.value && titleRef.current.value !== title) {
      updateMutation.mutate(titleRef.current.value.trim());
    } else {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      titleRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <>
      <Styled.ColumnContainer
        draggable={draggable}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        isDragging={isDragging}
      >
        <Styled.ColumnHeader>
          <Styled.TitleForm onSubmit={handleSubmitTitle}>
            {isEditing ? (
              <Styled.Title ref={titleRef} defaultValue={title} onBlur={handleBlur} />
            ) : (
              <span onClick={() => setIsEditing(true)}>{title}</span>
            )}
          </Styled.TitleForm>
          <button onClick={() => setIsEditing(true)}>
            <FaRegEdit />
          </button>
          <button onClick={() => setModalOpen(true)}>
            <FaTrash />
          </button>
        </Styled.ColumnHeader>
        <Styled.ColumnContent>
          {cards?.map((card) => (
            <Card key={card.id} {...card} />
          ))}
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
      </Styled.ColumnContainer>
      <Modal
        title="Delete column"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        buttons={[
          <button
            onClick={() => {
              deleteMutation.mutate();
              setModalOpen(false);
            }}
          >
            Confirm
          </button>,
          <button onClick={() => setModalOpen(false)}>Cancel</button>,
        ]}
      >
        <span>컬럼 삭제시 컬럼에 있는 카드들도 모두 삭제됩니다.</span>
        <br />
        <span>컬럼을 정말 삭제하시겠습니까?</span>
      </Modal>
    </>
  );
}
