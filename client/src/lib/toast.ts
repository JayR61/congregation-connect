
import React from "react";
import { toast as sonnerToast } from "sonner";

export type ToastOptions = {
  variant?: "default" | "destructive" | "info";
  action?: React.ReactNode;
};

export const toast = (message: string, options?: ToastOptions) => {
  if (options?.variant === "destructive") {
    sonnerToast.error(message, { ...options });
  } else if (options?.variant === "info") {
    sonnerToast.info(message, { ...options });
  } else {
    sonnerToast.success(message, { ...options });
  }
};

// Add helper methods to match the original API
toast.success = (message: string, options?: Omit<ToastOptions, "variant">) => {
  sonnerToast.success(message, { ...options });
};

toast.error = (message: string, options?: Omit<ToastOptions, "variant">) => {
  sonnerToast.error(message, { ...options });
};

toast.info = (message: string, options?: Omit<ToastOptions, "variant">) => {
  sonnerToast.info(message, { ...options });
};
