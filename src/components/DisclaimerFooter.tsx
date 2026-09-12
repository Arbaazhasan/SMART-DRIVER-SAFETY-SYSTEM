import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  return (
    <footer style={{
      marginTop: '2rem',
      padding: '1.25rem 1.5rem',
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      borderRadius: '12px 12px 0 0',
      boxShadow: '0 -2px 10px rgba(15, 23, 42, 0.03)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
        <AlertCircle size={22} color="#d97706" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.4' }}>
          <strong style={{ color: '#0f172a' }}>SYSTEM NOTICE:</strong>{' '}
          "Smart Driver Safety System is an automated driver fatigue monitoring and emergency assistance application. Ensure proper camera calibration and vehicle safety compliance."
        </p>
      </div>

      <div style={{
        fontSize: '0.78rem',
        color: '#0284c7',
        fontWeight: 700,
        background: '#f0f9ff',
        padding: '0.4rem 0.8rem',
        borderRadius: '6px',
        border: '1px solid #bae6fd',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem'
      }}>
        <ShieldCheck size={16} /> SMART DRIVER SAFETY SYSTEM
      </div>
    </footer>
  );
};
