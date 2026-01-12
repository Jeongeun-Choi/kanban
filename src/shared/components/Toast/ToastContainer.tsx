import styled from "@emotion/styled";
import Toast from "./Toast";
import type { Toast as ToastType } from "../../types/toast";

interface ToastContainerProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

const Container = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <Container>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </Container>
  );
}
