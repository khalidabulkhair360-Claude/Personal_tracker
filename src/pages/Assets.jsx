import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Wallet, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import Modal from '../components/Modal';
import { formatSAR, ASSET_TYPES, getAssetMeta, CHART_COLORS, uid } from '../utils/helpers';

const BLANK = { name:'', value:'', type:'investment', notes:'', liquid:true };

export default function Assets() {
  const { assets, totalAssets, goalProgress, settings, addAsset, editAsset, deleteAsset } = useFinance();
  const [modal,  setModal]  = useState(false);
  const [editing,setEditing] = useState(null);
  const [form,   setForm]   = useState(BLANK);
  const [confirm,setConfirm] = useState(null);

  const openAdd  = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (a) => { setEditing(a.id); setForm({ name:a.name, value:String(a.value), type:a.type, notes:a.notes||'', liquid:a.liquid??true }); setModal(true); };

  const handleSave = () => {
    if (!form.name || !form.value) return;
    const data = { ...form, value: parseFloat(form.value) };
    editing ? editAsset(editing, data) : addAsset(data);
    setModal(false);
  };

  const handleDelete = (id) => { deleteAsset(id); setConfirm(null); };

  // Pie by type
  const byType = ASSET_TYPES.map(t => ({
    name: t.label,
    value: assets.filter(a=>a.type===t.type).reduce((s,a)=>s+a.value,0),
    color: t.color,
  })).filter(t=>t.value>0);

  const gap = settings.houseLoanBalance - totalAssets;

  return (
    <div style={{ padding:'28px', minHeight:'100vh', background:'var(--bg)' }} className="grid-bg">

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <h1 className="orb" style={{ fontSize:'22px', fontWeight:700, color:'var(--green)', textShadow:'0 0 16px var(--green)' }}>Assets & Investments</h1>
          <p style={{ fontSize:'13px', color:'var(--w40)', marginTop:'4px' }}>Every riyal you own — tracked and growing.</p>
        </div>
        <button className="btn btn-p" onClick={openAdd}><Plus size={14}/> Add Asset</button>
      </div>

      {/* Total + Goal */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'24px' }}>
        <div className="card ring-green" style={{ padding:'28px' }}>
          <div style={{ fontSize:'9px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--w40)', marginBottom:'10px', display:'flex', alignItems:'center', gap:'6px' }}>
            <Wallet size={12} color="var(--green)" /> Total Net Worth
          </div>
          <div className="orb" style={{ fontSize:'40px', fontWeight:900, color:'var(--green)', textShadow:'0 0 24px var(--green)', lineHeight:1 }}>
            {formatSAR(totalAssets)}
          </div>
          <div style={{ fontSize:'12px', color:'var(--w40)', marginTop:'6px' }}>
            {assets.filter(a=>a.liquid).length} liquid · {assets.filter(a=>!a.liquid).length} illiquid assets
          </div>
        </div>

        <div className="card ring-blue" style={{ padding:'28px' }}>
          <div style={{ fontSize:'9px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--w40)', marginBottom:'10px' }}>
            Goal: House Loan Break-Even
          </div>
          <div className="orb" style={{ fontSize:'28px', fontWeight:900, color:'var(--blue)', textShadow:'0 0 18px var(--blue)', lineHeight:1, marginBottom:'8px' }}>
            {goalProgress.toFixed(1)}%
          </div>
          <div className="progress-track" style={{ marginBottom:'8px' }}>
            <div className="progress-fill-b" style={{ width:`${goalProgress}%` }} />
          </div>
          <div style={{ fontSize:'11px', color:'var(--w40)' }}>
            {formatSAR(totalAssets, true)} of {formatSAR(settings.houseLoanBalance, true)} · Gap: <span style={{ color:'var(--yellow)' }}>{formatSAR(gap, true)}</span>
          </div>
        </div>
      </div>

      {/* Chart + Types */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'24px' }}>
        <div className="card" style={{ padding:'24px' }}>
          <div className="sec-label">Asset Allocation</div>
          {byType.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byType} cx="50%" cy="50%" outerRadius={85} paddingAngle={3} dataKey="value">
                  {byType.map((t,i)=><Cell key={i} fill={t.color} />)}
                </Pie>
                <Tooltip formatter={v=>[formatSAR(v)]} contentStyle={{ background:'#0c0c22', border:'1px solid #00D4FF', borderRadius:'10px', color:'#fff' }} />
                <Legend wrapperStyle={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', paddingTop:'10px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--w40)' }}>No assets yet</div>
          )}
        </div>

        <div className="card" style={{ padding:'24px' }}>
          <div className="sec-label">By Type</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'8px' }}>
            {ASSET_TYPES.map(t => {
              const val = assets.filter(a=>a.type===t.value).reduce((s,a)=>s+a.value,0);
              const pct = totalAssets>0 ? (val/totalAssets)*100 : 0;
              if (val === 0) return null;
              return (
                <div key={t.value}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'12px' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--w70)' }}>
                      <span>{t.icon}</span> {t.label}
                    </span>
                    <span style={{ color:t.color, fontWeight:600 }}>{formatSAR(val, true)}</span>
                  </div>
                  <div className="progress-track" style={{ height:'6px' }}>
                    <div style={{ width:`${pct}%`, height:'100%', borderRadius:'4px', background:t.color, boxShadow:`0 0 8px ${t.color}`, transition:'width .8s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Asset table */}
      <div className="card" style={{ padding:'24px' }}>
        <div className="sec-label">{assets.length} Assets on Record</div>
        {assets.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', color:'var(--w40)', fontSize:'13px' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px', opacity:.3 }}>💎</div>
            No assets yet. Click <strong style={{ color:'var(--pink)' }}>Add Asset</strong> to start tracking.
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr><th>Asset</th><th>Type</th><th>Notes</th><th>Liquidity</th><th style={{ textAlign:'right' }}>Value</th><th></th></tr>
            </thead>
            <tbody>
              {assets.map((a) => {
                const meta = getAssetMeta(a.type);
                return (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight:600, fontSize:'14px' }}>{a.name}</div>
                      <div style={{ fontSize:'10px', color:'var(--w40)' }}>Updated {a.lastUpdated}</div>
                    </td>
                    <td>
                      <span className="badge" style={{ background:`${meta.color}1a`, color:meta.color }}>
                        {meta.icon} {meta.label}
                      </span>
                    </td>
                    <td style={{ color:'var(--w40)', fontSize:'12px', maxWidth:'200px' }}>{a.notes || '—'}</td>
                    <td>
                      <span className={`badge ${a.liquid ? 'badge-g' : 'badge-y'}`}>
                        {a.liquid ? '💧 Liquid' : '🔒 Locked'}
                      </span>
                    </td>
                    <td style={{ textAlign:'right' }}>
                      <div className="orb" style={{ fontWeight:700, color:'var(--green)', fontSize:'15px', textShadow:'0 0 10px var(--green)' }}>
                        {formatSAR(a.value)}
                      </div>
                      <div style={{ fontSize:'10px', color:'var(--w40)' }}>
                        {totalAssets>0?((a.value/totalAssets)*100).toFixed(1):'0'}% of total
                      </div>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:'6px', justifyContent:'flex-end' }}>
                        <button className="btn btn-ghost" style={{ padding:'6px 10px', fontSize:'12px' }} onClick={()=>openEdit(a)}>
                          <Edit2 size={12}/>
                        </button>
                        <button className="btn btn-danger" style={{ padding:'6px 10px', fontSize:'12px' }} onClick={()=>setConfirm(a.id)}>
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modal} onClose={()=>setModal(false)} title={editing ? 'Edit Asset' : 'Add Asset'} accent="blue">
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>ASSET NAME</label>
            <input className="inp" placeholder="e.g. TASI Portfolio, Crypto…" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>TYPE</label>
              <select className="inp" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                {ASSET_TYPES.map(t=><option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>LIQUIDITY</label>
              <select className="inp" value={String(form.liquid)} onChange={e=>setForm(f=>({...f,liquid:e.target.value==='true'}))}>
                <option value="true">💧 Liquid</option>
                <option value="false">🔒 Locked / Illiquid</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>CURRENT VALUE (SAR)</label>
            <input className="inp" type="number" min="0" step="0.01" placeholder="0.00" value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))} />
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>NOTES (optional)</label>
            <input className="inp" placeholder="Any detail or reminder…" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
          </div>
          <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
            <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-b" style={{ flex:1 }} onClick={handleSave}>{editing?'Save Changes':'Add Asset'}</button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!confirm} onClose={()=>setConfirm(null)} title="Delete Asset?" accent="pink">
        <p style={{ color:'var(--w70)', marginBottom:'24px', fontSize:'14px', lineHeight:1.6 }}>
          This will permanently remove the asset from your tracker. Your net worth total will update immediately.
        </p>
        <div style={{ display:'flex', gap:'10px' }}>
          <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" style={{ flex:1 }} onClick={()=>handleDelete(confirm)}>Yes, Delete</button>
        </div>
      </Modal>
    </div>
  );
}
