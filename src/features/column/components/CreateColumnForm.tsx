import * as Styled from "../styles/styled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumn } from "../api/createColumn";
import { useRef, type FormEvent } from "react";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";

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
      <Input ref={titleRef} placeholder="Column title" fullWidth />
      <Styled.CreateColumnButtons>
        <Button type="submit" variant="contained">
          Add
        </Button>
        <Button type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Styled.CreateColumnButtons>
    </Styled.CreateColumnForm>
  );
}
