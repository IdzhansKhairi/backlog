"use client";

import React, { useState, useEffect } from "react";
import "@/app/(site)/collection/collection.css";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";

const BRAND_OPTIONS = ["God Hand", "DSPIAE", "Mr. Hobby", "Tamiya", "Olfa", "Bandai", "Kosmos", "Other"];
const SOURCE_OPTIONS = ["Shopee", "Hobbylink Japan", "Amiami", "Gundam Place", "Oh My Gundam", "Other"];
const LINKED_KIT_OPTIONS = ["Unlinked", "MGEX Strike Freedom Gundam", "RG Nu Gundam Ver. Ka", "Nightingale Fenrir 1/100"];

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any, type: "tools" | "accessories") => void;
}

function getTodayString() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export default function AddEquipmentModal({ isOpen, onClose, onAdd }: AddEquipmentModalProps) {
  const [type, setType] = useState<"tool" | "accessory">("tool");
  
  const [brand, setBrand] = useState("God Hand");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(getTodayString());
  const [quantity, setQuantity] = useState("1");
  const [source, setSource] = useState("Shopee");
  const [linkedKit, setLinkedKit] = useState("Unlinked");

  useEscapeKey(() => {
    if (isOpen) onClose();
  }, isOpen);

  const handleCurrencyChange = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setPrice("");
      return;
    }
    const cents = parseInt(digits, 10);
    setPrice((cents / 100).toFixed(2));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setQuantity(value);
  };

  const isFormValid = name.trim() !== "" && price !== "" && brand !== "" && quantity !== "";

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const newItem = {
      id: Date.now(),
      brand,
      name,
      qty: parseInt(quantity, 10),
      price: parseFloat(price),
      purchaseDate,
      source,
      ...(type === "accessory" ? { linkedKit: linkedKit === "Unlinked" ? null : linkedKit } : {})
    };

    onAdd(newItem, type === "tool" ? "tools" : "accessories");
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setType("tool");
    setBrand("God Hand");
    setName("");
    setPrice("");
    setPurchaseDate(getTodayString());
    setQuantity("1");
    setSource("Shopee");
    setLinkedKit("Unlinked");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add Asset</h2>
          <button className="modal-close-btn" onClick={handleCancel}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Toggle */}
          <div className="equipment-type-toggle">
            <button 
              className={type === "tool" ? "active" : ""} 
              onClick={() => {
                setType("tool");
                setBrand("God Hand");
              }}
            >
              Tool
            </button>
            <button 
              className={type === "accessory" ? "active" : ""} 
              onClick={() => {
                setType("accessory");
                setBrand("Bandai");
              }}
            >
              Accessory
            </button>
          </div>

          {/* Row 1: Brand + Item Name */}
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
              <label className="modal-label">Item Name</label>
              <input
                type="text"
                className="modal-input"
                placeholder={type === "tool" ? "Ultimate Nipper 5.0" : "Action Base 5"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Price + Purchase Date */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Price (RM)</label>
              <input
                type="text"
                className="modal-input"
                placeholder="0.00"
                value={price}
                onChange={(e) => handleCurrencyChange(e.target.value)}
              />
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

          {/* Row 3: Quantity + Source */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Quantity</label>
              <input
                type="text"
                className="modal-input"
                placeholder="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">Source / Retailer</label>
              <select className="modal-select" value={source} onChange={(e) => setSource(e.target.value)}>
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Accessory only: Row 4 - Linked Kit (full width) */}
          {type === "accessory" && (
            <div className="modal-field">
              <label className="modal-label">Linked Kit (Optional)</label>
              <select className="modal-select" value={linkedKit} onChange={(e) => setLinkedKit(e.target.value)}>
                {LINKED_KIT_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
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
            Add {type === "tool" ? "Tool" : "Accessory"}
          </button>
        </div>
      </div>
    </div>
  );
}
