import React from 'react';
import { AlertCircle, GraduationCap } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  return (
    <footer style={{
      marginTop: '2rem',
      padding: '1.25rem 1.5rem',
      background: 'rgba(10, 15, 26, 0.95)',
      borderTop: '1px solid rgba(0, 240, 255, 0.15)',
      borderRadius: '12px 12px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
        <AlertCircle size={22} color="#ffd600" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
          <strong style={{ color: '#ffd600' }}>SCIENTIFIC EXHIBITION DISCLAIMER (REQ #20):</strong>{' '}
          "This project is a prototype designed to demonstrate driver fatigue monitoring and emergency response for a Class 11 Science Exhibition. It is not a certified automotive safety system or medical diagnostic system."
        </p>
      </div>

      <div style={{
        fontSize: '0.78rem',
        color: '#00f0ff',
        fontWeight: 700,
        background: 'rgba(0, 240, 255, 0.1)',
        padding: '0.4rem 0.8rem',
        borderRadius: '6px',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem'
      }}>
        <GraduationCap size={16} /> CLASS 11 SCIENCE PROJECT PROTOTYPE
      </div>
    </footer>
  );
};
