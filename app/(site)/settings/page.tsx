"use client";

import React, { useState, useEffect } from "react";
import "./settings.css";

type TabKey = "Profile" | "Brands" | "Grades & Scales" | "Retailers";

interface ListItem {
  id: string;
  name: string;
  inUse: number;
  isSystem: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("Profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Form State
  const initialProfile = {
    fullName: "Hans Tan",
    nickname: "Hans",
    username: "hans_builds",
    email: "hans@plamolog.app",
    newPassword: "",
    confirmPassword: "",
  };
  const [profile, setProfile] = useState(initialProfile);

  // Computed values
  const isChanged = JSON.stringify(profile) !== JSON.stringify(initialProfile);
  const passwordMismatch =
    profile.newPassword !== "" &&
    profile.confirmPassword !== "" &&
    profile.newPassword !== profile.confirmPassword;

  const canSave = isChanged && !passwordMismatch;

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setProfile(initialProfile);
  };

  const handleSave = () => {
    if (!canSave) return;
    setToastMessage("Profile updated successfully!");
    // In a real app, you would make an API call here.
    // For now, let's just reset the form to the new state (excluding passwords)
    // Actually, to simulate success, we can just clear passwords and keep changes.
    setProfile(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
  };

  // Mock Data for Lists
  const [brands, setBrands] = useState<ListItem[]>([
    { id: "1", name: "Bandai", inUse: 16, isSystem: true },
    { id: "2", name: "Daban", inUse: 3, isSystem: true },
    { id: "3", name: "Fenrir", inUse: 3, isSystem: true },
    { id: "4", name: "Motor Nuclear", inUse: 1, isSystem: true },
    { id: "5", name: "Kotobukiya", inUse: 1, isSystem: true },
    { id: "6", name: "Suyata", inUse: 6, isSystem: true },
    { id: "7", name: "Other", inUse: 2, isSystem: true },
    { id: "8", name: "My Custom Brand", inUse: 0, isSystem: false },
  ]);

  const [grades, setGrades] = useState<ListItem[]>([
    { id: "1", name: "MGEX", inUse: 1, isSystem: true },
    { id: "2", name: "MG", inUse: 4, isSystem: true },
    { id: "3", name: "RG", inUse: 2, isSystem: true },
    { id: "4", name: "HG", inUse: 12, isSystem: true },
    { id: "5", name: "PG", inUse: 2, isSystem: true },
    { id: "6", name: "1/100", inUse: 3, isSystem: true },
    { id: "7", name: "1/144", inUse: 0, isSystem: true },
    { id: "8", name: "Non-Scale", inUse: 5, isSystem: true },
  ]);

  const [retailers, setRetailers] = useState<ListItem[]>([
    { id: "1", name: "Shopee", inUse: 18, isSystem: true },
    { id: "2", name: "Oh My Gundam", inUse: 4, isSystem: true },
    { id: "3", name: "Hobbylink Japan", inUse: 2, isSystem: true },
    { id: "4", name: "Amiami", inUse: 2, isSystem: true },
    { id: "5", name: "USA Gundam Store", inUse: 1, isSystem: true },
    { id: "6", name: "Pre-order", inUse: 2, isSystem: true },
    { id: "7", name: "Physical shop", inUse: 0, isSystem: true },
    { id: "8", name: "Local Hobby Store", inUse: 0, isSystem: false },
  ]);

  const [newItemName, setNewItemName] = useState("");
  const [editingItem, setEditingItem] = useState<ListItem | null>(null);
  const [editItemName, setEditItemName] = useState("");
  const [deletingItem, setDeletingItem] = useState<{ listType: TabKey, item: ListItem } | null>(null);

  const handleAddListItem = (listType: TabKey) => {
    if (!newItemName.trim()) return;
    const newItem: ListItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      inUse: 0,
      isSystem: false,
    };

    if (listType === "Brands") setBrands([newItem, ...brands]);
    if (listType === "Grades & Scales") setGrades([newItem, ...grades]);
    if (listType === "Retailers") setRetailers([newItem, ...retailers]);

    setNewItemName("");
    setToastMessage(`"${newItemName}" added!`);
  };

  const confirmDelete = () => {
    if (!deletingItem) return;
    const { listType, item } = deletingItem;
    if (listType === "Brands") setBrands(brands.filter(b => b.id !== item.id));
    if (listType === "Grades & Scales") setGrades(grades.filter(g => g.id !== item.id));
    if (listType === "Retailers") setRetailers(retailers.filter(r => r.id !== item.id));
    setToastMessage(`"${item.name}" deleted!`);
    setDeletingItem(null);
  };

  const handleEditItem = (item: ListItem) => {
    setEditingItem(item);
    setEditItemName(item.name);
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editItemName.trim() || editItemName.trim() === editingItem.name) {
      setEditingItem(null);
      return;
    }

    const newName = editItemName.trim();
    const updateList = (list: ListItem[]) => list.map(item => item.id === editingItem.id ? { ...item, name: newName } : item);

    if (activeTab === "Brands") setBrands(updateList(brands));
    if (activeTab === "Grades & Scales") setGrades(updateList(grades));
    if (activeTab === "Retailers") setRetailers(updateList(retailers));

    setToastMessage(`"${editingItem.name}" updated to "${newName}"!`);
    setEditingItem(null);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "v1.0.0";

  return (
    <div className="settings-container">
      {/* ── Header & Tabs ── */}
      <div className="settings-header">
        <div className="settings-title-wrapper">
          <h1 className="settings-title">Settings</h1>
          <span className="version-pill">{appVersion}</span>
        </div>
        <p className="settings-subtitle">Manage your profile and the lists used across PlamoLog.</p>
      </div>

      <div className="settings-tabs">
        <button className={`settings-tab ${activeTab === "Profile" ? "active" : ""}`} onClick={() => setActiveTab("Profile")}>
          <i className="bi bi-person"></i> Profile
        </button>
        <button className={`settings-tab ${activeTab === "Brands" ? "active" : ""}`} onClick={() => setActiveTab("Brands")}>
          <i className="bi bi-tags"></i> Brands
        </button>
        <button className={`settings-tab ${activeTab === "Grades & Scales" ? "active" : ""}`} onClick={() => setActiveTab("Grades & Scales")}>
          <i className="bi bi-rulers"></i> Grades & Scales
        </button>
        <button className={`settings-tab ${activeTab === "Retailers" ? "active" : ""}`} onClick={() => setActiveTab("Retailers")}>
          <i className="bi bi-shop"></i> Retailers
        </button>
      </div>

      <div className="settings-content">
        {/* ── PROFILE TAB ── */}
        {activeTab === "Profile" && (
          <div className="profile-card">
            <div className="profile-form-grid">
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input type="text" name="fullName" className="form-input" value={profile.fullName} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Nickname</label>
                <input type="text" name="nickname" className="form-input" value={profile.nickname} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input type="text" name="username" className="form-input" value={profile.username} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-input" value={profile.email} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label className="form-label">New password</label>
                <input type="password" name="newPassword" className="form-input" placeholder="Leave blank to keep current" value={profile.newPassword} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm new password</label>
                <input type="password" name="confirmPassword" className="form-input" placeholder="Confirm your new password" value={profile.confirmPassword} onChange={handleProfileChange} />
                {passwordMismatch && <span className="password-warning"><i className="bi bi-exclamation-triangle-fill"></i> Passwords do not match</span>}
                {!passwordMismatch && profile.newPassword !== "" && profile.confirmPassword !== "" && (
                  <span className="password-match"><i className="bi bi-check-circle-fill"></i> Passwords match</span>
                )}
              </div>
            </div>

            <div className="settings-actions">
              <button className="btn-reset" onClick={handleReset} disabled={!isChanged}>Reset</button>
              <button className="btn-save" onClick={handleSave} disabled={!canSave}>Save changes</button>
            </div>
          </div>
        )}

        {/* ── LISTS TABS ── */}
        {activeTab !== "Profile" && (
          <div className="list-card">
            <div className="list-header-block">
              <h2 className="list-title">{activeTab}</h2>
              <p className="list-desc">Renaming an item updates every record using it. Deleting is blocked while an item is in use.</p>
            </div>

            <div className="add-row">
              <input
                type="text"
                className="add-input"
                placeholder={`New ${activeTab.toLowerCase().replace(' & scales', ' grade')}...`}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddListItem(activeTab) }}
              />
              <button className="btn-add" onClick={() => handleAddListItem(activeTab)} disabled={!newItemName.trim()}>
                <i className="bi bi-plus-lg"></i> Add
              </button>
            </div>

            <table className="settings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="col-in-use">In use</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === "Brands" ? brands : activeTab === "Grades & Scales" ? grades : retailers).map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="col-in-use">{item.inUse}</td>
                    <td className="col-actions">
                      {!item.isSystem ? (
                        <div className="action-btns">
                          <button className="action-btn" title="Edit" onClick={() => handleEditItem(item)}><i className="bi bi-pencil"></i></button>
                          <button
                            className="action-btn delete"
                            title={item.inUse > 0 ? "Cannot delete item in use" : "Delete"}
                            disabled={item.inUse > 0}
                            style={{ opacity: item.inUse > 0 ? 0.3 : 1, cursor: item.inUse > 0 ? "not-allowed" : "pointer" }}
                            onClick={() => { if (item.inUse === 0) setDeletingItem({ listType: activeTab, item }) }}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="action-btns"></div> // No icons for system items
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="backlog-toast">
          <i className="bi bi-check-circle-fill backlog-toast-icon"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Rename Modal ── */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ width: 440, padding: 24, borderRadius: 12, background: "#161b22", border: "1px solid #30363d" }}>
            <div className="modal-header d-flex align-items-center justify-content-between" style={{ alignItems: "flex-start", marginBottom: 20 }}>
              <h2 className="modal-title" style={{ fontSize: 18, color: "#fff", margin: 0 }}>
                Rename {activeTab === "Brands" ? "brand" : activeTab === "Grades & Scales" ? "grade" : "retailer"}
              </h2>
              <button className="modal-close-btn" onClick={() => setEditingItem(null)} style={{ background: "transparent", border: "none", color: "#8b949e", cursor: "pointer" }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-field" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="modal-label" style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>New name</label>
                <input
                  type="text"
                  className="modal-input"
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit() }}
                  style={{ background: "#0d1117", border: "1px solid #f28123", borderRadius: 6, color: "#fff", padding: "10px 14px", outline: "none" }}
                  autoFocus
                />
              </div>
              <p style={{ color: "#8b949e", fontSize: 13, marginTop: 12, marginBottom: 0 }}>
                Existing records using "{editingItem.name}" will be updated.
              </p>
            </div>

            <div className="modal-footer" style={{ marginTop: 32, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button className="modal-cancel-btn" onClick={() => setEditingItem(null)} style={{ background: "transparent", border: "1px solid transparent", color: "#c9d1d9", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                Cancel
              </button>
              <button
                className="modal-submit-btn"
                onClick={handleSaveEdit}
                disabled={!editItemName.trim() || editItemName.trim() === editingItem.name}
                style={{
                  background: (!editItemName.trim() || editItemName.trim() === editingItem.name) ? "#3d3020" : "#f28123",
                  border: "none",
                  color: (!editItemName.trim() || editItemName.trim() === editingItem.name) ? "#8b7a5e" : "#000",
                  padding: "8px 16px",
                  borderRadius: 6,
                  cursor: (!editItemName.trim() || editItemName.trim() === editingItem.name) ? "not-allowed" : "pointer",
                  fontWeight: 600
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingItem && (
        <div className="modal-overlay" onClick={() => setDeletingItem(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ width: 440, padding: 24, borderRadius: 12, background: "#161b22", border: "1px solid #30363d" }}>
            <div className="modal-header d-flex align-items-center justify-content-between" style={{ alignItems: "flex-start", marginBottom: 12 }}>
              <h2 className="modal-title" style={{ fontSize: 18, color: "#fff", margin: 0 }}>
                Delete item
              </h2>
              <button className="modal-close-btn" onClick={() => setDeletingItem(null)} style={{ background: "transparent", border: "none", color: "#8b949e", cursor: "pointer" }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
              <p style={{ color: "#c9d1d9", fontSize: 14, margin: 0 }}>
                Are you sure you want to delete <strong>"{deletingItem.item.name}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer" style={{ marginTop: 28, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button className="modal-cancel-btn" onClick={() => setDeletingItem(null)} style={{ background: "transparent", border: "1px solid transparent", color: "#c9d1d9", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                Cancel
              </button>
              <button className="modal-submit-btn" onClick={confirmDelete} style={{ background: "#da3633", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
