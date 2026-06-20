"use client";

import React from "react";
import "@/app/(site)/collection/collection.css";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: any) => void;
  item: any | null;
  title?: string;
  entityName?: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, item, title = "Remove Kit?", entityName = "collection" }: DeleteConfirmModalProps) {
  useEscapeKey(() => {
    if (isOpen) onClose();
  }, isOpen);

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={onClose}>
      <div className="modal-container delete-modal-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="delete-modal-title">{title}</h3>
        <p className="delete-modal-text">
          This will permanently remove <strong>{item.name}</strong> from your {entityName}. This action cannot be undone.
        </p>
        <div className="delete-modal-footer">
          <button className="delete-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-confirm-btn" onClick={() => onConfirm(item)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
