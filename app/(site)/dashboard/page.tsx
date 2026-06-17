import DashboardCharts from '@/app/components/DashboardCharts';
import RecentBacklog from '@/app/components/RecentBacklog';

export default function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: '#8b949e', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', margin: 0, marginBottom: 4 }}>
          Welcome back, Hans
        </p>
        <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', margin: 0 }}>
          Your workshop at a glance
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Card 1 */}
        <div className="app-card hover-stat-card">
          <div className="app-card-header">
            <span className="app-card-title">Total Kits Owned</span>
            <div className="app-card-icon-wrapper">
              <i className="bi bi-boxes" style={{ color: '#f28123', fontSize: 14 }}></i>
            </div>
          </div>
          <div className="app-card-value">24</div>
        </div>

        {/* Card 2 */}
        <div className="app-card hover-stat-card">
          <div className="app-card-header">
            <span className="app-card-title">Total Built</span>
            <div className="app-card-icon-wrapper">
              <i className="bi bi-check-circle" style={{ color: '#3fb950', fontSize: 14 }}></i>
            </div>
          </div>
          <div className="app-card-value">9</div>
        </div>

        {/* Card 3 */}
        <div className="app-card hover-stat-card">
          <div className="app-card-header">
            <span className="app-card-title">Total Spend</span>
            <div className="app-card-icon-wrapper">
              <i className="bi bi-wallet2" style={{ color: '#58a6ff', fontSize: 14 }}></i>
            </div>
          </div>
          <div className="app-card-value">RM 7,425</div>
        </div>

        {/* Card 4 */}
        <div className="app-card hover-stat-card">
          <div className="app-card-header">
            <span className="app-card-title">Hours Built</span>
            <div className="app-card-icon-wrapper">
              <i className="bi bi-clock" style={{ color: '#e3b341', fontSize: 14 }}></i>
            </div>
          </div>
          <div className="app-card-value">112 hrs</div>
        </div>
      </div>

      <DashboardCharts />
      <RecentBacklog />
    </div>
  );
}
