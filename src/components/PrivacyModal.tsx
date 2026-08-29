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
              background: 'rgba(0, 240, 255, 0.15)',
              color: '#00f0ff',
              padding: '0.6rem',
              borderRadius: '10px',
              border: '1px solid rgba(0, 240, 255, 0.3)'
            }}>
              <Lock size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                Privacy & Data Security Policy
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Requirement #17: Local processing & instant data deletion controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#ffffff', padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Notice Card */}
        <div style={{
          background: 'rgba(0, 240, 255, 0.06)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          padding: '1.2rem',
          borderRadius: '10px',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f0ff', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
            <ShieldCheck size={20} /> CAMERA ACTIVE PRIVACY GUARANTEE
          </div>
          <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.5' }}>
            "Images are captured only when required for safety events or the demonstration."
          </p>
          <ul style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.75rem', paddingLeft: '1.2rem', lineHeight: '1.5' }}>
            <li>100% Local Browser Processing — No video streams are uploaded to cloud servers.</li>
            <li>Captured baseline photos & emergency snapshots remain strictly in temporary browser storage.</li>
          </ul>
        </div>

        {deletedMsg && (
          <div style={{
            background: 'rgba(0, 230, 118, 0.2)',
            border: '1px solid #00e676',
            color: '#00e676',
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
          background: 'rgba(255, 23, 68, 0.08)',
          border: '1px solid rgba(255, 23, 68, 0.25)',
          padding: '1.2rem',
          borderRadius: '10px',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ff1744', marginBottom: '0.35rem' }}>
            Delete Session Data (Req #17)
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
            Clicking this will remove all stored driver baseline images, session histories, and emergency event logs instantly.
          </p>

          <button
            onClick={handleDeleteAll}
            style={{
              background: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
              color: '#ffffff',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 0 15px rgba(255, 23, 68, 0.4)'
            }}
          >
            <Trash2 size={16} /> DELETE SESSION DATA
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
