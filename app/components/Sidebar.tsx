"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Layout, Menu, ConfigProvider } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./components.css";

const { Sider } = Layout;

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const [logoCollapsed, setLogoCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (collapsed) {
      // Wait for the 200ms transition to finish before switching the logo
      const timer = setTimeout(() => setLogoCollapsed(true), 200);
      return () => clearTimeout(timer);
    } else {
      // When expanding, switch back immediately
      setLogoCollapsed(false);
    }
  }, [collapsed]);

  const menuItems = [
    {
      key: "/dashboard",
      icon: <i className="bi bi-grid-1x2" style={{ fontSize: "1.1rem" }}></i>,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: "/collection",
      icon: <i className="bi bi-collection" style={{ fontSize: "1.1rem" }}></i>,
      label: <Link href="/collection">Collection</Link>,
    },
    {
      key: "/workbench",
      icon: <i className="bi bi-wrench" style={{ fontSize: "1.1rem" }}></i>,
      label: <Link href="/workbench">Workbench</Link>,
    },
    {
      key: "/analytics",
      icon: <i className="bi bi-graph-up" style={{ fontSize: "1.1rem" }}></i>,
      label: <Link href="/analytics">Financial Analytics</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null} /* Hide default bottom trigger */
      width={250} /* <-- Use the width prop here */
      theme="dark"
      className="sidebar-container"
    >
      {/* Your custom logo */}
      <div className="pt-2 pb-3 sidebar-logo-container">
        <Image
          src={logoCollapsed ? "/images/backlog-logo.png" : "/images/backlog-logo-transparent.png"}
          alt="Backlog Logo"
          width={500} // Intrinsic width (doesn't force display width)
          height={500} // Intrinsic height
          style={{ width: collapsed ? "40px" : "210px" }} // Dynamic width
          className="sidebar-logo-img"
        />
      </div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              darkItemBg: "#090e12",
              darkItemSelectedBg: "#282f35",
              darkItemColor: "#a3b3c2",
              darkItemSelectedColor: "#ffffff",
              itemBorderRadius: 8,
              darkItemHoverBg: "#1c2128",
            },
          },
        }}
      >
        <Menu
          className="pt-3 px-2 sidebar-menu"
          theme="dark"
          selectedKeys={[pathname]}
          mode="inline"
          items={menuItems}
        />
      </ConfigProvider>
    </Sider>
  );
}
