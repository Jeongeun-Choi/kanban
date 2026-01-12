import { useState, useCallback, type ReactNode } from "react";
import ToastContainer from "../components/Toast/ToastContainer";
import GlobalErrorListener from "../components/Toast/GlobalErrorListener";
import type { Toast, ToastType } from "../types/toast";
import { ToastContext } from "./ToastContext";

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      options: { action?: { label: string; onClick: () => void }; duration?: number } = {}
    ) => {
      const id = window.crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type, ...options }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <GlobalErrorListener />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}
