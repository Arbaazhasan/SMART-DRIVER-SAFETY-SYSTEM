import React from 'react';
import { 
  GraduationCap, 
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
      border: '1px solid rgba(0, 240, 255, 0.3)',
      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 26, 0.95) 100%)',
      boxShadow: '0 0 25px rgba(0, 240, 255, 0.12)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '0.6rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'rgba(0, 240, 255, 0.15)',
            color: '#00f0ff',
            padding: '0.4rem',
            borderRadius: '8px',
            border: '1px solid rgba(0, 240, 255, 0.3)'
          }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
              🎓 SCIENCE EXHIBITION DEMO MODE
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Requirement #14: Test all driver scenarios live without camera hardware
            </p>
          </div>
        </div>

        {activeScenario && (
          <button
            onClick={onResetDemo}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#00f0ff',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <RotateCcw size={14} /> RESET DEMO
          </button>
        )}
      </div>

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
              ? 'rgba(0, 230, 118, 0.25)'
              : 'rgba(0, 230, 118, 0.08)',
            border: `1px solid ${activeScenario === 'SCENARIO_1_NORMAL' ? '#00e676' : 'rgba(0, 230, 118, 0.25)'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            textAlign: 'left',
            color: '#ffffff',
            boxShadow: activeScenario === 'SCENARIO_1_NORMAL' ? '0 0 15px rgba(0, 230, 118, 0.4)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00e676', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
            <CheckCircle size={16} /> SCENARIO 1
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Simulate Normal Driver</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Result: 🟢 Driver Alert
          </div>
        </button>

        {/* Scenario 2 */}
        <button
          onClick={() => onTriggerScenario('SCENARIO_2_WARNING')}
          style={{
            background: activeScenario === 'SCENARIO_2_WARNING'
              ? 'rgba(255, 214, 0, 0.25)'
              : 'rgba(255, 214, 0, 0.08)',
            border: `1px solid ${activeScenario === 'SCENARIO_2_WARNING' ? '#ffd600' : 'rgba(255, 214, 0, 0.25)'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            textAlign: 'left',
            color: '#ffffff',
            boxShadow: activeScenario === 'SCENARIO_2_WARNING' ? '0 0 15px rgba(255, 214, 0, 0.4)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffd600', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
            <AlertTriangle size={16} /> SCENARIO 2
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Simulate Drowsiness</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Result: 🟡 Warning + Chime
          </div>
        </button>

        {/* Scenario 3 */}
        <button
          onClick={() => onTriggerScenario('SCENARIO_3_CRITICAL')}
          style={{
            background: activeScenario === 'SCENARIO_3_CRITICAL'
              ? 'rgba(255, 23, 68, 0.25)'
              : 'rgba(255, 23, 68, 0.08)',
            border: `1px solid ${activeScenario === 'SCENARIO_3_CRITICAL' ? '#ff1744' : 'rgba(255, 23, 68, 0.25)'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            textAlign: 'left',
            color: '#ffffff',
            boxShadow: activeScenario === 'SCENARIO_3_CRITICAL' ? '0 0 15px rgba(255, 23, 68, 0.4)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff1744', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
            <Activity size={16} /> SCENARIO 3
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Simulate Critical Alarm</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Result: 🔴 Alarm + ~2s Closures
          </div>
        </button>

        {/* Scenario 4 */}
        <button
          onClick={() => onTriggerScenario('SCENARIO_4_EMERGENCY')}
          style={{
            background: activeScenario === 'SCENARIO_4_EMERGENCY'
              ? 'rgba(255, 0, 60, 0.3)'
              : 'rgba(255, 23, 68, 0.12)',
            border: `1px solid ${activeScenario === 'SCENARIO_4_EMERGENCY' ? '#ff003c' : 'rgba(255, 23, 68, 0.3)'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            textAlign: 'left',
            color: '#ffffff',
            boxShadow: activeScenario === 'SCENARIO_4_EMERGENCY' ? '0 0 20px rgba(255, 0, 60, 0.6)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff003c', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
            <Siren size={16} /> SCENARIO 4
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Simulate Emergency</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Result: 🚨 Accident + SOS Snapshot
          </div>
        </button>

        {/* Scenario 5 */}
        <button
          onClick={() => onTriggerScenario('SCENARIO_5_INJURY')}
          style={{
            background: activeScenario === 'SCENARIO_5_INJURY'
              ? 'rgba(168, 85, 247, 0.3)'
              : 'rgba(168, 85, 247, 0.12)',
            border: `1px solid ${activeScenario === 'SCENARIO_5_INJURY' ? '#a855f7' : 'rgba(168, 85, 247, 0.3)'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            textAlign: 'left',
            color: '#ffffff',
            boxShadow: activeScenario === 'SCENARIO_5_INJURY' ? '0 0 20px rgba(168, 85, 247, 0.5)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
            <Flame size={16} /> SCENARIO 5
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Experimental Injury</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Result: 🧪 Visual Feature Test
          </div>
        </button>
      </div>
    </div>
  );
};
