import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useEffect } from "react";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Textarea from "../../../shared/components/Textarea";
import useInput from "../../../shared/hooks/useInput";
import type { Card, Column } from "../../../shared/types/kanban";
import { updateCard } from "../api/patchCard";
import { useToast } from "../../../shared/hooks/useToast";

import * as Styled from "../styles/styled";

interface CardEditContentProps {
  card: Card;
  onEdit: () => void;
  setIsDirty: (isDirty: boolean) => void;
}

export default function CardEditContent({ card, onEdit, setIsDirty }: CardEditContentProps) {
  const { showToast } = useToast();

  const { value: title, handleChange: handleChangeTitle } = useInput({
    initialValue: card.title,
    maxLength: 100,
    onLimitReached: () => showToast("제목은 100자 이하로 입력해주세요.", "warning"),
  });
  const { value: description, handleChange: handleChangeDescription } = useInput({
    initialValue: card.description,
    maxLength: 1000,
    onLimitReached: () => showToast("설명은 1000자 이하로 입력해주세요.", "warning"),
  });
  const { value: dueDate, handleChange: handleChangeDueDate } = useInput({
    initialValue: card.due_date ?? "",
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newCard: Partial<Card>) => updateCard(card.id, newCard),
    onMutate: async (newCard: Partial<Card>) => {
      await queryClient.cancelQueries({ queryKey: ["columns"] });

      const previousColumns = queryClient.getQueryData<Column[]>(["columns"]);

      queryClient.setQueryData<Column[]>(["columns"], (old) => {
        if (!old) return [];
        return old.map((col) => {
          if (col.id === card.column_id) {
            const optimisticCard: Card = {
              id: card.id,
              column_id: card.column_id,
              title: newCard?.title || card.title,
              description: newCard?.description || card.description,
              due_date: newCard?.due_date || card.due_date,
              order: card.order,
              created_at: card.created_at,
              updated_at: new Date().toISOString(),
            };
            return {
              ...col,
              cards: col.cards.map((c) => (c.id === card.id ? optimisticCard : c)),
            };
          }
          return col;
        });
      });

      return { previousColumns };
    },
    onSuccess: () => {
      showToast("카드가 수정되었습니다.", "success");
      onEdit();
    },
    onError: (err, _, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(["columns"], context.previousColumns);
      }
      console.error(err);
      showToast("카드 수정 중 오류가 발생했습니다.", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      showToast("제목을 입력해주세요.", "warning");
      return;
    }

    // 빈 문자열이면 undefined로 전송 (API 스펙에 맞춤)
    const cleanDueDate = dueDate === "" ? undefined : dueDate;

    mutation.mutate({ title, description, due_date: cleanDueDate });
  };

  const isTitleDirty = title !== card.title;
  const isDescriptionDirty = (description || "") !== (card.description || "");
  const isDueDateDirty = (dueDate || "") !== (card.due_date || "");
  const isDirty = isTitleDirty || isDescriptionDirty || isDueDateDirty;

  useEffect(() => {
    setIsDirty(isDirty);
  }, [isDirty, setIsDirty]);

  const handleCancel = () => {
    if (isDirty) {
      const isCancel = confirm("변경사항이 있습니다. 정말로 취소하시겠습니까?");
      if (!isCancel) return;
    }
    onEdit();
  };

  return (
    <Styled.EditForm onSubmit={handleSubmit}>
      <Styled.InputGroup>
        <Styled.EditLabel htmlFor="title">제목</Styled.EditLabel>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={handleChangeTitle}
          fullWidth
          maxLength={100}
        />
      </Styled.InputGroup>
      <Styled.InputGroup>
        <Styled.EditLabel htmlFor="description">설명</Styled.EditLabel>
        <Textarea
          id="description"
          value={description}
          onChange={handleChangeDescription}
          fullWidth
          maxLength={1000}
        />
      </Styled.InputGroup>
      <Styled.InputGroup>
        <Styled.EditLabel htmlFor="due_date">마감일</Styled.EditLabel>
        <Input type="date" id="due_date" value={dueDate} onChange={handleChangeDueDate} fullWidth />
      </Styled.InputGroup>
      <Styled.EditButtons>
        <Button type="submit" variant="contained" disabled={!isDirty} loading={mutation.isPending}>
          Edit
        </Button>
        <Button type="button" variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
      </Styled.EditButtons>
    </Styled.EditForm>
  );
}
