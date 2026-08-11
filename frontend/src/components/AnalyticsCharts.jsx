import React from 'react';
import { BarChart3, PieChart, TrendingUp, Building2, Calendar } from 'lucide-react';

export const AnalyticsCharts = ({ stats }) => {
  if (!stats) return null;

  const presentCount = stats.presentToday || 0;
  const lateCount = stats.lateToday || 0;
  const absentCount = stats.absentToday || 0;
  const totalToday = presentCount + lateCount + absentCount || 1;

  // Donut Chart calculations for Attendance Status
  const presentPct = (presentCount / totalToday) * 100;
  const latePct = (lateCount / totalToday) * 100;
  const absentPct = (absentCount / totalToday) * 100;

  // Department counts
  const deptCounts = stats.departmentCounts || { Engineering: 3, Marketing: 1, Management: 1 };

  // Leave types counts
  const leaveTypes = stats.leaveTypesCount || { 'Casual Leave': 1, 'Sick Leave': 1, 'Annual Leave': 1 };
  const totalLeavesCount = Object.values(leaveTypes).reduce((a, b) => a + b, 0) || 1;

  // Monthly trend data
  const monthlyData = stats.monthlyAttendance || [
    { month: 'Apr', present: 85, late: 10, absent: 5 },
    { month: 'May', present: 88, late: 8, absent: 4 },
    { month: 'Jun', present: 92, late: 5, absent: 3 },
    { month: 'Jul', present: 90, late: 7, absent: 3 },
    { month: 'Aug', present: 95, late: 4, absent: 1 }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
      
      {/* 1. Monthly Attendance Trend (SVG Bar Chart) */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <TrendingUp size={20} color="var(--accent-primary)" />
          <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>Monthly Attendance Trend (%)</h4>
        </div>

        <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', padding: '1rem 0.5rem 0 0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
          {monthlyData.map((item, idx) => (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', display: 'flex', gap: '3px', alignItems: 'flex-end', height: '160px' }}>
                {/* Present Bar */}
                <div
                  style={{
                    flex: 1,
                    height: `${item.present}%`,
                    background: 'linear-gradient(180deg, #34d399 0%, #10b981 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease'
                  }}
                  title={`Present: ${item.present}%`}
                />
                {/* Late Bar */}
                <div
                  style={{
                    flex: 1,
                    height: `${item.late * 4}%`,
                    background: 'linear-gradient(180deg, #fbbf24 0%, #d97706 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease'
                  }}
                  title={`Late: ${item.late}%`}
                />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>{item.month}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399' }} />
            <span style={{ color: 'var(--text-muted)' }}>Present Rate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }} />
            <span style={{ color: 'var(--text-muted)' }}>Late Rate</span>
          </div>
        </div>
      </div>

      {/* 2. Today's Attendance Status Breakdown (Donut Chart) */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <PieChart size={20} color="#34d399" />
          <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>Today's Attendance Breakdown</h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1rem', height: '220px' }}>
          {/* Custom SVG Donut */}
          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
            <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="3.8"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#34d399"
                strokeWidth="3.8"
                strokeDasharray={`${presentPct}, 100`}
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3.8"
                strokeDasharray={`${latePct}, 100`}
                strokeDashoffset={`-${presentPct}`}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>{Math.round(presentPct)}%</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Punctual</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#34d399' }} />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{presentCount} Present</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>On-time check in</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#fbbf24' }} />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{lateCount} Late</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>After 09:15 AM</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#fb7185' }} />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{absentCount} Absent</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Not clocked in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Department-wise Employees Breakdown (Horizontal Bar Chart) */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Building2 size={20} color="#c084fc" />
          <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>Department-wise Staffing</h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '220px', justifyContent: 'center' }}>
          {Object.entries(deptCounts).map(([dept, count], idx) => {
            const maxVal = Math.max(...Object.values(deptCounts)) || 1;
            const pct = (count / maxVal) * 100;
            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem', fontWeight: '600' }}>
                  <span>{dept}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{count} Staff</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Leave Types Distribution Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Calendar size={20} color="#fbbf24" />
          <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>Leave Category Breakdown</h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '220px', justifyContent: 'center' }}>
          {Object.entries(leaveTypes).map(([type, count], idx) => {
            const pct = Math.round((count / totalLeavesCount) * 100);
            const colors = ['#fbbf24', '#60a5fa', '#34d399'];
            const barColor = colors[idx % colors.length];

            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem', fontWeight: '600' }}>
                  <span>{type}</span>
                  <span style={{ color: barColor }}>{count} Applications ({pct}%)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: barColor,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
