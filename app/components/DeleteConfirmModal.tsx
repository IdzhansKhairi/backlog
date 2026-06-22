"use client";

import React, { useState, useEffect } from "react";
import "@/app/(site)/collection/collection.css";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";
import { useModalState } from "@/app/hooks/useModalState";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: any) => void;
  item: any | null;
  title?: string;
  entityName?: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, item, title = "Remove Kit?", entityName = "collection" }: DeleteConfirmModalProps) {
  const { isRendered, isClosing } = useModalState(isOpen);
  const [cachedItem, setCachedItem] = useState(item);

  useEffect(() => {
    if (item) setCachedItem(item);
  }, [item]);

  useEscapeKey(() => {
    if (isOpen) onClose();
  }, isOpen);

  const displayItem = item || cachedItem;

  if (!isRendered || !displayItem) return null;

  return (
    <div className={`modal-overlay modal-overlay-top ${isClosing ? "closing" : ""}`} onClick={onClose}>
      <div className={`modal-container delete-modal-container ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        <h3 className="delete-modal-title">{title}</h3>
        <p className="delete-modal-text">
          This will permanently remove <strong>{displayItem.name}</strong> from your {entityName}. This action cannot be undone.
        </p>
        <div className="delete-modal-footer">
          <button className="delete-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-confirm-btn" onClick={() => onConfirm(displayItem)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
