"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Layout, Menu, ConfigProvider } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./components.css";

const { Sider } = Layout;

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const [showSmallLogo, setShowSmallLogo] = useState(false);
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (collapsed) {
      // Step 1: Crossfade to small logo first
      setShowSmallLogo(true);
      // Step 2: After fade completes, collapse the sidebar
      const timer = setTimeout(() => setSiderCollapsed(true), 350);
      return () => clearTimeout(timer);
    } else {
      // Step 1: Expand sidebar first
      setSiderCollapsed(false);
      // Step 2: After sidebar expands, crossfade to full logo
      const timer = setTimeout(() => setShowSmallLogo(false), 350);
      return () => clearTimeout(timer);
    }
  }, [collapsed]);

  const menuItems = [
    {
      type: "group",
      label: "Overview",
      children: [
        {
          key: "/dashboard",
          icon: <i className="bi bi-grid-1x2" style={{ fontSize: "1.1rem" }}></i>,
          label: <Link href="/dashboard">Dashboard</Link>,
        },
        {
          key: "/analytics",
          icon: <i className="bi bi-graph-up" style={{ fontSize: "1.1rem" }}></i>,
          label: <Link href="/analytics">Financial Analytics</Link>,
        },
      ],
    },
    {
      type: "group",
      label: "Inventory",
      children: [
        {
          key: "/collection",
          icon: <i className="bi bi-collection" style={{ fontSize: "1.1rem" }}></i>,
          label: <Link href="/collection">Collection</Link>,
        },
        {
          key: "/equipment",
          icon: <i className="bi bi-hammer" style={{ fontSize: "1.1rem" }}></i>,
          label: <Link href="/equipment">Equipment</Link>,
        },
      ],
    },
    {
      type: "group",
      label: "Activity",
      children: [
        {
          key: "/workbench",
          icon: <i className="bi bi-wrench" style={{ fontSize: "1.1rem" }}></i>,
          label: <Link href="/workbench">Workbench</Link>,
        },
      ],
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={siderCollapsed}
      trigger={null} /* Hide default bottom trigger */
      width={250} /* <-- Use the width prop here */
      theme="dark"
      className="sidebar-container"
    >
      {/* Your custom logo */}
      <div className="pt-2 pb-3 sidebar-logo-container">
        <div className="my-2 sidebar-logo-wrapper">
          {/* Full logo (with text) */}
          <Image
            src="/images/backlog-logo-transparent.png"
            alt="Backlog Logo Full"
            width={500}
            height={500}
            className={`sidebar-logo-full ${showSmallLogo ? 'logo-hidden' : 'logo-visible'}`}
          />
          {/* Small logo (icon only) */}
          <Image
            src="/images/backlog-logo.png"
            alt="Backlog Logo Small"
            width={500}
            height={500}
            className={`sidebar-logo-small ${showSmallLogo ? 'logo-visible' : 'logo-hidden'}`}
          />
        </div>
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
