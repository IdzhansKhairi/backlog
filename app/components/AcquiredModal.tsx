"use client";

import React, { useState, useEffect } from "react";
import "@/app/(site)/collection/collection.css";

const SOURCE_OPTIONS = ["Shopee", "Hobbylink Japan", "Amiami", "Gundam Place", "Oh My Gundam", "Other"];
const LINKED_KIT_OPTIONS = ["Unlinked", "MGEX Strike Freedom Gundam", "RG Nu Gundam Ver. Ka", "Nightingale Fenrir 1/100"];

interface AcquiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcquire: (item: any, acquiredData: any) => void;
  item: any | null;
}

export default function AcquiredModal({ isOpen, onClose, onAcquire, item }: AcquiredModalProps) {
  const [price, setPrice] = useState("");
  const [source, setSource] = useState("Shopee");
  const [quantity, setQuantity] = useState("1");
  const [linkedKit, setLinkedKit] = useState("Unlinked");
  const [marketPrice, setMarketPrice] = useState("");
  
  // Default to today
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [purchaseDate, setPurchaseDate] = useState(defaultDate);

  useEffect(() => {
    if (item) {
      setPrice("");
      setSource("Shopee");
      setQuantity("1");
      setLinkedKit("Unlinked");
      setMarketPrice("");
      setPurchaseDate(defaultDate);
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

  const handleMarketCurrencyChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setMarketPrice("");
      return;
    }
    const cents = parseInt(digits, 10);
    setMarketPrice((cents / 100).toFixed(2));
  };

  const isFormValid = price !== "" && source !== "" && purchaseDate !== "" && (item?.type === "MODEL KIT" || quantity !== "");

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (!isFormValid || !item) return;

    const acquiredData = {
      price: parseFloat(price),
      source,
      purchaseDate,
      // Only for Tools/Accessories
      quantity: isAccessory || isTool ? parseInt(quantity, 10) : undefined,
      linkedKit: isAccessory ? linkedKit : undefined,
      // Only for Model Kits
      marketPrice: isModelKit && marketPrice ? parseFloat(marketPrice) : undefined,
    };

    onAcquire(item, acquiredData);
    onClose();
  };

  if (!isOpen || !item) return null;

  const isModelKit = item.type === "MODEL KIT";
  const isTool = item.type === "TOOL";
  const isAccessory = item.type === "ACCESSORY";

  const typeLabel = isModelKit ? "Model Kit" : isTool ? "Tool" : "Accessory";
  const subtitle = `${item.brand} · ${typeLabel} · ${item.name}`;
  const buttonLabel = isModelKit ? "Move to Collection" : "Move to Equipment";

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header align-items-start">
          <div className="d-flex flex-column gap-1">
            <h2 className="modal-title">Mark as Acquired</h2>
            <div style={{ color: "#8b949e", fontSize: "13px", fontWeight: 500 }}>{subtitle}</div>
          </div>
          <button className="modal-close-btn" onClick={handleCancel}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {/* Actual Price & Market Price (for Model Kit) */}
          <div className={isModelKit ? "modal-row" : ""}>
            <div className="modal-field">
              <label className="modal-label">Actual Price Paid (RM)</label>
              <input
                type="text"
                className="modal-input"
                placeholder="0.00"
                value={price}
                onChange={(e) => handleCurrencyChange(e.target.value)}
              />
            </div>
            {isModelKit && (
              <div className="modal-field">
                <label className="modal-label">Market Price (Optional)</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="0.00"
                  value={marketPrice}
                  onChange={(e) => handleMarketCurrencyChange(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Retailer / Source + Purchase Date */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Retailer / Source</label>
              <select
                className="modal-select"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Purchase Date</label>
              <input
                type="date"
                className="modal-input modal-date-input"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
          </div>

          {/* Quantity + Linked Kit (Tools/Accessories) */}
          {(!isModelKit) && (
            <div className="modal-row">
              <div className="modal-field">
                <label className="modal-label">Quantity</label>
                <input
                  type="number"
                  className="modal-input"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              {isAccessory && (
                <div className="modal-field">
                  <label className="modal-label">Linked Kit</label>
                  <select
                    className="modal-select"
                    value={linkedKit}
                    onChange={(e) => setLinkedKit(e.target.value)}
                  >
                    {LINKED_KIT_OPTIONS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              )}
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
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
