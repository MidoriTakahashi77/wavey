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

export function Modal({ open, onOpenChange, children, title, description }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-start justify-between">
            {title && (
              <Dialog.Title className="text-lg font-bold text-gray-900">{title}</Dialog.Title>
            )}
            <Dialog.Close className="ml-auto rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
              <HiX size={20} />
            </Dialog.Close>
          </div>
          {description && (
            <Dialog.Description className="mb-4 text-sm text-gray-500">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
