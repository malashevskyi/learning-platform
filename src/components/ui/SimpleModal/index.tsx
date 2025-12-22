"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "../Button";

export interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId?: string;
  children: React.ReactNode;
}

export const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,
  titleId,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 mx-4 relative">
          <Button
            onClick={onClose}
            variant="outline"
            icon={<X className="h-5 w-5 text-gray-500" />}
            className="absolute top-4 right-8 "
            size="icon"
            aria-label="Close"
          />

          {children}
        </div>
      </div>
    </>
  );
};

export default SimpleModal;
