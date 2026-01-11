import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteColumn } from "../api/deleteColumn";
import Modal from "../../../shared/components/Modal";
import Button from "../../../shared/components/Button";

interface DeleteColumnModalProps {
  open: boolean;
  onClose: () => void;
  columnId: string;
}

export default function DeleteColumnModal({ open, onClose, columnId }: DeleteColumnModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteColumn({ id: columnId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      onClose();
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
