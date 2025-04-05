
import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export const toast = (message: string, options?: ToastOptions) => {
  if (options?.variant === "destructive") {
    sonnerToast.error(message, { ...options });
  } else {
    sonnerToast.success(message, { ...options });
  }
};
