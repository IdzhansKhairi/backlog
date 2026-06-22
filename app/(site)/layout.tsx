"use client";

import React from "react";
import { Layout, theme } from "antd";
import Sidebar from "@/app/components/Sidebar";
import SiteHeader from "@/app/components/Header";

const { Content } = Layout;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout className="site-layout-root">
      {/* Sidebar is included here and will ONLY show on pages inside the (site) folder */}
      <Sidebar collapsed={collapsed} />
      <Layout className="site-layout-main">
        <SiteHeader collapsed={collapsed} setCollapsedAction={setCollapsed} />
        <Content className="site-layout-content">
          <div
            className="site-layout-body pb-4"
            style={{ borderRadius: borderRadiusLG }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
