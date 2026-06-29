import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, accent = 'blue' }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const ringCls = accent === 'pink' ? 'ring-pink' : 'ring-blue';

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal ${ringCls} fade-in`}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
          <h2 style={{ fontSize:'18px', fontWeight:700, fontFamily:'Orbitron,monospace', color: accent==='pink'?'var(--pink)':'var(--blue)' }}>
            {title}
          </h2>
          <button className="btn btn-ghost" style={{ padding:'6px', borderRadius:'8px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
