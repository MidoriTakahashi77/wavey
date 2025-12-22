"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ReactNode } from "react";
import { HiX } from "react-icons/hi";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: string;
  description?: string;
};

export function Modal({
  open,
  onOpenChange,
  children,
  title,
  description,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <div className="flex items-start justify-between mb-4">
            {title && (
              <Dialog.Title className="text-lg font-bold text-gray-900">
                {title}
              </Dialog.Title>
            )}
            <Dialog.Close className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors ml-auto">
              <HiX size={20} />
            </Dialog.Close>
          </div>
          {description && (
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
