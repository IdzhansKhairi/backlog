"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { STATUS_CONFIG } from "@/app/constants/status";
import "./workbench.css";

// ─── Mock Data ───────────────────────────────────────────────────────────────
type KitStatus = "backlog" | "in-progress" | "completed";
interface MockKit {
  id: number;
  name: string;
  brand: string;
  grade: string;
  status: KitStatus;
}

const initialKits: MockKit[] = [
  { id: 1, name: "RG Nu Gundam Ver. Ka", brand: "Bandai", grade: "RG", status: "in-progress" },
  { id: 2, name: "Motor Nuclear MN Q03 Astray Red", brand: "Motor Nuclear", grade: "1/100", status: "backlog" },
  { id: 3, name: "Frame Arms Girl Stylet XF-3", brand: "Kotobukiya", grade: "Non-Scale", status: "backlog" },
  { id: 4, name: "PG Unleashed RX-78-2", brand: "Bandai", grade: "PG", status: "backlog" },
  { id: 5, name: "RG Sazabi", brand: "Bandai", grade: "RG", status: "backlog" },
  { id: 6, name: "MG Wing Zero EW Ver. Ka", brand: "Bandai", grade: "MG", status: "in-progress" },
  { id: 7, name: "Daban Sinanju Stein 6655S", brand: "Daban", grade: "MG", status: "backlog" },
  { id: 8, name: "Fenrir Sazabi Ver. Ka", brand: "Bandai", grade: "MG", status: "backlog" },
  { id: 9, name: "HG Build Fighter #16", brand: "Bandai", grade: "HG", status: "backlog" },
  { id: 10, name: "HG Build Fighter #17", brand: "Bandai", grade: "HG", status: "backlog" },
  { id: 11, name: "HG Build Fighter #19", brand: "Bandai", grade: "HG", status: "backlog" },
  { id: 12, name: "HG Build Fighter #20", brand: "Bandai", grade: "HG", status: "backlog" },
  { id: 13, name: "HG Build Fighter #22", brand: "Bandai", grade: "HG", status: "backlog" },
  { id: 14, name: "HG Build Fighter #23", brand: "Bandai", grade: "HG", status: "backlog" },
];

const PHASES = [
  "Part Nipping & Cleaning",
  "Limb/Sub-Assembly",
  "Panel Lining",
  "Decals & Top Coat",
] as const;
type Phase = typeof PHASES[number];

interface DiaryEntry {
  id: string;
  timestamp: Date;
  text: string;
}

const mockEntries: DiaryEntry[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 86400000 * 2),
    text: "Started nipping the leg frame parts. The undergates are a bit tricky on the inner frame, but the plastic quality is solid. Using the GodHand nippers makes a huge difference.",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 86400000),
    text: "Finished both legs and the waist. The articulation is insane! Tomorrow I'll start on the torso and arms.",
  }
];

const formatTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export default function WorkbenchPage() {
  const [kits, setKits] = useState(initialKits);
  const [selectedKitId, setSelectedKitId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [timerState, setTimerState] = useState<"idle" | "running" | "paused">("idle");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [activePhase, setActivePhase] = useState<Phase>(PHASES[0]);
  const [phaseTimes, setPhaseTimes] = useState<Record<Phase, number>>({
    "Part Nipping & Cleaning": 0,
    "Limb/Sub-Assembly": 0,
    "Panel Lining": 0,
    "Decals & Top Coat": 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [diaryNote, setDiaryNote] = useState("");
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(mockEntries);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const selectedKit = selectedKitId ? kits.find((k) => k.id === selectedKitId)! : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tick = useCallback(() => {
    setTotalSeconds((prev) => prev + 1);
    setPhaseTimes((prev) => ({
      ...prev,
      [activePhase]: prev[activePhase] + 1,
    }));
  }, [activePhase]);

  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState, tick]);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  const handleStart = () => {
    setTimerState("running");
    if (selectedKitId) {
      setKits(prev => prev.map(k => k.id === selectedKitId ? { ...k, status: "in-progress" } : k));
    }
  };
  
  const handlePause = () => setTimerState("paused");

  const handleFinishBuild = () => {
    if (!selectedKit) return;
    setTimerState("idle");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setToastMessage(`${selectedKit.name} marked as Completed 🎉`);
    
    setKits(prev => prev.map(k => k.id === selectedKitId ? { ...k, status: "completed" } : k));
    
    setTotalSeconds(0);
    setPhaseTimes({
      "Part Nipping & Cleaning": 0,
      "Limb/Sub-Assembly": 0,
      "Panel Lining": 0,
      "Decals & Top Coat": 0,
    });
    setActivePhase(PHASES[0]);
    setSelectedKitId(null);
  };

  const handleSelectKit = (kitId: number) => {
    setSelectedKitId(kitId);
    setIsDropdownOpen(false);
  };

  const handleAppendEntry = () => {
    if (!diaryNote.trim()) return;
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      text: diaryNote,
    };
    setDiaryEntries([newEntry, ...diaryEntries]);
    setDiaryNote("");
  };

  const renderStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    if (!config) return null;
    return (
      <span className="kit-status-badge" style={{ backgroundColor: config.bg, color: config.color }}>
        {config.label}
      </span>
    );
  };

  const isRunning = timerState === "running";

  return (
    <div className="workbench-container">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="workbench-header d-flex align-items-center">
        <div className="workbench-header-left">
          <div className="workbench-subtitle">Active Build Zone</div>
          <h1 className="workbench-title">Workbench</h1>
        </div>

        <div className="kit-selector" ref={dropdownRef}>
          <button
            className="kit-selector-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedKit ? (
              <div className="d-flex align-items-center gap-2">
                {selectedKit.name} - {selectedKit.grade}
                {renderStatusBadge(selectedKit.status)}
              </div>
            ) : (
              "Select a kit..."
            )}
            <i className={`bi bi-chevron-down kit-selector-chevron ${isDropdownOpen ? "open" : ""}`}></i>
          </button>

          {isDropdownOpen && (
            <div className="kit-dropdown">
              {kits.filter(k => k.status !== "completed").map((kit) => (
                <div
                  key={kit.id}
                  className={`kit-dropdown-item ${selectedKitId === kit.id ? "selected" : ""}`}
                  onClick={() => handleSelectKit(kit.id)}
                >
                  <div className="kit-dropdown-item-left">
                    <span>{kit.name} - {kit.grade}</span>
                    {renderStatusBadge(kit.status)}
                  </div>
                  <div className="kit-dropdown-item-right">
                    {selectedKitId === kit.id && <i className="bi bi-check2" style={{ color: "#c9d1d9", fontSize: "16px" }}></i>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Dashboard Grid ────────────────────────────────────────────── */}
      <div className="workbench-grid">
        {/* ── Left Column: Active Build ────────────────────────────────────── */}
        <div className="workbench-main-col">
          {/* ── Timer Card ───────────────────────────────────────────────────── */}
      <div className={`app-card timer-card ${isRunning ? "recording" : ""}`}>
        <div className="timer-building-label">
          {selectedKit ? `CURRENTLY BUILDING · ${selectedKit.brand.toUpperCase()} ${selectedKit.grade}` : "NO KIT SELECTED"}
        </div>
        <div className="timer-kit-name">{selectedKit ? selectedKit.name : "—"}</div>

        <div className={`timer-display ${isRunning ? "running" : ""}`}>
          {formatTime(totalSeconds)}
        </div>
        
        <div className={`timer-session-label ${isRunning ? "running" : ""}`}>
          Session timer · {timerState === "running" ? "RECORDING" : timerState === "paused" ? "PAUSED" : "Idle"}
        </div>

        <div className="timer-actions">
          {isRunning ? (
            <button className="btn-timer-start" onClick={handlePause}>
              <i className="bi bi-pause-fill"></i> Pause
            </button>
          ) : (
            <button className="btn-timer-start" onClick={handleStart} disabled={!selectedKit}>
              <i className="bi bi-play-fill"></i> Start
            </button>
          )}
          <button className="btn-timer-finish" onClick={() => setIsFinishModalOpen(true)} disabled={!selectedKit}>
            <i className="bi bi-flag-fill"></i> Finish Build
          </button>
        </div>
      </div>
        </div>

        {/* ── Right Column: Phase Tracker ──────────────────────────────────── */}
        <div className="workbench-side-col">
          {/* ── Phase Tracker ────────────────────────────────────────────────── */}
          <div className="app-card">
        <h2 className="phase-tracker-title">Phase Tracker</h2>

        <div className="phase-pills">
          {PHASES.map((phase) => (
            <button
              key={phase}
              className={`phase-pill ${activePhase === phase ? "active" : ""}`}
              onClick={() => setActivePhase(phase)}
            >
              <span>{phase}</span>
              {activePhase === phase && <i className="bi bi-chevron-right"></i>}
            </button>
          ))}
        </div>

        <table className="app-table">
          <thead>
            <tr>
              <th>PHASE</th>
              <th className="text-end">TIME LOGGED</th>
            </tr>
          </thead>
          <tbody>
            {PHASES.map((phase) => {
              const isLive = isRunning && activePhase === phase;
              return (
                <tr key={phase}>
                  <td>
                    <span className={activePhase === phase ? "phase-name" : "phase-name-idle"}>
                      {phase}
                    </span>
                    {isLive && (
                      <span className="live-badge">
                        <span className="live-dot"></span> LIVE
                      </span>
                    )}
                  </td>
                  <td className="text-end">
                    <span className="time-logged">{formatTime(phaseTimes[phase])}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
        </div>
      </div>

      {/* ── Bottom Section: Build Diary ──────────────────────────────────── */}
      <div className="app-card build-diary-card mt-4">
        <h2 className="build-diary-title">
          <i className="bi bi-journal-text me-2"></i> Build Diary Notes
        </h2>
        
        <div className="build-diary-input-area">
          <textarea
            className="diary-textarea"
            placeholder="Paint recipes, joint issues, decal placement notes..."
            value={diaryNote}
            onChange={(e) => setDiaryNote(e.target.value)}
          ></textarea>
          <div className="d-flex justify-content-end">
            <button className="btn-append-entry" onClick={handleAppendEntry}>
              Append Entry
            </button>
          </div>
        </div>

        <div className="diary-entries">
          {diaryEntries.length > 0 ? (
            diaryEntries.map((entry) => (
              <div key={entry.id} className="diary-entry-card">
                <div className="diary-entry-header">
                  <span>{entry.timestamp.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>{entry.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="diary-entry-content">{entry.text}</div>
              </div>
            ))
          ) : (
            <div className="empty-diary">No diary entries yet for this kit.</div>
          )}
        </div>
        </div>

      {/* ── Finish Build Modal ────────────────────────────────────────────── */}
      {isFinishModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setIsFinishModalOpen(false)}>
          <div className="modal-container" style={{ width: 440, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#fff", margin: "0 0 16px 0", fontSize: 18 }}>Finish Build?</h3>
            <p style={{ color: "#c9d1d9", fontSize: 14, margin: "0 0 24px 0", lineHeight: 1.5 }}>
              Are you sure you want to finish building <strong>{selectedKit?.name}</strong>? This will mark the kit as completed and reset the timer.
            </p>
            <div className="d-flex justify-content-end gap-3">
              <button style={{ background: "transparent", border: "1px solid #30363d", color: "#c9d1d9", padding: "8px 16px", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }} onClick={() => setIsFinishModalOpen(false)}>
                Cancel
              </button>
              <button style={{ background: "#da3633", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }} onClick={() => { setIsFinishModalOpen(false); handleFinishBuild(); }}>
                Yes, Finish Build
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="global-toast">
          <i className="bi bi-check-circle-fill text-success"></i>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
