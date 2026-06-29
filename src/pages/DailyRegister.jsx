import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, CalendarDays } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import Modal from '../components/Modal';
import { formatSAR, today } from '../utils/helpers';

export default function DailyRegister() {
  const { categories, getDayTx, addTransaction, deleteTransaction } = useFinance();
  const [selectedDate, setSelectedDate] = useState(today());
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type:'expense', category:'', description:'', amount:'' });

  const txs = useMemo(() => getDayTx(selectedDate), [getDayTx, selectedDate]);
  const income   = txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expenses = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);

  const shiftDay = (n) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + n);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const dateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-SA', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  });
  const isToday = selectedDate === today();

  const expCats = categories.filter(c=>c.type==='expense');
  const incCats = categories.filter(c=>c.type==='income');

  const handleAdd = () => {
    if (!form.category || !form.amount) return;
    addTransaction({ ...form, date: selectedDate, amount: parseFloat(form.amount) });
    setForm({ type:'expense', category:'', description:'', amount:'' });
    setModal(false);
  };

  const catOf = (name) => categories.find(c=>c.name===name);

  return (
    <div style={{ padding:'28px', minHeight:'100vh', background:'var(--bg)' }} className="grid-bg">

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <h1 className="orb" style={{ fontSize:'22px', fontWeight:700, color:'var(--blue)', textShadow:'0 0 16px var(--blue)' }}>Daily Register</h1>
          <p style={{ fontSize:'13px', color:'var(--w40)', marginTop:'4px' }}>Track every riyal, every day.</p>
        </div>
        <button className="btn btn-p" onClick={()=>setModal(true)}>
          <Plus size={14}/> Add Entry
        </button>
      </div>

      {/* Date navigator */}
      <div className="card ring-blue" style={{ padding:'20px 24px', marginBottom:'24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <button className="btn btn-ghost" onClick={()=>shiftDay(-1)}><ChevronLeft size={16}/></button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'13px', color:'var(--w40)', marginBottom:'4px', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
            <CalendarDays size={13} color="var(--blue)" />
            {isToday && <span className="badge badge-b">TODAY</span>}
          </div>
          <div className="orb" style={{ fontSize:'18px', fontWeight:700, color:'var(--white)' }}>{dateLabel}</div>
        </div>
        <button className="btn btn-ghost" onClick={()=>shiftDay(1)} disabled={selectedDate >= today()}>
          <ChevronRight size={16}/>
        </button>
      </div>

      {/* Day summary */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginBottom:'24px' }}>
        {[
          { label:'Income',   value:income,          color:'var(--green)', sign:'+' },
          { label:'Expenses', value:expenses,         color:'var(--pink)',  sign:'-' },
          { label:'Net',      value:income-expenses,  color: income-expenses>=0 ? 'var(--green)':'var(--pink)', sign: income-expenses>=0?'+':'' },
        ].map((s,i)=>(
          <div key={i} className="card" style={{ padding:'18px', textAlign:'center' }}>
            <div style={{ fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--w40)', marginBottom:'8px' }}>{s.label}</div>
            <div className="orb" style={{ fontSize:'22px', fontWeight:700, color:s.color, textShadow:`0 0 16px ${s.color}` }}>
              {s.sign}{formatSAR(Math.abs(s.value))}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div className="card" style={{ padding:'24px' }}>
        <div className="sec-label">{txs.length} Entries for this day</div>
        {txs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px', opacity:.3 }}>📋</div>
            <div style={{ color:'var(--w40)', fontSize:'14px' }}>No entries for this day.</div>
            <div style={{ color:'var(--w40)', fontSize:'12px', marginTop:'4px' }}>Click <strong style={{ color:'var(--pink)' }}>Add Entry</strong> to log a transaction.</div>
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th style={{ textAlign:'right' }}>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {txs.map(tx => {
                const cat = catOf(tx.category);
                return (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <span style={{ fontSize:'18px' }}>{cat?.icon || '💸'}</span>
                        <span style={{ fontSize:'13px', color:'var(--w70)' }}>{tx.category}</span>
                      </div>
                    </td>
                    <td style={{ color:'var(--w70)', fontSize:'13px' }}>{tx.description || '—'}</td>
                    <td style={{ textAlign:'right' }}>
                      <span className="orb" style={{ fontWeight:700, color: tx.type==='income'?'var(--green)':'var(--pink)' }}>
                        {tx.type==='income'?'+':'-'}{formatSAR(tx.amount)}
                      </span>
                    </td>
                    <td style={{ textAlign:'right' }}>
                      <button className="btn btn-danger" style={{ padding:'5px 10px', fontSize:'11px' }} onClick={()=>deleteTransaction(tx.id)}>
                        <Trash2 size={12}/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Budget hints */}
      {txs.length > 0 && (
        <div className="card" style={{ padding:'20px 24px', marginTop:'20px' }}>
          <div className="sec-label">Category Budget Status</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {(() => {
              const spent = {};
              txs.filter(t=>t.type==='expense').forEach(t=>{ spent[t.category]=(spent[t.category]||0)+t.amount; });
              return Object.entries(spent).map(([cat, amount]) => {
                const c = catOf(cat);
                const budget = c?.budget || 0;
                const pct = budget > 0 ? Math.min((amount/budget)*100, 100) : 0;
                const over = budget > 0 && amount > budget;
                return (
                  <div key={cat}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'12px' }}>
                      <span style={{ color:'var(--w70)' }}>{c?.icon} {cat}</span>
                      <span style={{ color: over?'var(--red)':'var(--w70)' }}>
                        {formatSAR(amount)} {budget>0 && `/ ${formatSAR(budget)} monthly`}
                      </span>
                    </div>
                    {budget > 0 && (
                      <div className="progress-track" style={{ height:'6px' }}>
                        <div style={{ width:`${pct}%`, height:'100%', borderRadius:'4px', background: over?'var(--red)':'var(--blue)', boxShadow: over?'0 0 8px var(--red)':'0 0 8px var(--blue)', transition:'width .5s ease' }} />
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal open={modal} onClose={()=>setModal(false)} title="Add Entry" accent="blue">
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>TYPE</label>
              <select className="inp" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value,category:''}))}>
                <option value="expense">💸 Expense</option>
                <option value="income">💰 Income</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>DATE</label>
              <div className="inp" style={{ cursor:'default', color:'var(--w70)' }}>{selectedDate}</div>
            </div>
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>CATEGORY</label>
            <select className="inp" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              <option value="">Select…</option>
              {(form.type==='expense'?expCats:incCats).map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>DESCRIPTION (optional)</label>
            <input className="inp" placeholder="Note…" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>AMOUNT (SAR)</label>
            <input className="inp" type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} />
          </div>
          <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
            <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-b" style={{ flex:1 }} onClick={handleAdd}>Save Entry</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
