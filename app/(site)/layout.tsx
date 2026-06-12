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
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar is included here and will ONLY show on pages inside the (site) folder */}
      <Sidebar collapsed={collapsed} />
      <Layout style={{ background: "#0e1217" }}>
        <SiteHeader collapsed={collapsed} setCollapsedAction={setCollapsed} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#0e1217",
              color: "#fff",
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
