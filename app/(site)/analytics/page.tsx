"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import AddWishlistModal from "@/app/components/AddWishlistModal";
import EditWishlistModal from "@/app/components/EditWishlistModal";
import AcquiredModal from "@/app/components/AcquiredModal";
import "./analytics.css";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const chartData = [
  { name: "MGEX", value: 1200, color: "#f28123" },
  { name: "MG", value: 2500, color: "#58a6ff" },
  { name: "1/100", value: 800, color: "#3fb950" },
  { name: "Non-Scale", value: 450, color: "#d2a8ff" },
  { name: "RG", value: 1100, color: "#e3b341" },
  { name: "HG", value: 600, color: "#79c0ff" },
  { name: "PG", value: 775, color: "#ff7b72" },
  { name: "Tools", value: 1130, color: "#f28123" },
  { name: "Accessories", value: 519, color: "#58a6ff" },
];

const initialWishlist = [
  { id: 1, type: "MODEL KIT", typeClass: "type-model", brand: "Bandai", name: "MGSD Freedom Gundam", scale: "Non-Scale", estPrice: "RM 320", releaseDate: "2026-08-15" },
  { id: 2, type: "MODEL KIT", typeClass: "type-model", brand: "Fenrir", name: "Fenrir Hi-Nu Ver. Ka", scale: "1/100", estPrice: "RM 880", releaseDate: "2026-07-01" },
  { id: 3, type: "TOOL", typeClass: "type-tool", brand: "Bandai", name: "DSPIAE Siren Glass File Set", scale: "—", estPrice: "RM 165", releaseDate: "2026-07-20" },
  { id: 4, type: "MODEL KIT", typeClass: "type-model", brand: "Daban", name: "Daban Unicorn Banshee Norn", scale: "PG", estPrice: "RM 720", releaseDate: "2026-09-10" },
  { id: 5, type: "ACCESSORY", typeClass: "type-accessory", brand: "Other", name: "Kosmos LED Unit (Strike Freedom)", scale: "—", estPrice: "RM 240", releaseDate: "2026-08-30" },
];

export default function AnalyticsPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any | null>(null);
  const [isAcquiring, setIsAcquiring] = useState(false);
  const [itemToAcquire, setItemToAcquire] = useState<any | null>(null);

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
    setWishlist(wishlist.filter(w => w.id !== item.id));
    setIsDeleting(false);
    setItemToDelete(null);
    setToastMessage(`${item.name} removed from wishlist`);
  };

  const handleAddWishlist = (item: any) => {
    setWishlist(prev => [...prev, item]);
    setToastMessage(`${item.name} added to wishlist`);
  };

  const handleEditClick = (item: any) => {
    setItemToEdit(item);
    setIsEditing(true);
  };

  const handleEditConfirm = (updatedItem: any) => {
    setWishlist(prev => prev.map(w => w.id === updatedItem.id ? updatedItem : w));
    setIsEditing(false);
    setItemToEdit(null);
    setToastMessage(`${updatedItem.name} updated successfully`);
  };

  const handleAcquireClick = (item: any) => {
    setItemToAcquire(item);
    setIsAcquiring(true);
  };

  const handleAcquireConfirm = (item: any, acquiredData: any) => {
    setWishlist(prev => prev.filter(w => w.id !== item.id));
    setIsAcquiring(false);
    setItemToAcquire(null);
    setToastMessage(`${item.name} moved to equipment`);
  };

  // Calculate total expected cost dynamically
  const totalExpectedCost = wishlist.reduce((sum, item) => {
    const priceNum = parseFloat(item.estPrice.replace(/[^\d.]/g, ""));
    return sum + (isNaN(priceNum) ? 0 : priceNum);
  }, 0);

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="analytics-header">
        <div className="analytics-subtitle">FINANCIAL ANALYTICS &amp; WISHLIST</div>
        <h1 className="analytics-title">Where the ringgit goes</h1>
      </div>

      {/* ── Top Grid (Lifetime Exp + Chart) ─────────────────────────────────── */}
      <div className="analytics-grid-top">
        {/* Left: Lifetime Expenditure */}
        <div className="analytics-card analytics-highlight-card">
          <div className="analytics-card-header">
            <i className="bi bi-wallet2"></i>
            LIFETIME EXPENDITURE
          </div>
          <div className="analytics-card-value">RM 9,074</div>
          <div className="analytics-card-subtext">
            Kits RM 7,425 &middot; Tools RM 1,130 &middot; Accessories RM 519
          </div>
        </div>

        {/* Right: Chart */}
        <div className="analytics-card">
          <div className="analytics-card-header" style={{ marginBottom: 0 }}>
            Cost Distribution by Type
          </div>
          <div style={{ width: "100%", height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `RM ${value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="custom-legend">
            {chartData.map((entry, index) => (
              <div key={index} className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: entry.color }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Middle section: Cost Efficiency ──────────────────────────────────── */}
      <div className="analytics-card analytics-efficiency-card">
        <div className="efficiency-left">
          <div className="efficiency-icon">
            <i className="bi bi-clock"></i>
          </div>
          <div className="efficiency-content">
            <div className="efficiency-label">COST EFFICIENCY</div>
            <div className="efficiency-title">Average Cost per Build Hour</div>
            <div className="efficiency-desc">
              (Calculated using Model Kit data only. Excludes Equipment)
            </div>
            <div className="efficiency-desc">
              Across 9 timed-completed kits
            </div>
          </div>
        </div>
        <div className="efficiency-right">
          <span className="efficiency-value">RM  33</span>
          <span className="efficiency-unit">/ hr</span>
        </div>
      </div>

      {/* ── Bottom Section: Wishlist ─────────────────────────────────────────── */}
      <div className="wishlist-header">
        <div className="wishlist-title">
          <i className="bi bi-stars"></i>
          WISHLIST
        </div>
        <div className="wishlist-actions">
          <span className="wishlist-total-pill">
            Total Expected Cost &middot; <span>RM {totalExpectedCost.toLocaleString()}</span>
          </span>
          <button className="btn-wishlist" onClick={() => setIsAdding(true)}>
            <i className="bi bi-plus-lg"></i> Add to Wishlist
          </button>
        </div>
      </div>

      <div className="wishlist-table-container">
        <table className="wishlist-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Brand</th>
              <th>Name</th>
              <th>Scale</th>
              <th>Est. Price</th>
              <th>Release Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={`type-pill ${item.typeClass}`}>{item.type}</span>
                </td>
                <td style={{ fontWeight: 600, color: "#fff" }}>{item.brand}</td>
                <td style={{ color: "#fff" }}>{item.name}</td>
                <td>
                  <span className={item.scale !== "—" ? "scale-pill" : ""}>
                    {item.scale}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: "#fff" }}>{item.estPrice}</td>
                <td>{item.releaseDate}</td>
                <td style={{ textAlign: "right" }}>
                  <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-acquired" onClick={() => handleAcquireClick(item)}>
                      <i className="bi bi-bag-check"></i> Acquired
                    </button>
                    <button className="btn-edit" onClick={() => handleEditClick(item)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-trash" onClick={() => handleDeleteClick(item)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteConfirmModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDeleteConfirm}
        item={itemToDelete}
        title="Remove from Wishlist?"
        entityName="wishlist"
      />

      <AddWishlistModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onAdd={handleAddWishlist}
      />

      <EditWishlistModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onEdit={handleEditConfirm}
        item={itemToEdit}
      />

      <AcquiredModal
        isOpen={isAcquiring}
        onClose={() => setIsAcquiring(false)}
        onAcquire={handleAcquireConfirm}
        item={itemToAcquire}
      />

      {toastMessage && (
        <div className="analytics-toast">
          <i className="bi bi-check-circle-fill" style={{ color: "#3fb950" }}></i>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
