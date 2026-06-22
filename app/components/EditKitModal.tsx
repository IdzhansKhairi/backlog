"use client";

import React, { useState, useEffect } from "react";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";
import { useModalState } from "@/app/hooks/useModalState";
import "@/app/(site)/collection/collection.css";

// ─── Options for dropdowns ───────────────────────────────────────────────────
const BRAND_OPTIONS = ["Bandai", "Daban", "Fenrir", "Suyata", "Kotobukiya", "Motor Nuclear", "Other"];
const GRADE_OPTIONS = ["HG", "MG", "RG", "PG", "MGEX", "1/100", "Non-Scale", "Other"];
const SOURCE_OPTIONS = ["Shopee", "Oh My Gundam", "Gundam Place", "Hobbylink Japan", "Pre-order", "USA Gundam Store", "Amiami", "Other"];
const STATUS_OPTIONS = ["backlog", "in-progress", "completed"];

interface EditKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedKit: any) => void;
  kit: any | null;
}

function getStatusLabel(status: string) {
  switch (status) {
    case "backlog": return "Backlog";
    case "in-progress": return "In Progress";
    case "completed": return "Completed";
    default: return status;
  }
}

export default function EditKitModal({ isOpen, onClose, onSave, kit }: EditKitModalProps) {
  const { isRendered, isClosing } = useModalState(isOpen);
  const [cachedKit, setCachedKit] = useState(kit);

  useEffect(() => {
    if (kit) setCachedKit(kit);
  }, [kit]);

  const [kitName, setKitName] = useState("");
  const [brand, setBrand] = useState("Bandai");
  const [grade, setGrade] = useState("MG");
  const [pricePaid, setPricePaid] = useState("");
  const [status, setStatus] = useState("backlog");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [source, setSource] = useState("Shopee");
  const [buildStartDate, setBuildStartDate] = useState("");
  const [buildFinishDate, setBuildFinishDate] = useState("");
  const [boxArtUrl, setBoxArtUrl] = useState("");

  useEscapeKey(() => {
    if (isOpen) onClose();
  }, isOpen);

  // Populate form when kit changes
  useEffect(() => {
    if (kit) {
      setKitName(kit.name || "");
      setBrand(kit.brand || "Bandai");
      setGrade(kit.grade || "MG");
      setPricePaid(kit.price?.toString() || "");
      setStatus(kit.status || "backlog");
      setPurchaseDate(kit.purchaseDate || "");
      setSource(kit.source || "Shopee");
      setBuildStartDate(kit.buildStartDate || "");
      setBuildFinishDate(kit.buildFinishDate || "");
      setBoxArtUrl(kit.boxArtUrl || "");
    }
  }, [kit]);

  const handleSave = () => {
    const updatedKit = {
      ...kit,
      name: kitName,
      brand,
      grade,
      price: Number(pricePaid),
      status,
      purchaseDate,
      source,
      buildStartDate: status !== "backlog" ? buildStartDate : "",
      buildFinishDate: status === "completed" ? buildFinishDate : "",
      boxArtUrl,
    };
    onSave(updatedKit);
  };

  const displayKit = kit || cachedKit;

  if (!isRendered || !displayKit) return null;

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`} onClick={onClose}>
      <div className={`modal-container edit-modal-container ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="edit-modal-header">
          <div>
            <h2 className="edit-modal-title">{displayKit.name}</h2>
            <div className="edit-modal-subtitle">{displayKit.brand} · {displayKit.grade}</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="edit-modal-body">
          {/* Box Art Preview */}
          <div className="edit-box-art-preview">
            {boxArtUrl ? (
              <img src={boxArtUrl} alt="Box Art" />
            ) : (
              <div className="edit-box-art-placeholder">ADD URL BELOW</div>
            )}
          </div>

          {/* Form Fields */}
          <div className="edit-form-fields">
            {/* Kit Name */}
            <div className="edit-field-full">
              <label className="edit-label">Kit Name</label>
              <input
                type="text"
                className="edit-input"
                value={kitName}
                onChange={(e) => setKitName(e.target.value)}
              />
            </div>

            {/* Brand & Grade */}
            <div className="edit-field-row">
              <div className="edit-field">
                <label className="edit-label">Brand</label>
                <select className="edit-select" value={brand} onChange={(e) => setBrand(e.target.value)}>
                  {BRAND_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="edit-field">
                <label className="edit-label">Grade / Scale</label>
                <select className="edit-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Status */}
            <div className="edit-field-row">
              <div className="edit-field">
                <label className="edit-label">Price Paid (RM)</label>
                <input
                  type="text"
                  className="edit-input"
                  value={pricePaid}
                  onChange={(e) => setPricePaid(e.target.value)}
                />
              </div>
              <div className="edit-field">
                <label className="edit-label">Status</label>
                <select className="edit-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{getStatusLabel(s)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Purchase Date & Source */}
            <div className="edit-field-row">
              <div className="edit-field">
                <label className="edit-label">Purchase Date</label>
                <input
                  type="date"
                  className="edit-input edit-date-input"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
              <div className="edit-field">
                <label className="edit-label">Retailer / Source</label>
                <select className="edit-select" value={source} onChange={(e) => setSource(e.target.value)}>
                  {SOURCE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Build Start & Finish Date (only for non-backlog) */}
            {status !== "backlog" && (
              <div className="edit-field-row">
                <div className="edit-field">
                  <label className="edit-label">Build Start Date</label>
                  <input
                    type="date"
                    className="edit-input edit-date-input"
                    value={buildStartDate}
                    onChange={(e) => setBuildStartDate(e.target.value)}
                  />
                </div>
                <div className="edit-field">
                  <label className="edit-label">Build Finish Date</label>
                  <input
                    type="date"
                    className="edit-input edit-date-input"
                    value={buildFinishDate}
                    onChange={(e) => setBuildFinishDate(e.target.value)}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>
            )}

            {/* Box Art URL */}
            <div className="edit-field-full">
              <label className="edit-label">Box Art URL</label>
              <input
                type="url"
                className="edit-input"
                placeholder="https://.../box-art.jpg"
                value={boxArtUrl}
                onChange={(e) => setBoxArtUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="edit-modal-footer">
          <button className="edit-cancel-btn" onClick={onClose}>
            <i className="bi bi-x modal-icon-sm"></i> Cancel
          </button>
          <button className="edit-save-btn" onClick={handleSave}>
            <i className="bi bi-save modal-icon-md"></i> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
