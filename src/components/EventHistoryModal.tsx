import React, { useState } from 'react';
import { History, Download, Eye, X } from 'lucide-react';
import type { SafetyEvent } from '../types';
import { sessionStore } from '../services/sessionStore';

interface EventHistoryModalProps {
  onClose: () => void;
}

export const EventHistoryModal: React.FC<EventHistoryModalProps> = ({ onClose }) => {
  const [events] = useState<SafetyEvent[]>(sessionStore.getAllEvents());
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'DateTime', 'EventType', 'Severity', 'Description', 'SessionID'];
    const rows = events.map(e => [
      `"${e.timestamp}"`,
      `"${e.dateTime}"`,
      `"${e.eventType}"`,
      `"${e.severity}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${e.sessionId}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `safety_events_audit_log.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '750px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#f0f9ff',
              color: '#0284c7',
              padding: '0.6rem',
              borderRadius: '10px',
              border: '1px solid #bae6fd'
            }}>
              <History size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                Safety Event Audit Log
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Complete timestamped log of drowsiness & emergency events
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', color: '#64748b', padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Total Events Logged: <strong style={{ color: '#0284c7' }}>{events.length}</strong>
          </span>

          <button
            onClick={handleExportCSV}
            disabled={events.length === 0}
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              color: '#0284c7',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Download size={14} /> EXPORT CSV
          </button>
        </div>

        {/* Log Table */}
        <div style={{
          maxHeight: '340px',
          overflowY: 'auto',
          overflowX: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          background: '#ffffff'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.65rem 0.85rem' }}>Time</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Event</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Severity</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Description</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Snapshot</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No safety events logged yet. Start a drive session or run a simulation.
                  </td>
                </tr>
              ) : (
                events.map(ev => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: '#0284c7', fontWeight: 600 }}>
                      {ev.timestamp}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      {ev.eventType}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: ev.severity === 'Critical' ? '#fef2f2' : ev.severity === 'Warning' ? '#fffbeb' : '#f0fdf4',
                        color: ev.severity === 'Critical' ? '#dc2626' : ev.severity === 'Warning' ? '#d97706' : '#16a34a',
                        border: `1px solid ${ev.severity === 'Critical' ? '#fecaca' : ev.severity === 'Warning' ? '#fde68a' : '#bbf7d0'}`
                      }}>
                        {ev.severity}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#334155' }}>
                      {ev.description}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      {ev.capturedImage ? (
                        <button
                          onClick={() => setSelectedPhoto(ev.capturedImage || null)}
                          style={{
                            background: '#f0f9ff',
                            border: '1px solid #bae6fd',
                            color: '#0284c7',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Eye size={12} /> View Photo
                        </button>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Photo Modal Preview Overlay */}
        {selectedPhoto && (
          <div style={{
            marginTop: '1rem',
            background: '#f8fafc',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #bae6fd',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img src={selectedPhoto} alt="Captured Event" style={{ maxHeight: '200px', borderRadius: '6px' }} />
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{ marginTop: '0.5rem', background: '#e2e8f0', color: '#0f172a', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}
            >
              Close Photo Preview
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', color: '#334155', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600 }}
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
};
