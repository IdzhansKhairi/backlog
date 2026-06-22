import React from 'react';
import { STATUS_CONFIG } from '@/app/constants/status';

const mockBacklog = [
  { id: 1, name: "HG Calibarn", details: "Bandai · HG · 2026-06-04", price: "RM 85", status: "completed" },
  { id: 2, name: "Fenrir Sazabi Ver. Ka", details: "Fenrir · MG · 2026-06-02", price: "RM 380", status: "in-progress" },
  { id: 3, name: "Daban Sinanju Stein 6655S", details: "Daban · MG · 2026-05-31", price: "RM 298", status: "backlog" }
];

export default function RecentBacklog() {
  return (
    <div className="app-card recent-backlog-card">
      <div className="d-flex justify-content-between align-items-center recent-backlog-header">
        <h3 className="dashboard-section-title" style={{ margin: 0 }}>
          Recently Added <span className="dashboard-section-subtitle">- Active Backlog</span>
        </h3>
        <a href="/collection" className="d-flex align-items-center gap-1 text-decoration-none recent-backlog-link">
          View collection <i className="bi bi-arrow-up-right"></i>
        </a>
      </div>

      <div className="d-flex flex-column gap-3">
        {mockBacklog.map((item) => {
          const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG['backlog'];

          return (
            <div key={item.id} className="d-flex justify-content-between align-items-center p-3 recent-backlog-item">
              <div className="d-flex align-items-center gap-3">
                <div className="recent-backlog-item-icon">
                  <i className="bi bi-boxes dashboard-icon-orange" style={{ fontSize: '18px' }}></i>
                </div>
                <div>
                  <div className="recent-backlog-item-name">{item.name}</div>
                  <div className="recent-backlog-item-details">{item.details}</div>
                </div>
              </div>

              <div className="d-flex flex-column align-items-end gap-1">
                <span className="recent-backlog-item-details">{item.price}</span>
                <span className="recent-backlog-badge" style={{
                  backgroundColor: statusConfig.bg,
                  color: statusConfig.color,
                  border: `1px solid ${statusConfig.border}`
                }}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
