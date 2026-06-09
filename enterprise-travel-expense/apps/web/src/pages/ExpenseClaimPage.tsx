import React from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function ExpenseClaimPage() {
  return (
    <Layout>
      <h1 className="animate-fade-in" style={{ marginBottom: '8px' }}>Submit Expense Claim</h1>
      <p className="animate-fade-in" style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Upload receipts for automated OCR extraction.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <Card className="animate-fade-in">
          <h2 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>Receipt Upload</h2>
          <div style={{
            border: '2px dashed var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            padding: '48px',
            textAlign: 'center',
            background: 'var(--bg-tertiary)',
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
          >
            <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <p style={{ fontWeight: 500 }}>Drag and drop your receipt here</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>PNG, JPG, or PDF up to 10MB</p>
          </div>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>Extracted Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Merchant Name" id="merchant" placeholder="Will be auto-filled by OCR" />
            <Input label="Date" id="date" type="date" />
            <Input label="Total Amount" id="amount" type="number" placeholder="0.00" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="button">Submit Claim</Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
