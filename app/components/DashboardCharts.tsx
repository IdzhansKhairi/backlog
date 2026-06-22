"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const lineData = [
  { name: "Jan", kits: 3 },
  { name: "Feb", kits: 4 },
  { name: "Mar", kits: 4 },
  { name: "Apr", kits: 4 },
  { name: "May", kits: 6 },
  { name: "Jun", kits: 0 },
];

const barData = [
  { name: "Jan", spending: 500 },
  { name: "Feb", spending: 1300 },
  { name: "Mar", spending: 800 },
  { name: "Apr", spending: 2000 },
  { name: "May", spending: 1300 },
  { name: "Jun", spending: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="dashboard-chart-tooltip">
        <p className="dashboard-chart-tooltip-label">{label}</p>
        <p className="dashboard-chart-tooltip-value" style={{ color: payload[0].color || '#1da1f2' }}>
          Value: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardCharts() {
  return (
    <div className="dashboard-charts-grid">
      
      {/* Line Chart */}
      <div className="app-card dashboard-chart-card">
        <h3 className="dashboard-section-title">
          Kits Acquired <span className="dashboard-section-subtitle">· Last 6 months</span>
        </h3>
        <div className="dashboard-chart-wrapper">
          <ResponsiveContainer>
            <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#282f35" vertical={true} horizontal={true} />
              <XAxis dataKey="name" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={true} />
              <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={true} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#282f35', strokeWidth: 1 }} />
              <Line 
                type="monotone" 
                dataKey="kits" 
                stroke="#f28123" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#f28123', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#f28123', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="app-card dashboard-chart-card">
        <h3 className="dashboard-section-title">
          Spending <span className="dashboard-section-subtitle">· Last 6 months</span>
        </h3>
        <div className="dashboard-chart-wrapper">
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#282f35" vertical={true} horizontal={true} />
              <XAxis dataKey="name" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={true} />
              <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={true} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#21262d' }} />
              <Bar 
                dataKey="spending" 
                fill="#1da1f2" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
