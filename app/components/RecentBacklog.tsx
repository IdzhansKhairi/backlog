import React from 'react';
import { STATUS_CONFIG } from '@/app/constants/status';

const mockBacklog = [
  { id: 1, name: "HG Calibarn", details: "Bandai · HG · 2026-06-04", price: "RM 85", status: "completed" },
  { id: 2, name: "Fenrir Sazabi Ver. Ka", details: "Fenrir · MG · 2026-06-02", price: "RM 380", status: "in-progress" },
  { id: 3, name: "Daban Sinanju Stein 6655S", details: "Daban · MG · 2026-05-31", price: "RM 298", status: "backlog" }
];

export default function RecentBacklog() {
  return (
    <div className="app-card" style={{ marginTop: '16px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
          Recently Added <span style={{ color: '#8b949e', fontWeight: 'normal' }}>- Active Backlog</span>
        </h3>
        <a href="/collection" style={{ color: '#f28123', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          View collection <i className="bi bi-arrow-up-right"></i>
        </a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockBacklog.map((item) => {
          const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG['backlog'];

          return (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #282f35',
              backgroundColor: '#1c2128'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="app-card-icon-wrapper" style={{ width: '40px', height: '40px', backgroundColor: '#2d333b' }}>
                  <i className="bi bi-boxes" style={{ color: '#f28123', fontSize: '18px' }}></i>
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ color: '#8b949e', fontSize: '12px' }}>{item.details}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: '#8b949e', fontSize: '12px' }}>{item.price}</span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
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
