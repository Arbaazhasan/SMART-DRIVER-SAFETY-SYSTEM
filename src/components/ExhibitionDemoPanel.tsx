import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Siren, 
  Activity, 
  Flame, 
  RotateCcw 
} from 'lucide-react';
import type { ExhibitionScenario } from '../types';

interface ExhibitionDemoPanelProps {
  activeScenario: ExhibitionScenario | null;
  onTriggerScenario: (scenario: ExhibitionScenario) => void;
  onResetDemo: () => void;
}

export const ExhibitionDemoPanel: React.FC<ExhibitionDemoPanelProps> = ({
  activeScenario,
  onTriggerScenario,
  onResetDemo
}) => {
  return (
    <div className="cockpit-card" style={{
      border: '1px solid #e2e8f0',
      background: '#ffffff',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
    }}>
      {activeScenario && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '0.75rem'
        }}>
          <button
            onClick={onResetDemo}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#0284c7',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <RotateCcw size={14} /> RESET SIMULATION
          </button>
        </div>
      )}

      {/* Scenario Action Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem'
      }}>
        {/* Scenario 1 */}
        <button
          onClick={() => onTriggerScenario('SCENARIO_1_NORMAL')}
          style={{
            background: activeScenario === 'SCENARIO_1_NORMAL'
              ? '#f0fdf4'
              : '#f8fafc',
            border: `1px solid ${activeScenario === 'SCENARIO_1_NORMAL' ? '#16a34a' : '#e2e8f0'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            textAlign: 'left',
            color: '#0f172a',
            boxShadow: activeScenario === 'SCENARIO_1_NORMAL' ? '0 4px 12px rgba(22, 163, 74, 0.2)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.9rem', fontWeight: 800 }}>
            <CheckCircle size={18} /> Simulate Normal Driver
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>
            Result: 🟢 Driver Alert
          </div>
        </button>

        {/* Scenario 2 */}
        <button
          onClick={() => onTriggerScenario('SCENARIO_2_WARNING')}
          style={{
            background: activeScenario === 'SCENARIO_2_WARNING'
              ? '#fffbeb'
              : '#f8fafc',
            border: `1px solid ${activeScenario === 'SCENARIO_2_WARNING' ? '#d97706' : '#e2e8f0'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            textAlign: 'left',
            color: '#0f172a',
            boxShadow: activeScenario === 'SCENARIO_2_WARNING' ? '0 4px 12px rgba(217, 119, 6, 0.2)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d97706', fontSize: '0.9rem', fontWeight: 800 }}>
            <AlertTriangle size={18} /> Simulate Drowsiness
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>
            Result: 🟡 Warning + Chime
          </div>
        </button>

        {/* Scenario 3 */}
        <button
          onClick={() => onTriggerScenario('SCENARIO_3_CRITICAL')}
          style={{
            background: activeScenario === 'SCENARIO_3_CRITICAL'
              ? '#fef2f2'
              : '#f8fafc',
            border: `1px solid ${activeScenario === 'SCENARIO_3_CRITICAL' ? '#dc2626' : '#e2e8f0'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            textAlign: 'left',
            color: '#0f172a',
            boxShadow: activeScenario === 'SCENARIO_3_CRITICAL' ? '0 4px 12px rgba(220, 38, 38, 0.2)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontSize: '0.9rem', fontWeight: 800 }}>
            <Activity size={18} /> Simulate Critical Alarm
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>
            Result: 🔴 Alarm + ~2s Closures
          </div>
        </button>

        {/* Scenario 4 */}
        <button
          onClick={() => onTriggerScenario('SCENARIO_4_EMERGENCY')}
          style={{
            background: activeScenario === 'SCENARIO_4_EMERGENCY'
              ? '#fef2f2'
              : '#f8fafc',
            border: `1px solid ${activeScenario === 'SCENARIO_4_EMERGENCY' ? '#dc2626' : '#e2e8f0'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            textAlign: 'left',
            color: '#0f172a',
            boxShadow: activeScenario === 'SCENARIO_4_EMERGENCY' ? '0 4px 14px rgba(220, 38, 38, 0.3)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontSize: '0.9rem', fontWeight: 800 }}>
            <Siren size={18} /> Simulate Emergency
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>
            Result: 🚨 Accident + SOS Snapshot
          </div>
        </button>

        {/* Scenario 5 */}
        <button
          onClick={() => onTriggerScenario('SCENARIO_5_INJURY')}
          style={{
            background: activeScenario === 'SCENARIO_5_INJURY'
              ? '#faf5ff'
              : '#f8fafc',
            border: `1px solid ${activeScenario === 'SCENARIO_5_INJURY' ? '#9333ea' : '#e2e8f0'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            textAlign: 'left',
            color: '#0f172a',
            boxShadow: activeScenario === 'SCENARIO_5_INJURY' ? '0 4px 14px rgba(147, 51, 234, 0.25)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9333ea', fontSize: '0.9rem', fontWeight: 800 }}>
            <Flame size={18} /> Experimental Injury
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>
            Result: 🧪 Visual Feature Test
          </div>
        </button>
      </div>
    </div>
  );
};
