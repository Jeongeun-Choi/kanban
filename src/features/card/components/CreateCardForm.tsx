import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";

import * as Styled from "../styles/styled";
import { createCard } from "../api/createCard";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Textarea from "../../../shared/components/Textarea";
import useInput from "../../../shared/hooks/useInput";
import type { Column, Card } from "../../../shared/types/kanban";
import { useToast } from "../../../shared/hooks/useToast";

interface CreateCardFormProps {
  open: boolean;
  columnId: string;
  onClose: () => void;
}

export default function CreateCardForm({ open, columnId, onClose }: CreateCardFormProps) {
  const { showToast } = useToast();

  const {
    value: title,
    handleChange: handleChangeTitle,
    setValue: setTitle,
  } = useInput({
    initialValue: "",
    maxLength: 100,
    onLimitReached: () => showToast("제목은 100자 이하로 입력해주세요.", "warning"),
  });
  const {
    value: description,
    handleChange: handleChangeDescription,
    setValue: setDescription,
  } = useInput({
    initialValue: "",
    maxLength: 1000,
    onLimitReached: () => showToast("설명은 1000자 이하로 입력해주세요.", "warning"),
  });
  const {
    value: dueDate,
    handleChange: handleChangeDueDate,
    setValue: setDueDate,
  } = useInput({
    initialValue: "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCard,
    onMutate: async (newCard) => {
      await queryClient.cancelQueries({ queryKey: ["columns"] });

      const previousColumns = queryClient.getQueryData<Column[]>(["columns"]);

      // newCard.id가 있으면 그것을 사용 (일관성 유지)
      const newCardId = Math.random().toString();

      queryClient.setQueryData<Column[]>(["columns"], (old) => {
        if (!old) return [];
        return old.map((col) => {
          if (col.id === columnId) {
            const optimisticCard: Card = {
              id: newCardId,
              column_id: columnId,
              title: newCard.title,
              description: newCard.description ?? "",
              due_date: newCard.due_date ?? undefined,
              order: col.cards.length + 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            return {
              ...col,
              cards: [...col.cards, optimisticCard],
            };
          }
          return col;
        });
      });

      return { previousColumns };
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setDueDate("");
      showToast("카드가 추가되었습니다.", "success");
      onClose();
    },
    onError: (err, _, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(["columns"], context.previousColumns);
      }
      console.error(err);
      showToast("카드 추가 중 오류가 발생했습니다.", "error");
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

    mutation.mutate({
      column_id: columnId,
      title,
      description,
      due_date: dueDate,
    });
  };

  if (!open) {
    return null;
  }

  return (
    <Styled.CreateCardForm onSubmit={handleSubmit}>
      <Input
        value={title}
        placeholder="Card title"
        fullWidth
        maxLength={100}
        onChange={handleChangeTitle}
      />
      <Textarea
        value={description}
        placeholder="Description"
        fullWidth
        maxLength={1000}
        onChange={handleChangeDescription}
      />
      <Input value={dueDate} type="date" fullWidth onChange={handleChangeDueDate} />
      <Styled.CreateCardButtons>
        <Button type="submit" variant="contained" loading={mutation.isPending}>
          Add
        </Button>
        <Button type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Styled.CreateCardButtons>
    </Styled.CreateCardForm>
  );
}
