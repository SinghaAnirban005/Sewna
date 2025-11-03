import { toast as sonnerToast } from "sonner";

function useToast() {
  return {
    toast: sonnerToast,
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
  };
}

export { useToast };
export { sonnerToast as toast };
