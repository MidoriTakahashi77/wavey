"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { HiX, HiCheckCircle, HiExclamationCircle, HiInformationCircle } from "react-icons/hi";

type ToastType = "success" | "error" | "info" | "wave";

interface ToastData {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  type?: string;
}

const typeStyles: Record<ToastType, { bg: string; icon: typeof HiCheckCircle }> = {
  success: { bg: "bg-green-50 border-green-200", icon: HiCheckCircle },
  error: { bg: "bg-red-50 border-red-200", icon: HiExclamationCircle },
  info: { bg: "bg-blue-50 border-blue-200", icon: HiInformationCircle },
  wave: { bg: "bg-yellow-50 border-yellow-200", icon: HiInformationCircle },
};

const iconColors: Record<ToastType, string> = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
  wave: "text-yellow-500",
};

function ToastItem({ toast }: { toast: ToastData }) {
  const toastType = (toast.type as ToastType) || "info";
  const { bg, icon: Icon } = typeStyles[toastType];

  return (
    <BaseToast.Root
      toast={toast}
      className={`${bg} border rounded-md p-4 shadow-lg flex items-start gap-3`}
    >
      <Icon className={`w-5 h-5 ${iconColors[toastType]} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <BaseToast.Title className="text-sm font-medium text-gray-900">
          {toast.title}
        </BaseToast.Title>
        {toast.description && (
          <BaseToast.Description className="text-sm text-gray-600 mt-1">
            {toast.description}
          </BaseToast.Description>
        )}
      </div>
      <BaseToast.Close className="p-1 rounded hover:bg-black/5 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
        <HiX size={16} />
      </BaseToast.Close>
    </BaseToast.Root>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();

  return (
    <BaseToast.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast as ToastData} />
      ))}
    </BaseToast.Viewport>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseToast.Provider timeout={3000}>
      {children}
      <ToastList />
    </BaseToast.Provider>
  );
}

export function useToast() {
  const toastManager = BaseToast.useToastManager();

  const showToast = (title: string, description?: string, type: ToastType = "info") => {
    toastManager.add({
      title,
      description,
      type,
    });
  };

  return {
    toast: showToast,
    success: (title: string, description?: string) => showToast(title, description, "success"),
    error: (title: string, description?: string) => showToast(title, description, "error"),
    info: (title: string, description?: string) => showToast(title, description, "info"),
    wave: (title: string, description?: string) => showToast(title, description, "wave"),
  };
}

export function Toast({
  title,
  description,
  type = "info",
}: {
  title: string;
  description?: string;
  type?: ToastType;
}) {
  const { bg, icon: Icon } = typeStyles[type];

  return (
    <div className={`${bg} border rounded-md p-4 shadow-lg flex items-start gap-3`}>
      <Icon className={`w-5 h-5 ${iconColors[type]} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        {description && (
          <div className="text-sm text-gray-600 mt-1">{description}</div>
        )}
      </div>
    </div>
  );
}
