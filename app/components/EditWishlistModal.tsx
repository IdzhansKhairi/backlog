"use client";

import React, { useState, useEffect } from "react";
import "@/app/(site)/collection/collection.css";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";

// ─── Options for dropdowns ───────────────────────────────────────────────────
const KIT_BRAND_OPTIONS = ["Bandai", "Daban", "Fenrir", "Suyata", "Kotobukiya", "Other"];
const GRADE_OPTIONS = ["HG", "MG", "RG", "PG", "MGEX", "MGSD", "1/100", "Non-Scale", "Other"];
const EQUIP_BRAND_OPTIONS = ["God Hand", "DSPIAE", "Mr. Hobby", "Tamiya", "Olfa", "Bandai", "Kosmos", "Other"];

interface EditWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: any) => void;
  item: any | null;
}

export default function EditWishlistModal({ isOpen, onClose, onEdit, item }: EditWishlistModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [grade, setGrade] = useState("");
  const [price, setPrice] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [notes, setNotes] = useState("");
  const [boxArtUrl, setBoxArtUrl] = useState("");

  useEscapeKey(() => {
    if (isOpen) onClose();
  }, isOpen);

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setBrand(item.brand || "");
      setGrade(item.scale !== "—" ? item.scale : "MG");
      
      if (item.estPrice) {
        // e.g. "RM 165" -> "165.00"
        const num = parseFloat(item.estPrice.replace(/[^\d.]/g, ""));
        setPrice(isNaN(num) ? "" : num.toFixed(2));
      } else {
        setPrice("");
      }

      // Convert "2026-08-15" format or keep it if it is empty/"—"
      setReleaseDate(item.releaseDate && item.releaseDate !== "—" ? item.releaseDate : "");
      setBoxArtUrl(item.boxArtUrl || "");
    }
  }, [item]);

  const handleCurrencyChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setPrice("");
      return;
    }
    const cents = parseInt(digits, 10);
    setPrice((cents / 100).toFixed(2));
  };

  const isFormValid = name.trim() !== "" && brand !== "" && price !== "";

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (!isFormValid || !item) return;

    let scaleValue = "—";
    if (item.type === "MODEL KIT") {
      scaleValue = grade;
    }

    const updatedItem = {
      ...item,
      name,
      brand,
      scale: scaleValue,
      estPrice: `RM ${parseFloat(price).toLocaleString()}`,
      releaseDate: releaseDate || "—",
      boxArtUrl: item.type === "MODEL KIT" ? boxArtUrl : undefined,
    };

    onEdit(updatedItem);
    onClose();
  };

  if (!isOpen || !item) return null;

  const isModelKit = item.type === "MODEL KIT";
  const isTool = item.type === "TOOL";
  const brandOptions = isModelKit ? KIT_BRAND_OPTIONS : EQUIP_BRAND_OPTIONS;
  
  // Format subtitle string
  const subtitle = isModelKit ? "Model Kit" : isTool ? "Tool" : "Accessory";

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header align-items-start">
          <div className="d-flex flex-column gap-1">
            <h2 className="modal-title">Edit Wishlist Item</h2>
            <div style={{ color: "#8b949e", fontSize: "13px", fontWeight: 500 }}>{subtitle}</div>
          </div>
          <button className="modal-close-btn" onClick={handleCancel}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {/* Name */}
          <div className="modal-field">
            <label className="modal-label">
              {isModelKit ? "Kit Name" : "Item Name"}
            </label>
            <input
              type="text"
              className="modal-input"
              placeholder={
                isModelKit
                  ? "e.g. MGSD Freedom Gundam"
                  : isTool
                  ? "e.g. DSPIAE Siren Glass File"
                  : "e.g. Kosmos LED Unit"
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Brand + Grade/Category */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Brand</label>
              <select
                className="modal-select"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {brandOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">
                {isModelKit ? "Grade / Scale" : "Category"}
              </label>
              {isModelKit ? (
                <select
                  className="modal-select"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="modal-input"
                  value={isTool ? "Tool" : "Accessory"}
                  disabled
                  style={{ color: "#8b949e" }}
                />
              )}
            </div>
          </div>

          {/* Price + Release Date */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Estimated Price (RM)</label>
              <input
                type="text"
                className="modal-input"
                placeholder="0.00"
                value={price}
                onChange={(e) => handleCurrencyChange(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">
                Target Date (Optional)
              </label>
              <input
                type="date"
                className="modal-input modal-date-input"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </div>
          </div>

          {/* Box Art URL (Model Kit Only) */}
          {isModelKit && (
            <div className="modal-field" style={{ marginTop: 16 }}>
              <label className="modal-label">Box Art URL</label>
              <input
                type="text"
                className="modal-input"
                placeholder="https://example.com/boxart.jpg"
                value={boxArtUrl}
                onChange={(e) => setBoxArtUrl(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className={`modal-submit-btn ${!isFormValid ? "modal-submit-disabled" : ""}`}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
