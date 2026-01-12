import * as Styled from "../styles/styled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumn } from "../api/createColumn";
import { type FormEvent } from "react";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { useToast } from "../../../shared/hooks/useToast";
import useInput from "../../../shared/hooks/useInput";

interface CreateColumnFormProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateColumnForm({ open, onClose }: CreateColumnFormProps) {
  const { showToast } = useToast();
  const {
    value: title,
    handleChange: handleChangeTitle,
    setValue: setTitle,
  } = useInput({
    initialValue: "",
    maxLength: 50,
    onLimitReached: () => showToast("컬럼 제목은 50자 이하로 입력해주세요.", "warning"),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (title?: string) => createColumn({ title }),
    onSuccess: () => {
      setTitle("");
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
      <Input
        value={title}
        onChange={handleChangeTitle}
        placeholder="Column title"
        fullWidth
        maxLength={50}
      />
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
