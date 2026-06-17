"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import AddEquipmentModal from "@/app/components/AddEquipmentModal";
import "./equipment.css";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockTools = [
  { id: 1, brand: "God Hand", name: "God Hand Ultimate Nipper 5.0", qty: 1, price: 380, purchaseDate: "2025-12-16", source: "Hobbylink Japan" },
  { id: 2, brand: "DSPIAE", name: "DSPIAE Glass File Set", qty: 1, price: 140, purchaseDate: "2026-02-14", source: "Shopee" },
  { id: 3, brand: "Mr. Hobby", name: "Mr. Hobby PS289 Airbrush + Compressor", qty: 1, price: 450, purchaseDate: "2026-03-16", source: "Amiami" },
  { id: 4, brand: "Tamiya", name: "Tamiya Modeler's Knife Pro", qty: 1, price: 95, purchaseDate: "2026-04-15", source: "Shopee" },
  { id: 5, brand: "Olfa", name: "Cutting Mat A3", qty: 1, price: 65, purchaseDate: "2026-04-30", source: "Shopee" },
];

const mockAccessories = [
  { id: 101, brand: "Bandai", name: "Action Base 5 (Clear)", linkedKit: "MGEX Strike Freedom Gundam", qty: 2, price: 90, purchaseDate: "2026-02-24", source: "Shopee" },
  { id: 102, brand: "Bandai", name: "Gundam Decal No. 134", linkedKit: "RG Nu Gundam Ver. Ka", qty: 1, price: 28, purchaseDate: "2026-03-26", source: "Shopee" },
  { id: 103, brand: "Kosmos", name: "Kosmos LED Unit (Freedom)", linkedKit: "MGEX Strike Freedom Gundam", qty: 1, price: 220, purchaseDate: "2026-04-05", source: "Shopee" },
  { id: 104, brand: "Mr. Hobby", name: "Mr. Top Coat Matte Spray", linkedKit: null, qty: 3, price: 96, purchaseDate: "2026-05-05", source: "Shopee" },
  { id: 105, brand: "Other", name: "Resin GK Hand Set 1/100", linkedKit: "Nightingale Fenrir 1/100", qty: 1, price: 85, purchaseDate: "2026-05-15", source: "Shopee" },
];

export default function EquipmentPage() {
  const [activeTab, setActiveTab] = useState<"tools" | "accessories">("tools");
  const [tools, setTools] = useState(mockTools);
  const [accessories, setAccessories] = useState(mockAccessories);

  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = (item: any) => {
    if (activeTab === "tools") {
      setTools((prev) => prev.filter((t) => t.id !== item.id));
    } else {
      setAccessories((prev) => prev.filter((a) => a.id !== item.id));
    }
    setIsDeleting(false);
    setItemToDelete(null);
    setToastMessage(`${item.name} removed`);
  };

  const handleAddAsset = (item: any, type: "tools" | "accessories") => {
    if (type === "tools") {
      setTools((prev) => [...prev, item]);
      setToastMessage(`${item.name} added to tools`);
    } else {
      setAccessories((prev) => [...prev, item]);
      setToastMessage(`${item.name} added to accessories`);
    }
  };

  const totalTools = tools.reduce((sum, t) => sum + t.price, 0);
  const totalAccessories = accessories.reduce((sum, a) => sum + a.price, 0);

  // Find most expensive across both lists
  const allItems = [
    ...tools.map((t) => ({ ...t, type: "Tool" })),
    ...accessories.map((a) => ({ ...a, type: "Accessory" })),
  ];
  const mostExpensive = allItems.length > 0
    ? allItems.reduce((max, item) => (item.price > max.price ? item : max), allItems[0])
    : { name: "None", type: "N/A", price: 0 };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="equipment-header">
        <div>
          <div className="equipment-subtitle">WORKSHOP INVENTORY</div>
          <h1 className="equipment-title">Equipment &amp; Assets</h1>
        </div>
        <button className="equipment-add-btn" onClick={() => setIsAdding(true)}>
          <i className="bi bi-plus-lg" style={{ marginRight: 6 }}></i> Add Asset
        </button>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────────────── */}
      <div className="equipment-stats-grid">
        <div className="equipment-stat-card">
          <div className="equipment-stat-header">
            <i className="bi bi-wrench-adjustable" style={{ fontSize: 14 }}></i>
            TOTAL SPENT ON TOOLS
          </div>
          <div className="equipment-stat-value">RM {totalTools.toLocaleString()}</div>
          <p className="equipment-stat-subtext">{tools.length} tools tracked</p>
        </div>

        <div className="equipment-stat-card">
          <div className="equipment-stat-header">
            <i className="bi bi-stars" style={{ fontSize: 14 }}></i>
            TOTAL SPENT ON ACCESSORIES
          </div>
          <div className="equipment-stat-value">RM {totalAccessories.toLocaleString()}</div>
          <p className="equipment-stat-subtext">{accessories.length} accessories tracked</p>
        </div>

        <div className="equipment-stat-card equipment-stat-highlight">
          <div className="equipment-stat-header">
            <i className="bi bi-trophy" style={{ fontSize: 14 }}></i>
            MOST EXPENSIVE ASSET
          </div>
          <div className="equipment-stat-value equipment-stat-truncate">
            {mostExpensive.name}
          </div>
          <p className="equipment-stat-subtext">{mostExpensive.type} · RM {mostExpensive.price}</p>
        </div>
      </div>

      {/* ── Filter Tabs & Table ────────────────────────────────────────── */}
      <div className="equipment-table-wrapper">
        <div className="equipment-tabs">
          <button
            className={`equipment-tab ${activeTab === "tools" ? "active" : ""}`}
            onClick={() => setActiveTab("tools")}
          >
            Tools &amp; Hardware
          </button>
          <button
            className={`equipment-tab ${activeTab === "accessories" ? "active" : ""}`}
            onClick={() => setActiveTab("accessories")}
          >
            Accessories &amp; Detailing
          </button>
        </div>

        {/* ── Tools Table ──────────────────────────────────────────────── */}
        {activeTab === "tools" && (
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Item Name</th>
                <th style={{ textAlign: "center" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th>Purchase Date</th>
                <th>Source</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id}>
                  <td className="equipment-brand">{tool.brand}</td>
                  <td>{tool.name}</td>
                  <td style={{ textAlign: "center", color: "#8b949e" }}>×{tool.qty}</td>
                  <td className="equipment-price" style={{ textAlign: "right" }}>RM {tool.price}</td>
                  <td style={{ color: "#8b949e" }}>{tool.purchaseDate}</td>
                  <td style={{ color: "#8b949e" }}>{tool.source}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="equipment-delete-btn" onClick={() => handleDeleteClick(tool)}>
                      <i className="bi bi-trash3" style={{ fontSize: 15 }}></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Accessories Table ────────────────────────────────────────── */}
        {activeTab === "accessories" && (
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Item Name</th>
                <th style={{ textAlign: "center" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th>Purchase Date</th>
                <th>Source</th>
                <th>Linked Kit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {accessories.map((acc) => (
                <tr key={acc.id}>
                  <td className="equipment-brand">{acc.brand}</td>
                  <td>{acc.name}</td>
                  <td style={{ textAlign: "center", color: "#8b949e" }}>×{acc.qty}</td>
                  <td className="equipment-price" style={{ textAlign: "right" }}>RM {acc.price}</td>
                  <td style={{ color: "#8b949e" }}>{acc.purchaseDate}</td>
                  <td style={{ color: "#8b949e" }}>{acc.source}</td>
                  <td style={{ color: acc.linkedKit ? "#8b949e" : "#484f58", fontStyle: acc.linkedKit ? "normal" : "italic" }}>
                    {acc.linkedKit || "Unlinked"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="equipment-delete-btn" onClick={() => handleDeleteClick(acc)}>
                      <i className="bi bi-trash3" style={{ fontSize: 15 }}></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Delete Confirm Modal ─────────────────────────────────────── */}
      <DeleteConfirmModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDeleteConfirm}
        item={itemToDelete}
        title={`Remove ${activeTab === "tools" ? "Tool" : "Accessory"}?`}
        entityName="equipment"
      />

      {/* ── Add Asset Modal ──────────────────────────────────────────── */}
      <AddEquipmentModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onAdd={handleAddAsset}
      />

      {/* ── Toast Notification ─────────────────────────────────────────── */}
      {toastMessage && (
        <div className="equipment-toast">
          <i className="bi bi-check-circle-fill" style={{ color: "#21262d", fontSize: 16 }}></i>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
