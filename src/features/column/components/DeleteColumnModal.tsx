import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteColumn } from "../api/deleteColumn";
import Modal from "../../../shared/components/Modal";
import Button from "../../../shared/components/Button";
import { useToast } from "../../../shared/hooks/useToast";

interface DeleteColumnModalProps {
  open: boolean;
  onClose: () => void;
  columnId: string;
}

export default function DeleteColumnModal({ open, onClose, columnId }: DeleteColumnModalProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: () => deleteColumn({ id: columnId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      showToast("컬럼이 삭제되었습니다.", "success");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      showToast("컬럼 삭제 중 오류가 발생했습니다.", "error");
    },
  });

  return (
    <Modal
      title="Delete column"
      open={open}
      onClose={onClose}
      buttons={[
        <Button
          variant="contained"
          loading={deleteMutation.isPending}
          onClick={() => {
            deleteMutation.mutate();
          }}
        >
          Confirm
        </Button>,
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <span>컬럼 삭제시 컬럼에 있는 카드들도 모두 삭제됩니다.</span>
      <br />
      <span>컬럼을 정말 삭제하시겠습니까?</span>
    </Modal>
  );
}
