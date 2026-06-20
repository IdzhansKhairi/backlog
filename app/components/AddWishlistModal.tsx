"use client";

import React, { useState } from "react";
import "@/app/(site)/collection/collection.css";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";
import { useModalState } from "@/app/hooks/useModalState";

// ─── Options for dropdowns ───────────────────────────────────────────────────
const KIT_BRAND_OPTIONS = ["Bandai", "Daban", "Fenrir", "Suyata", "Kotobukiya", "Other"];
const GRADE_OPTIONS = ["HG", "MG", "RG", "PG", "MGEX", "MGSD", "1/100", "Non-Scale", "Other"];
const EQUIP_BRAND_OPTIONS = ["God Hand", "DSPIAE", "Mr. Hobby", "Tamiya", "Olfa", "Bandai", "Kosmos", "Other"];

type WishlistType = "model-kit" | "tool" | "accessory";

interface AddWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

export default function AddWishlistModal({ isOpen, onClose, onAdd }: AddWishlistModalProps) {
  const { isRendered, isClosing } = useModalState(isOpen);
  const [type, setType] = useState<WishlistType>("model-kit");

  useEscapeKey(() => {
    if (isOpen) onClose();
  }, isOpen);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Bandai");
  const [grade, setGrade] = useState("MG");
  const [price, setPrice] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [boxArtUrl, setBoxArtUrl] = useState("");

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

  const resetForm = () => {
    setName("");
    setBrand(type === "model-kit" ? "Bandai" : "God Hand");
    setGrade("MG");
    setPrice("");
    setReleaseDate("");
    setBoxArtUrl("");
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    let typeLabel = "MODEL KIT";
    let typeClass = "type-model";
    let scaleValue = "—";

    if (type === "model-kit") {
      typeLabel = "MODEL KIT";
      typeClass = "type-model";
      scaleValue = grade;
    } else if (type === "tool") {
      typeLabel = "TOOL";
      typeClass = "type-tool";
    } else {
      typeLabel = "ACCESSORY";
      typeClass = "type-accessory";
    }

    const newItem = {
      id: Date.now(),
      type: typeLabel,
      typeClass,
      brand,
      name,
      scale: scaleValue,
      estPrice: `RM ${parseFloat(price).toLocaleString()}`,
      releaseDate: releaseDate || "—",
      boxArtUrl: type === "model-kit" ? boxArtUrl : undefined,
    };

    onAdd(newItem);
    resetForm();
    onClose();
  };

  const handleTypeChange = (newType: WishlistType) => {
    setType(newType);
    setName("");
    setPrice("");
    setReleaseDate("");
    setBoxArtUrl("");
    if (newType === "model-kit") {
      setBrand("Bandai");
      setGrade("MG");
    } else {
      setBrand("God Hand");
    }
  };

  if (!isRendered) return null;

  const brandOptions = type === "model-kit" ? KIT_BRAND_OPTIONS : EQUIP_BRAND_OPTIONS;

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`} onClick={handleCancel}>
      <div className={`modal-container ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add to Wishlist</h2>
          <button className="modal-close-btn" onClick={handleCancel}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {/* Type Toggle */}
          <div className="equipment-type-toggle" style={{ marginBottom: 24 }}>
            <button
              className={type === "model-kit" ? "active" : ""}
              onClick={() => handleTypeChange("model-kit")}
            >
              Model Kit
            </button>
            <button
              className={type === "tool" ? "active" : ""}
              onClick={() => handleTypeChange("tool")}
            >
              Tool
            </button>
            <button
              className={type === "accessory" ? "active" : ""}
              onClick={() => handleTypeChange("accessory")}
            >
              Accessory
            </button>
          </div>

          {/* Name */}
          <div className="modal-field">
            <label className="modal-label">
              {type === "model-kit" ? "Kit Name" : "Item Name"}
            </label>
            <input
              type="text"
              className="modal-input"
              placeholder={
                type === "model-kit"
                  ? "e.g. MGSD Freedom Gundam"
                  : type === "tool"
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
                {type === "model-kit" ? "Grade / Scale" : "Category"}
              </label>
              {type === "model-kit" ? (
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
                  value={type === "tool" ? "Tool" : "Accessory"}
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
          {type === "model-kit" && (
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
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
