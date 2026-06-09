import React from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function TravelRequestPage() {
  return (
    <Layout>
      <h1 className="animate-fade-in" style={{ marginBottom: '8px' }}>Submit Travel Request</h1>
      <p className="animate-fade-in" style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Fill out the form below to request travel approval.</p>

      <Card className="animate-fade-in">
        <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Input label="Departure City" id="departure" placeholder="e.g. New York, NY" />
            <Input label="Destination City" id="destination" placeholder="e.g. London, UK" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Input label="Departure Date" id="depDate" type="date" />
            <Input label="Return Date" id="retDate" type="date" />
          </div>
          <Input label="Business Purpose" id="purpose" placeholder="e.g. Q3 Sales Conference" />
          <Input label="Cost Center" id="costCenter" placeholder="e.g. SALES-200" />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button type="button" variant="secondary" style={{ marginRight: '16px' }}>Save Draft</Button>
            <Button type="button">Submit Request</Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
