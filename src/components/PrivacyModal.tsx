import React, { useState } from 'react';
import { Lock, ShieldCheck, Trash2, X } from 'lucide-react';
import { sessionStore } from '../services/sessionStore';

interface PrivacyModalProps {
  onClose: () => void;
  onDataDeleted: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose, onDataDeleted }) => {
  const [deletedMsg, setDeletedMsg] = useState<boolean>(false);

  const handleDeleteAll = () => {
    sessionStore.deleteAllData();
    setDeletedMsg(true);
    setTimeout(() => {
      onDataDeleted();
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px' }}>
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
              <Lock size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                Privacy & Data Security Policy
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Local processing & instant data deletion controls
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

        {/* Notice Card */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          padding: '1.2rem',
          borderRadius: '10px',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
            <ShieldCheck size={20} /> CAMERA ACTIVE PRIVACY GUARANTEE
          </div>
          <p style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: '1.5' }}>
            "Images are captured only when required for safety events or driver baseline calibration."
          </p>
          <ul style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.75rem', paddingLeft: '1.2rem', lineHeight: '1.5' }}>
            <li>100% Local Browser Processing — No video streams are uploaded to cloud servers.</li>
            <li>Captured baseline photos & emergency snapshots remain strictly in temporary browser storage.</li>
          </ul>
        </div>

        {deletedMsg && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#16a34a',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontWeight: 800,
            textAlign: 'center'
          }}>
            ✅ All driving sessions, baseline photos, and safety event logs deleted!
          </div>
        )}

        {/* Data Wipe Section */}
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          padding: '1.2rem',
          borderRadius: '10px',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#dc2626', marginBottom: '0.35rem' }}>
            Delete Session Data
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.85rem' }}>
            Clicking this will remove all stored driver baseline images, session histories, and emergency event logs instantly.
          </p>

          <button
            onClick={handleDeleteAll}
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: '#ffffff',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)'
            }}
          >
            <Trash2 size={16} /> DELETE SESSION DATA
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', color: '#334155', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
