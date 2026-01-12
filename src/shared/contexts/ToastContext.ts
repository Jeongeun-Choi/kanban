import { createContext } from "react";
import type { ToastType } from "../types/toast";

export interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType,
    options?: {
      action?: { label: string; onClick: () => void };
      duration?: number;
    }
  ) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
