"use client";

import React from "react";
import { Layout, Avatar, Dropdown, MenuProps } from "antd";
import { UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import "./components.css";

const { Header: AntHeader } = Layout;

export default function Header({ collapsed, setCollapsedAction }: { collapsed: boolean, setCollapsedAction: (val: boolean) => void }) {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname.startsWith("/dashboard")) return "Dashboard";
        if (pathname.startsWith("/workbench")) return "Workbench";
        if (pathname.startsWith("/collection")) return "Collection";
        if (pathname.startsWith("/analytics")) return "Financial Analytics";
        return "";
    };

    const items: MenuProps["items"] = [
        {
            key: "1",
            icon: <SettingOutlined />,
            label: "Settings",
        },
        {
            key: "2",
            icon: <LogoutOutlined />,
            label: "Logout",
        },
    ];

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

            <Dropdown menu={{ items }} placement="bottomRight" arrow>
                <div className="header-profile-btn">
                    <span>Admin User</span>
                    <Avatar icon={<UserOutlined />} />
                </div>
            </Dropdown>
        </AntHeader>
    );
}
