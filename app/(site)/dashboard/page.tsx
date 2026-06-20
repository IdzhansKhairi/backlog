import DashboardCharts from '@/app/components/DashboardCharts';
import RecentBacklog from '@/app/components/RecentBacklog';
import './dashboard.css';

export default function DashboardPage() {
  return (
    <div className='dashboard-container'>
      <div className="dashboard-header">
        <p className="dashboard-welcome-text">
          Welcome back, Hans
        </p>
        <h1 className="dashboard-title">
          Your workshop at a glance
        </h1>
      </div>

      <div className="dashboard-stats-grid">
        {/* Card 1 */}
        <div className="app-card hover-stat-card">
          <div className="app-card-header">
            <span className="app-card-title">Total Kits Owned</span>
            <div className="app-card-icon-wrapper">
              <i className="bi bi-boxes dashboard-icon dashboard-icon-orange"></i>
            </div>
          </div>
          <div className="app-card-value">24</div>
        </div>

        {/* Card 2 */}
        <div className="app-card hover-stat-card">
          <div className="app-card-header">
            <span className="app-card-title">Total Built</span>
            <div className="app-card-icon-wrapper">
              <i className="bi bi-check-circle dashboard-icon dashboard-icon-green"></i>
            </div>
          </div>
          <div className="app-card-value">9</div>
        </div>

        {/* Card 3 */}
        <div className="app-card hover-stat-card">
          <div className="app-card-header">
            <span className="app-card-title">Total Spend</span>
            <div className="app-card-icon-wrapper">
              <i className="bi bi-wallet2 dashboard-icon dashboard-icon-blue"></i>
            </div>
          </div>
          <div className="app-card-value">RM 7,425</div>
        </div>

        {/* Card 4 */}
        <div className="app-card hover-stat-card">
          <div className="app-card-header">
            <span className="app-card-title">Hours Built</span>
            <div className="app-card-icon-wrapper">
              <i className="bi bi-clock dashboard-icon dashboard-icon-yellow"></i>
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
