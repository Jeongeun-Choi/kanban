import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";

import * as Styled from "../styles/styled";
import { createCard } from "../api/createCard";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Textarea from "../../../shared/components/Textarea";
import useInput from "../../../shared/hooks/useInput";
import type { Column, Card } from "../../../shared/types/kanban";

interface CreateCardFormProps {
  open: boolean;
  columnId: string;
  onClose: () => void;
}

export default function CreateCardForm({ open, columnId, onClose }: CreateCardFormProps) {
  const {
    value: title,
    handleChange: handleChangeTitle,
    setValue: setTitle,
  } = useInput({
    initialValue: "",
  });
  const {
    value: description,
    handleChange: handleChangeDescription,
    setValue: setDescription,
  } = useInput({
    initialValue: "",
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

      onClose();
    },
    onError: (err, _, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(["columns"], context.previousColumns);
      }
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      alert("Title is required");
      return;
    }

    if (title.length > 100) {
      alert("Title must be 100 characters or less");
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
        <Button type="submit" variant="contained">
          Add
        </Button>
        <Button type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Styled.CreateCardButtons>
    </Styled.CreateCardForm>
  );
}
