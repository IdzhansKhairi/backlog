"use client";

import React, { useState } from "react";
import { Layout, Avatar } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";
import { useModalState } from "@/app/hooks/useModalState";
import "./components.css";

const { Header: AntHeader } = Layout;

export default function Header({ collapsed, setCollapsedAction }: { collapsed: boolean, setCollapsedAction: (val: boolean) => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { isRendered: isLogoutRendered, isClosing: isLogoutClosing } = useModalState(showLogoutModal);

    useEscapeKey(() => {
        if (showLogoutModal) setShowLogoutModal(false);
    }, showLogoutModal);

    const getPageTitle = () => {
        if (pathname.startsWith("/dashboard")) return "Dashboard";
        if (pathname.startsWith("/workbench")) return "Workbench";
        if (pathname.startsWith("/collection")) return "Collection";
        if (pathname.startsWith("/equipment")) return "Equipment";
        if (pathname.startsWith("/analytics")) return "Financial Analytics";
        return "";
    };


    return (
        <AntHeader className="site-header">
            <div className="header-left-section">
                <div
                    onClick={() => setCollapsedAction(!collapsed)}
                    className="header-toggle-btn"
                >
                    <i className={collapsed ? "bi bi-layout-sidebar-inset" : "bi bi-layout-sidebar"}></i>
                </div>
                <h1 className="header-title">
                    {getPageTitle()}
                </h1>
            </div>

            <div className="d-flex align-items-center gap-2">
                <div className="d-flex flex-column align-items-end user-info">
                    <span className="user-name">Hans</span>
                    <span className="user-email">muhammadidzhanskhairi@gmail.com</span>
                </div>

                <Avatar size={40} className="user-avatar">
                    H
                </Avatar>

                <div className="d-flex align-items-center logout-btn gap-2 px-3 py-2" onClick={() => setShowLogoutModal(true)}>
                    <i className="bi bi-box-arrow-right logout-icon"></i>
                    <span>Log Out</span>
                </div>
            </div>

            {isLogoutRendered && (
                <div className={`modal-overlay ${isLogoutClosing ? "closing" : ""}`} onClick={() => setShowLogoutModal(false)}>
                    <div className={`modal-container small-modal-container ${isLogoutClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header lh-base d-flex align-items-start justify-content-between mb-3 p-0">
                            <h2 className="modal-title" style={{ fontSize: 18, color: "#fff", margin: 0 }}>
                                Log out
                            </h2>
                            <button className="modal-close-btn" onClick={() => setShowLogoutModal(false)} style={{ background: "transparent", border: "none", color: "#8b949e", cursor: "pointer", padding: 0 }}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="modal-body lh-base pb-3" style={{ padding: 0 }}>
                            <p style={{ color: "#c9d1d9", fontSize: 14, margin: 0 }}>
                                Are you sure you want to log out?
                            </p>
                        </div>

                        <div className="d-flex align-items-center justify-content-end mt-4 p-0 gap-3">
                            <button className="modal-cancel-btn lh-base" onClick={() => setShowLogoutModal(false)}>
                                Cancel
                            </button>
                            <button className="modal-submit-btn lh-base bg-danger border-0 text-white" onClick={() => router.push("/login")}>
                                Yes, log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AntHeader>
    );
}
