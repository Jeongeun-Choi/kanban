import * as Styled from "../styles/styled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumn } from "../api/createColumn";
import { useRef, type FormEvent } from "react";

interface CreateColumnFormProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateColumnForm({ open, onClose }: CreateColumnFormProps) {
  const titleRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (title?: string) => createColumn({ title }),
    onSuccess: () => {
      if (titleRef.current) {
        titleRef.current.value = "";
      }
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      onClose?.();
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await mutation.mutateAsync(titleRef.current?.value);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  if (!open) {
    return null;
  }

  return (
    <Styled.CreateColumnForm onSubmit={handleSubmit}>
      <Styled.Title ref={titleRef} placeholder="Column title" />
      <Styled.CreateColumnButtons>
        <Styled.CreateColumnButton type="submit" variant="contained">
          Add
        </Styled.CreateColumnButton>
        <Styled.CreateColumnButton type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Styled.CreateColumnButton>
      </Styled.CreateColumnButtons>
    </Styled.CreateColumnForm>
  );
}
