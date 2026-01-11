import * as Styled from "../styles/styled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumn } from "../api/createColumn";
import { useRef, type FormEvent } from "react";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { useToast } from "../../../shared/hooks/useToast";

interface CreateColumnFormProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateColumnForm({ open, onClose }: CreateColumnFormProps) {
  const titleRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (title?: string) => createColumn({ title }),
    onSuccess: () => {
      if (titleRef.current) {
        titleRef.current.value = "";
      }
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      showToast("컬럼이 추가되었습니다.", "success");
      onClose?.();
    },
    onError: (error) => {
      console.error(error);
      showToast("컬럼 추가 중 오류가 발생했습니다.", "error");
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = titleRef.current?.value;
    if (!title?.trim()) {
      showToast("컬럼 제목을 입력해주세요.", "warning");
      return;
    }

    mutation.mutate(title.trim());
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
