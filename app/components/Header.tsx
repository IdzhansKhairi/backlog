"use client";

import React from "react";
import { Layout, Avatar } from "antd";
import { usePathname } from "next/navigation";
import "./components.css";

const { Header: AntHeader } = Layout;

export default function Header({ collapsed, setCollapsedAction }: { collapsed: boolean, setCollapsedAction: (val: boolean) => void }) {
    const pathname = usePathname();

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

                <div className="d-flex align-items-center logout-btn gap-2 px-3 py-2">
                    <i className="bi bi-box-arrow-right" style={{ fontSize: "20px" }}></i>
                    <span>Log Out</span>
                </div>
            </div>
        </AntHeader>
    );
}
