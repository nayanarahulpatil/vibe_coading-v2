import React from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';

export default function DashboardPage() {
  const kpis = [
    { label: 'Pending Approvals', value: '3', color: 'var(--warning)' },
    { label: 'Total Expenses YTD', value: '$4,250.00', color: 'var(--accent-primary)' },
    { label: 'Recent Trips', value: '2', color: 'var(--success)' },
  ];

  return (
    <Layout>
      <h1 className="animate-fade-in" style={{ marginBottom: '8px' }}>Dashboard</h1>
      <p className="animate-fade-in" style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Overview of your recent activity</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {kpis.map((kpi, index) => (
          <Card key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>{kpi.label}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: kpi.color }}>{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Recent Action Items</h2>
        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          No new action items. You're all caught up!
        </div>
      </Card>
    </Layout>
  );
}
