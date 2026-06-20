"use client";

import React, { useState, useMemo, useEffect } from "react";
import { STATUS_CONFIG } from "@/app/constants/status";
import AddKitModal from "@/app/components/AddKitModal";
import ViewKitModal from "@/app/components/ViewKitModal";
import EditKitModal from "@/app/components/EditKitModal";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import "./collection.css";

// ─── Initial Mock Data (will be replaced with real DB data later) ─────────────
const initialMockKits = [
  { id: 1, brand: "Bandai", grade: "MGEX", name: "MGEX Strike Freedom Gundam", status: "completed", price: 1180, source: "Oh My Gundam" },
  { id: 2, brand: "Daban", grade: "MG", name: "Strike Freedom Gundam 8802", status: "completed", price: 288, source: "Shopee" },
  { id: 3, brand: "Fenrir", grade: "1/100", name: "Nightingale Fenrir 1/100", status: "in-progress", price: 950, source: "Pre-order" },
  { id: 4, brand: "Suyata", grade: "Non-Scale", name: "Suyata Knight of Fire", status: "completed", price: 145, source: "Hobbylink Japan" },
  { id: 5, brand: "Bandai", grade: "HG", name: "HG Calibarn", status: "completed", price: 85, source: "Gundam Place" },
  { id: 6, brand: "Bandai", grade: "HG", name: "HG Lfrith Ur", status: "backlog", price: 75, source: "Shopee" },
  { id: 7, brand: "Bandai", grade: "MG", name: "MG Barbatos", status: "backlog", price: 230, source: "Oh My Gundam" },
  { id: 8, brand: "Bandai", grade: "RG", name: "RG God Gundam", status: "backlog", price: 165, source: "Gundam Place" },
  { id: 9, brand: "Bandai", grade: "RG", name: "RG Wing Gundam Zero EW", status: "completed", price: 140, source: "Shopee" },
  { id: 10, brand: "Bandai", grade: "PG", name: "PG Unleashed RX-78-2", status: "in-progress", price: 1350, source: "Hobbylink Japan" },
  { id: 11, brand: "Bandai", grade: "HG", name: "HG Aerial", status: "completed", price: 65, source: "Shopee" },
  { id: 12, brand: "Bandai", grade: "HG", name: "HG Schwarzette", status: "backlog", price: 72, source: "Gundam Place" },
  { id: 13, brand: "Bandai", grade: "MG", name: "MG Eclipse Gundam", status: "backlog", price: 260, source: "Oh My Gundam" },
  { id: 14, brand: "Bandai", grade: "HG", name: "HG Beguir-Beu", status: "completed", price: 60, source: "Shopee" },
  { id: 15, brand: "Bandai", grade: "HG", name: "HG Darilbalde", status: "backlog", price: 68, source: "Shopee" },
  { id: 16, brand: "Bandai", grade: "HG", name: "HG Pharact", status: "backlog", price: 70, source: "Oh My Gundam" },
  { id: 17, brand: "Bandai", grade: "HG", name: "HG Michaelis", status: "completed", price: 65, source: "Shopee" },
  { id: 18, brand: "Bandai", grade: "HG", name: "HG Gundam Lfrith", status: "backlog", price: 62, source: "Gundam Place" },
  { id: 19, brand: "Daban", grade: "MG", name: "Daban Sinanju Stein 6655S", status: "backlog", price: 298, source: "Shopee" },
  { id: 20, brand: "Bandai", grade: "HG", name: "HG Zowort Heavy", status: "backlog", price: 78, source: "Oh My Gundam" },
  { id: 21, brand: "Bandai", grade: "HG", name: "HG Typhoeus", status: "backlog", price: 85, source: "Shopee" },
  { id: 22, brand: "Bandai", grade: "HG", name: "HG Heindree", status: "backlog", price: 55, source: "Shopee" },
  { id: 23, brand: "Fenrir", grade: "1/100", name: "Fenrir Sazabi Ver. Ka", status: "in-progress", price: 380, source: "Pre-order" },
  { id: 24, brand: "Bandai", grade: "MG", name: "MG Exia", status: "completed", price: 210, source: "Oh My Gundam" },
];

// ─── Status filter options ────────────────────────────────────────────────────
const STATUS_FILTERS = ["all", "backlog", "in-progress", "completed"] as const;

export default function CollectionPage() {
  const [kits, setKits] = useState(initialMockKits);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKit, setSelectedKit] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleAddKit = (newKit: any) => {
    setKits((prev) => [newKit, ...prev]);
    setToastMessage(`${newKit.name} added to your collection`);
  };

  const handleEditKit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (updatedKit: any) => {
    setKits((prev) => prev.map((k) => (k.id === updatedKit.id ? updatedKit : k)));
    setIsEditing(false);
    setSelectedKit(updatedKit);
    setToastMessage("Kit updated");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteKitConfirm = (kitToDelete: any) => {
    setKits((prev) => prev.filter((k) => k.id !== kitToDelete.id));
    setIsDeleting(false);
    setSelectedKit(null);
    setToastMessage("Kit removed from collection");
  };

  // Compute status counts from mock data
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: kits.length };
    kits.forEach((kit) => {
      counts[kit.status] = (counts[kit.status] || 0) + 1;
    });
    return counts;
  }, [kits]);

  // Compute grade/scale counts dynamically from mock data
  const gradeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    kits.forEach((kit) => {
      counts[kit.grade] = (counts[kit.grade] || 0) + 1;
    });
    // Sort by count descending
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [kits]);

  // Filter kits by status and search query
  const filteredKits = useMemo(() => {
    return kits.filter((kit) => {
      const matchesStatus = activeFilter === "all" || kit.status === activeFilter;
      const matchesSearch =
        searchQuery === "" ||
        kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kit.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kit.grade.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const getFilterLabel = (filter: string) => {
    if (filter === "all") return "All";
    return STATUS_CONFIG[filter]?.label || filter;
  };

  return (
    <div className="collection-container">
      {/* ── Header Section ──────────────────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p style={{ color: "#8b949e", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", margin: 0, marginBottom: 4 }}>
            Inventory
          </p>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: "bold", margin: 0 }}>My Collection</h1>
        </div>
        <button className="collection-add-btn" onClick={() => setIsModalOpen(true)}>
          <i className="bi bi-plus-lg"></i> Add Kit
        </button>
      </div>

      {/* ── Status Filter Pills ─────────────────────────────────────────── */}
      <div className="collection-filter-pills">
        {STATUS_FILTERS.map((filter) => (
          <div
            key={filter}
            className="collection-pill"
          >
            {getFilterLabel(filter)} <span className="collection-pill-count">{statusCounts[filter] || 0}</span>
          </div>
        ))}
      </div>

      {/* ── Grades & Scales Section ─────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: "#8b949e", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", margin: "0 0 12px 0" }}>
          Grades & Scales
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "16px" }}>
          {gradeCounts.map(([grade, count]) => (
            <div key={grade} className="app-card collection-grade-card" style={{ padding: "16px" }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="app-card-icon-wrapper" style={{ width: 24, height: 24, borderRadius: 6 }}>
                  <i className="bi bi-box-seam" style={{ color: "#3fb950", fontSize: 11 }}></i>
                </div>
                <span style={{ color: "#8b949e", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>{grade}</span>
              </div>
              <div style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>{count}</div>
              <div style={{ color: "#8b949e", fontSize: 11 }}>kits owned</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Table Section ───────────────────────────────────────────────── */}
      <div className="app-card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Table toolbar */}
        <div className="collection-table-toolbar">
          <div className="collection-table-tabs">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter}
                className={`collection-table-tab ${activeFilter === filter ? "collection-table-tab-active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {getFilterLabel(filter)}
              </button>
            ))}
          </div>
          <div className="collection-search-wrapper">
            <i className="bi bi-search" style={{ color: "#8b949e", fontSize: 14 }}></i>
            <input
              type="text"
              placeholder="Search kits..."
              className="collection-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <table className="app-table">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Scale / Grade</th>
              <th>Kit Name</th>
              <th>Status</th>
              <th>Price</th>
              <th>Source</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredKits.map((kit) => {
              const statusConfig = STATUS_CONFIG[kit.status] || STATUS_CONFIG["backlog"];
              return (
                <tr key={kit.id} className="collection-table-row" onClick={() => setSelectedKit(kit)} style={{ cursor: "pointer" }}>
                  <td style={{ fontWeight: "bold" }}>{kit.brand}</td>
                  <td>
                    <span className="collection-grade-badge">{kit.grade}</span>
                  </td>
                  <td>{kit.name}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.color,
                        border: `1px solid ${statusConfig.border}`,
                      }}
                    >
                      {statusConfig.label}
                    </span>
                  </td>
                  <td style={{ color: "#8b949e" }}>RM {kit.price.toLocaleString()}</td>
                  <td style={{ color: "#8b949e" }}>{kit.source}</td>
                  <td>
                    <span
                      className="collection-view-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedKit(kit);
                      }}
                    >
                      View
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Add Kit Modal ──────────────────────────────────────────────── */}
      <AddKitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddKit}
      />

      {/* ── View Kit Modal ─────────────────────────────────────────────── */}
      <ViewKitModal
        isOpen={!!selectedKit && !isEditing && !isDeleting}
        onClose={() => setSelectedKit(null)}
        onEdit={handleEditKit}
        onDelete={() => setIsDeleting(true)}
        kit={selectedKit}
      />

      {/* ── Edit Kit Modal ─────────────────────────────────────────────── */}
      <EditKitModal
        isOpen={!!selectedKit && isEditing}
        onClose={handleCancelEdit}
        onSave={handleSaveEdit}
        kit={selectedKit}
      />

      {/* ── Delete Confirm Modal ─────────────────────────────────────── */}
      <DeleteConfirmModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDeleteKitConfirm}
        item={selectedKit}
      />

      {/* ── Toast Notification ─────────────────────────────────────────── */}
      {toastMessage && (
        <div className="global-toast">
          <i className="bi bi-check-circle-fill text-success"></i>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
