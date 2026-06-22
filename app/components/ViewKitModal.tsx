"use client";

import React, { useState, useEffect } from "react";
import { STATUS_CONFIG } from "@/app/constants/status";
import "@/app/(site)/collection/collection.css";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";
import { useModalState } from "@/app/hooks/useModalState";

interface ViewKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  kit: any | null;
}

// Helper to generate mock data based on status since our mock list is basic
const getMockDetails = (kit: any) => {
  if (!kit) return {};

  const baseDate = kit.purchaseDate || "2026-01-25";

  if (kit.status === "completed") {
    return {
      buildStarted: "30-01-2026",
      buildFinished: "16-03-2026",
      totalBuildTime: "38:00:00",
      phasesLogged: 4,
      buildTimeBreakdown: [
        { phase: "Part Nipping & Cleaning", time: "09:00:00", percentage: "24%" },
        { phase: "Limb/Sub-Assembly", time: "18:00:00", percentage: "47%" },
        { phase: "Panel Lining", time: "06:00:00", percentage: "16%" },
        { phase: "Decals & Top Coat", time: "05:00:00", percentage: "13%" },
      ],
      buildDiary: [
        { date: "1/27/2026, 11:19:29 PM", content: "Cracked the box open. The amount of plating runners is unreal." },
        { date: "2/8/2026, 1:06:09 PM", content: "Inner frame done - light-up units snap in like Lego." },
        { date: "2/14/2026, 7:59:29 AM", content: "Started panel lining. Tamiya Black on white plating is chef's kiss." },
        { date: "2/20/2026, 2:52:49 AM", content: "Inner frame is insane - light-up runners worth every ringgit." },
      ]
    };
  }

  if (kit.status === "in-progress") {
    return {
      buildStarted: "25-04-2026",
      buildFinished: "— in progress —",
      totalBuildTime: "14:00:00",
      phasesLogged: 2,
      buildTimeBreakdown: [
        { phase: "Part Nipping & Cleaning", time: "06:00:00", percentage: "43%" },
        { phase: "Limb/Sub-Assembly", time: "08:00:00", percentage: "57%" },
      ],
      buildDiary: [
        { date: "5/17/2026, 10:12:49 PM", content: "Nipping took 2 sessions. Sheer volume of parts." },
        { date: "5/23/2026, 5:06:09 PM", content: "Funnels alignment is the bane of my existence." },
      ]
    };
  }

  return {}; // Backlog has no extra details
};

export default function ViewKitModal({ isOpen, onClose, onEdit, onDelete, kit: propKit }: ViewKitModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "logs">("details");
  const { isRendered, isClosing } = useModalState(isOpen);
  const [cachedKit, setCachedKit] = useState(propKit);

  useEffect(() => {
    if (propKit) setCachedKit(propKit);
  }, [propKit]);

  useEscapeKey(() => {
    if (isOpen) onClose();
  }, isOpen);

  const kit = propKit || cachedKit;

  if (!isRendered || !kit) return null;

  const statusConfig = STATUS_CONFIG[kit.status] || STATUS_CONFIG["backlog"];
  const details = getMockDetails(kit);

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`} onClick={onClose}>
      <div className={`modal-container view-modal-container ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header align-items-start">
          <div className="d-flex flex-column gap-1">
            <h2 className="modal-title">{kit.name}</h2>
            <div className="modal-subtitle-text">{kit.brand} · {kit.grade}</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="view-delete-btn" onClick={() => onDelete()}>
              <i className="bi bi-trash modal-icon-sm"></i> Remove Kit
            </button>
            <div>
              <button className="modal-cancel-btn me-2" onClick={onClose}>
                Close
              </button>
              <button className="modal-submit-btn" onClick={() => onEdit()}>
                <i className="bi bi-pencil-square modal-icon-md"></i> Edit Details
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="view-modal-body">
          <div className="view-top-section">
            {/* Box Art */}
            <div className="view-box-art">
              {kit.boxArtUrl ? (
                <img src={kit.boxArtUrl} alt="Box Art" />
              ) : (
                <div className="view-box-art-placeholder">BOX ART<br/>MOCKUP</div>
              )}
            </div>

            {/* Info Grid */}
            <div className="view-info-grid">
              <div className="view-info-card">
                <div className="view-info-label">PRICE PAID</div>
                <div className="view-info-value">RM {kit.price?.toLocaleString() || "0"}</div>
              </div>
              <div className="view-info-card">
                <div className="view-info-label">STATUS</div>
                <div>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      backgroundColor: statusConfig.bg,
                      color: statusConfig.color,
                      border: `1px solid ${statusConfig.border}`,
                      textTransform: "uppercase"
                    }}
                  >
                    {statusConfig.label}
                  </span>
                </div>
              </div>
              <div className="view-info-card">
                <div className="view-info-label">PURCHASE DATE</div>
                <div className="view-info-value">{kit.purchaseDate || "15-05-2026"}</div>
              </div>
              <div className="view-info-card">
                <div className="view-info-label">SOURCE</div>
                <div className="view-info-value">{kit.source || "Unknown"}</div>
              </div>

              {kit.status !== "backlog" && (
                <>
                  <div className="view-info-card">
                    <div className="view-info-label">BUILD STARTED</div>
                    <div className="view-info-value">{details.buildStarted}</div>
                  </div>
                  <div className="view-info-card">
                    <div className="view-info-label">BUILD FINISHED</div>
                    <div className="view-info-value" style={{ fontStyle: kit.status === "in-progress" ? "italic" : "normal", color: kit.status === "in-progress" ? "#8b949e" : "#fff" }}>
                      {details.buildFinished}
                    </div>
                  </div>
                  <div className="view-info-card">
                    <div className="view-info-label">TOTAL BUILD TIME</div>
                    <div className="view-info-value">{details.totalBuildTime}</div>
                  </div>
                  <div className="view-info-card">
                    <div className="view-info-label">PHASES LOGGED</div>
                    <div className="view-info-value">{details.phasesLogged}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {kit.status !== "backlog" && (
            <>
              {/* Build Time Breakdown */}
              <div className="view-section">
                <h3 className="view-section-title">BUILD TIME BREAKDOWN</h3>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th className="view-table-header-left">PHASE</th>
                      <th className="view-table-header-right view-table-col-100">TIME</th>
                      <th className="view-table-header-right view-table-col-60">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.buildTimeBreakdown?.map((phase: any, idx: number) => (
                      <tr key={idx}>
                        <td>{phase.phase}</td>
                        <td className="view-table-cell-right">{phase.time}</td>
                        <td className="view-table-cell-right text-muted">{phase.percentage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Build Diary */}
              <div className="view-section">
                <h3 className="view-section-title">BUILD DIARY</h3>
                <div className="view-diary-container">
                  <div className="view-diary-list">
                    {details.buildDiary?.map((note: any, idx: number) => (
                      <div key={idx} className="view-diary-note">
                        <div className="view-diary-date">{note.date}</div>
                        <div className="view-diary-content">{note.content}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick diary input only for in-progress or if you want it everywhere */}
                  <div className="view-diary-input-wrapper">
                    <input type="text" placeholder="Quick diary note..." className="view-diary-input" />
                    <button className="view-diary-add-btn">Add</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
