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

  const flatItems = [
    {
      key: "/dashboard",
      icon: <i className="bi bi-grid-1x2"></i>,
      label: <Link href="/dashboard" className="text-decoration-none">Dashboard</Link>,
    },
    {
      key: "/analytics",
      icon: <i className="bi bi-graph-up"></i>,
      label: <Link href="/analytics" className="text-decoration-none">Financial Analytics</Link>,
    },
    {
      key: "/collection",
      icon: <i className="bi bi-collection"></i>,
      label: <Link href="/collection" className="text-decoration-none">Collection</Link>,
    },
    {
      key: "/equipment",
      icon: <i className="bi bi-hammer"></i>,
      label: <Link href="/equipment" className="text-decoration-none">Equipment</Link>,
    },
    {
      key: "/workbench",
      icon: <i className="bi bi-wrench"></i>,
      label: <Link href="/workbench" className="text-decoration-none">Workbench</Link>,
    },
  ];

  const groupedItems = [
    {
      type: "group" as const,
      label: "Overview",
      children: [flatItems[0], flatItems[1]],
    },
    {
      type: "group" as const,
      label: "Inventory",
      children: [flatItems[2], flatItems[3]],
    },
    {
      type: "group" as const,
      label: "Activity",
      children: [flatItems[4]],
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={siderCollapsed}
      trigger={null}
      width={250}
      theme="dark"
      className="sidebar-container"
    >
      <div className="pt-2 pb-3 sidebar-logo-container">
        <div className="my-2 sidebar-logo-wrapper">
          <Image
            src="/images/backlog-logo-transparent.png"
            alt="Backlog Logo Full"
            width={500}
            height={500}
            className={`sidebar-logo-full ${showSmallLogo ? 'logo-hidden' : 'logo-visible'}`}
          />
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
          items={groupedItems}
        />
      </ConfigProvider>
      
      {/* Settings at bottom */}
      <div className="sidebar-bottom-action mt-auto">
        <Link href="/settings" className={`text-decoration-none sidebar-settings-link ${pathname === '/settings' ? 'active' : ''}`}>
          <i className="bi bi-gear"></i>
          <span className={`sidebar-settings-text ${siderCollapsed ? 'collapsed' : ''}`}>Settings</span>
        </Link>
      </div>
    </Sider>
  );
}
