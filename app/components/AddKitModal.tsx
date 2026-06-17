"use client";

import React, { useState } from "react";

// ─── Options for dropdowns ───────────────────────────────────────────────────
const BRAND_OPTIONS = ["Bandai", "Daban", "Fenrir", "Suyata", "Kotobukiya", "Other"];
const GRADE_OPTIONS = ["HG", "MG", "RG", "PG", "MGEX", "1/100", "Non-Scale", "Other"];
const SOURCE_OPTIONS = ["Shopee", "Oh My Gundam", "Gundam Place", "Hobbylink Japan", "Pre-order", "Other"];

interface AddKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (kit: any) => void;
}

function getTodayString() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return "";
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export default function AddKitModal({ isOpen, onClose, onAdd }: AddKitModalProps) {
  const [kitName, setKitName] = useState("");
  const [brand, setBrand] = useState("Bandai");
  const [grade, setGrade] = useState("MG");
  const [pricePaid, setPricePaid] = useState("");
  const [marketPrice, setMarketPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(getTodayString());
  const [source, setSource] = useState("Shopee");
  const [boxArtUrl, setBoxArtUrl] = useState("");
  const [alreadyBuilt, setAlreadyBuilt] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("backlog");
  const [estimatedHours, setEstimatedHours] = useState("");

  const handleCurrencyChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setter("");
      return;
    }
    const cents = parseInt(digits, 10);
    setter((cents / 100).toFixed(2));
  };

  const isFormValid = kitName.trim() !== "" && pricePaid !== "" && Number(pricePaid) >= 0;

  const resetForm = () => {
    setKitName("");
    setBrand("Bandai");
    setGrade("MG");
    setPricePaid("");
    setMarketPrice("");
    setPurchaseDate(getTodayString());
    setSource("Shopee");
    setBoxArtUrl("");
    setAlreadyBuilt(false);
    setCurrentStatus("backlog");
    setEstimatedHours("");
  };

  const handleAdd = () => {
    if (!isFormValid) return;

    const newKit = {
      id: Date.now(),
      name: kitName,
      brand,
      grade,
      price: Number(pricePaid),
      marketPrice: marketPrice ? Number(marketPrice) : null,
      purchaseDate,
      source,
      boxArtUrl,
      status: alreadyBuilt ? "completed" : currentStatus,
      estimatedHours: alreadyBuilt && estimatedHours ? Number(estimatedHours) : null,
    };

    onAdd(newKit);
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add Kit to Collection</h2>
          <button className="modal-close-btn" onClick={handleCancel}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {/* Kit Name */}
          <div className="modal-field">
            <label className="modal-label">Kit Name</label>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g. MG Wing Zero EW Ver. Ka"
              value={kitName}
              onChange={(e) => setKitName(e.target.value)}
            />
          </div>

          {/* Brand & Grade */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Brand</label>
              <select className="modal-select" value={brand} onChange={(e) => setBrand(e.target.value)}>
                {BRAND_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Grade / Scale</label>
              <select className="modal-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Paid & Market Price */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Price Paid (RM)</label>
              <input
                type="text"
                className="modal-input"
                placeholder="0.00"
                value={pricePaid}
                onChange={(e) => handleCurrencyChange(setPricePaid, e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">Est. Market Price (Optional)</label>
              <input
                type="text"
                className="modal-input"
                placeholder="0.00"
                value={marketPrice}
                onChange={(e) => handleCurrencyChange(setMarketPrice, e.target.value)}
              />
            </div>
          </div>

          {/* Purchase Date */}
          <div className="modal-field">
            <label className="modal-label">Purchase Date</label>
            <input
              type="date"
              className="modal-input modal-date-input"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>

          {/* Retailer / Source */}
          <div className="modal-field">
            <label className="modal-label">Retailer / Source</label>
            <select className="modal-select" value={source} onChange={(e) => setSource(e.target.value)}>
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Box Art URL */}
          <div className="modal-field">
            <label className="modal-label">Box Art URL (Optional)</label>
            <input
              type="url"
              className="modal-input"
              placeholder="https://.../box-art.jpg"
              value={boxArtUrl}
              onChange={(e) => setBoxArtUrl(e.target.value)}
            />
          </div>

          {/* Already Built Toggle */}
          <div className="modal-toggle-row">
            <div>
              <div className="modal-toggle-title">Already Built (Retroactive Entry)</div>
              <div className="modal-toggle-desc">For kits completed before tracking began.</div>
            </div>
            <button
              className={`modal-toggle-btn ${alreadyBuilt ? "modal-toggle-active" : ""}`}
              onClick={() => setAlreadyBuilt(!alreadyBuilt)}
            >
              <span className="modal-toggle-knob"></span>
            </button>
          </div>

          {/* Conditional: Current Status OR Estimated Hours */}
          {alreadyBuilt ? (
            <div className="modal-field">
              <label className="modal-label">Estimated Total Hours (Optional)</label>
              <input
                type="number"
                className="modal-input"
                placeholder="0"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                min="0"
              />
            </div>
          ) : (
            <div className="modal-field">
              <label className="modal-label">Current Status</label>
              <select
                className="modal-select"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
              >
                <option value="backlog">Backlog</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={handleCancel}>Cancel</button>
          <button
            className={`modal-submit-btn ${!isFormValid ? "modal-submit-disabled" : ""}`}
            onClick={handleAdd}
            disabled={!isFormValid}
          >
            Add Kit
          </button>
        </div>
      </div>
    </div>
  );
}
