import styled from "@emotion/styled";
import type { PropsWithChildren, ReactNode } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  open: boolean;
  title?: string;
  buttons?: ReactNode[];
  onClose: () => void;
}

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  width: 600px;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
`;

const ModalHeader = styled.div`
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.8rem;
`;

export default function Modal({
  title,
  open,
  children,
  buttons,
  onClose,
}: PropsWithChildren<ModalProps>) {
  if (!open) {
    return null;
  }

  return createPortal(
    <ModalContainer onClick={onClose}>
      <ModalContent onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <span>{title}</span>
          <button onClick={onClose}>
            <IoMdClose size={20} />
          </button>
        </ModalHeader>
        {children}
        <ModalFooter>{buttons?.map((button) => button)}</ModalFooter>
      </ModalContent>
    </ModalContainer>,
    document.body
  );
}
