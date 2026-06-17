"use client";

import React from "react";
import { STATUS_CONFIG } from "@/app/constants/status";
import "@/app/(site)/collection/collection.css";

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

export default function ViewKitModal({ isOpen, onClose, onEdit, onDelete, kit }: ViewKitModalProps) {
  if (!isOpen || !kit) return null;

  const statusConfig = STATUS_CONFIG[kit.status] || STATUS_CONFIG["backlog"];
  const details = getMockDetails(kit);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container view-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="view-modal-header">
          <div>
            <h2 className="view-modal-title">{kit.name}</h2>
            <div className="view-modal-subtitle">{kit.brand} - {kit.grade}</div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button className="view-btn-edit" onClick={onEdit}>
              <i className="bi bi-pencil" style={{ marginRight: 6 }}></i> Edit
            </button>
            <button className="view-btn-delete" onClick={onDelete}>
              <i className="bi bi-trash3" style={{ marginRight: 6 }}></i> Delete
            </button>
            <button className="modal-close-btn" style={{ marginLeft: 8 }} onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
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
                <table className="view-breakdown-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>PHASE</th>
                      <th style={{ textAlign: "right", width: "100px" }}>TIME</th>
                      <th style={{ textAlign: "right", width: "60px" }}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.buildTimeBreakdown?.map((phase: any, idx: number) => (
                      <tr key={idx}>
                        <td>{phase.phase}</td>
                        <td style={{ textAlign: "right" }}>{phase.time}</td>
                        <td style={{ textAlign: "right", color: "#8b949e" }}>{phase.percentage}</td>
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
