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
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar is included here and will ONLY show on pages inside the (site) folder */}
      <Sidebar collapsed={collapsed} />
      <Layout style={{ background: "#0e1217", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <SiteHeader collapsed={collapsed} setCollapsedAction={setCollapsed} />
        <Content style={{ padding: "16px 24px", flex: 1 }}>
          <div
            style={{
              padding: 0,
              minHeight: 360,
              background: "#0e1217",
              color: "#fff",
              borderRadius: borderRadiusLG,
            }}
            className="pb-4"
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
