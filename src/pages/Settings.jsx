import React, { useState } from 'react';
import { Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import Modal from '../components/Modal';
import { formatSAR } from '../utils/helpers';
import { seedCategories, seedTransactions, seedAssets, seedSettings } from '../data/seedData';

const ICONS = ['💸','🏠','🚗','🍽️','⛽','📱','💡','🎬','🤖','☁️','🚬','✈️','👩','🚘','💼','🏡','🎁','💰','🏥','🛒','💎','📈','🏦'];

export default function Settings() {
  const { settings, setSettings, categories, addCategory, editCategory, deleteCategory,
          setTransactions, setAssets, setCategories } = useFinance();

  const [cfg, setCfg] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [catModal, setCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ name:'', icon:'💸', type:'expense', budget:'', fixed:false });
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSave = () => {
    setSettings(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addCat = () => {
    if (!catForm.name) return;
    addCategory({ ...catForm, budget: parseFloat(catForm.budget)||0 });
    setCatForm({ name:'', icon:'💸', type:'expense', budget:'', fixed:false });
    setCatModal(false);
  };

  const handleReset = () => {
    setSettings(seedSettings);
    setCfg(seedSettings);
    localStorage.clear();
    window.location.reload();
  };

  const expCats = categories.filter(c=>c.type==='expense');
  const incCats = categories.filter(c=>c.type==='income');

  return (
    <div style={{ padding:'28px', minHeight:'100vh', background:'var(--bg)' }} className="grid-bg">

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <h1 className="orb" style={{ fontSize:'22px', fontWeight:700, color:'var(--yellow)', textShadow:'0 0 16px var(--yellow)' }}>Settings</h1>
          <p style={{ fontSize:'13px', color:'var(--w40)', marginTop:'4px' }}>Configure your financial profile.</p>
        </div>
        <button className="btn btn-p" onClick={handleSave}>
          <Save size={14}/> {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Profile */}
      <div className="card" style={{ padding:'24px', marginBottom:'20px' }}>
        <div className="sec-label">Profile</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>YOUR NAME</label>
            <input className="inp" value={cfg.name} onChange={e=>setCfg(c=>({...c,name:e.target.value}))} />
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>CURRENCY</label>
            <input className="inp" value={cfg.currency} onChange={e=>setCfg(c=>({...c,currency:e.target.value}))} />
          </div>
        </div>
      </div>

      {/* Income */}
      <div className="card" style={{ padding:'24px', marginBottom:'20px' }}>
        <div className="sec-label">Income Configuration</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>MONTHLY SALARY (SAR)</label>
            <input className="inp" type="number" value={cfg.monthlySalary} onChange={e=>setCfg(c=>({...c,monthlySalary:parseFloat(e.target.value)||0}))} />
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>ADDITIONAL MONTHLY INCOME (SAR)</label>
            <input className="inp" type="number" value={cfg.additionalIncome} onChange={e=>setCfg(c=>({...c,additionalIncome:parseFloat(e.target.value)||0}))} />
            <div style={{ fontSize:'10px', color:'var(--w40)', marginTop:'4px' }}>e.g. Villa rental income</div>
          </div>
        </div>
        <div style={{ marginTop:'12px', padding:'14px', background:'rgba(0,212,255,0.05)', borderRadius:'10px', border:'1px solid rgba(0,212,255,0.15)' }}>
          <span style={{ fontSize:'12px', color:'var(--w70)' }}>Total monthly income: </span>
          <span className="orb nb" style={{ fontSize:'16px', fontWeight:700 }}>{formatSAR((cfg.monthlySalary||0)+(cfg.additionalIncome||0))}</span>
        </div>
      </div>

      {/* Goal */}
      <div className="card" style={{ padding:'24px', marginBottom:'20px' }}>
        <div className="sec-label">Goal Configuration</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>GOAL NAME</label>
            <input className="inp" value={cfg.goalName} onChange={e=>setCfg(c=>({...c,goalName:e.target.value}))} />
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>TARGET DATE</label>
            <input className="inp" type="date" value={cfg.targetDate} onChange={e=>setCfg(c=>({...c,targetDate:e.target.value}))} />
          </div>
        </div>
        <div>
          <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>GOAL DESCRIPTION</label>
          <input className="inp" value={cfg.goalDesc} onChange={e=>setCfg(c=>({...c,goalDesc:e.target.value}))} />
        </div>
      </div>

      {/* House Loan */}
      <div className="card" style={{ padding:'24px', marginBottom:'20px' }}>
        <div className="sec-label">House Loan Details</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>REMAINING BALANCE (SAR)</label>
            <input className="inp" type="number" value={cfg.houseLoanBalance} onChange={e=>setCfg(c=>({...c,houseLoanBalance:parseFloat(e.target.value)||0}))} />
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>MONTHLY INSTALLMENT</label>
            <input className="inp" type="number" value={cfg.houseLoanMonthly} onChange={e=>setCfg(c=>({...c,houseLoanMonthly:parseFloat(e.target.value)||0}))} />
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>MONTHS REMAINING</label>
            <input className="inp" type="number" value={cfg.houseLoanRemaining} onChange={e=>setCfg(c=>({...c,houseLoanRemaining:parseInt(e.target.value)||0}))} />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="card" style={{ padding:'24px', marginBottom:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
          <div className="sec-label" style={{ marginBottom:0 }}>Expense Categories ({expCats.length})</div>
          <button className="btn btn-p" style={{ fontSize:'12px', padding:'7px 14px' }} onClick={()=>{setCatForm({name:'',icon:'💸',type:'expense',budget:'',fixed:false});setCatModal(true);}}>
            <Plus size={13}/> Add Category
          </button>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'20px' }}>
          {expCats.map(c=>(
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 14px', background:'rgba(255,255,255,0.04)', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.08)' }}>
              <span>{c.icon}</span>
              <div>
                <div style={{ fontSize:'12px', fontWeight:600 }}>{c.name}</div>
                {c.budget > 0 && <div style={{ fontSize:'10px', color:'var(--w40)' }}>{formatSAR(c.budget)}/mo</div>}
              </div>
              <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--w40)', padding:'0 0 0 4px' }} onClick={()=>deleteCategory(c.id)}>
                <Trash2 size={12}/>
              </button>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
          <div className="sec-label" style={{ marginBottom:0 }}>Income Categories ({incCats.length})</div>
          <button className="btn btn-ghost" style={{ fontSize:'12px', padding:'7px 14px' }} onClick={()=>{setCatForm({name:'',icon:'💰',type:'income',budget:'',fixed:false});setCatModal(true);}}>
            <Plus size={13}/> Add Income Type
          </button>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
          {incCats.map(c=>(
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 14px', background:'rgba(0,255,136,0.05)', borderRadius:'10px', border:'1px solid rgba(0,255,136,0.1)' }}>
              <span>{c.icon}</span>
              <div>
                <div style={{ fontSize:'12px', fontWeight:600, color:'var(--green)' }}>{c.name}</div>
                {c.budget > 0 && <div style={{ fontSize:'10px', color:'var(--w40)' }}>{formatSAR(c.budget)}/mo</div>}
              </div>
              <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--w40)', padding:'0 0 0 4px' }} onClick={()=>deleteCategory(c.id)}>
                <Trash2 size={12}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ padding:'24px', borderColor:'rgba(255,68,102,0.3)', boxShadow:'0 0 20px rgba(255,68,102,0.08)' }}>
        <div className="sec-label" style={{ color:'var(--red)' }}>Danger Zone</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontWeight:600, fontSize:'14px', marginBottom:'4px' }}>Reset to Default Data</div>
            <div style={{ fontSize:'12px', color:'var(--w40)' }}>Clears all transactions and resets to Khalid's pre-loaded profile.</div>
          </div>
          <button className="btn btn-danger" onClick={()=>setResetConfirm(true)}>
            <RefreshCw size={14}/> Reset App
          </button>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal open={catModal} onClose={()=>setCatModal(false)} title="Add Category" accent="blue">
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>ICON</label>
              <select className="inp" value={catForm.icon} onChange={e=>setCatForm(f=>({...f,icon:e.target.value}))}>
                {ICONS.map(i=><option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>TYPE</label>
              <select className="inp" value={catForm.type} onChange={e=>setCatForm(f=>({...f,type:e.target.value}))}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>CATEGORY NAME</label>
            <input className="inp" placeholder="e.g. Gym, Maintenance…" value={catForm.name} onChange={e=>setCatForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>MONTHLY BUDGET (SAR, optional)</label>
            <input className="inp" type="number" placeholder="0" value={catForm.budget} onChange={e=>setCatForm(f=>({...f,budget:e.target.value}))} />
          </div>
          <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
            <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setCatModal(false)}>Cancel</button>
            <button className="btn btn-b" style={{ flex:1 }} onClick={addCat}>Add Category</button>
          </div>
        </div>
      </Modal>

      {/* Reset Confirm */}
      <Modal open={resetConfirm} onClose={()=>setResetConfirm(false)} title="⚠️ Reset Everything?" accent="pink">
        <p style={{ color:'var(--w70)', marginBottom:'24px', fontSize:'14px', lineHeight:1.7 }}>
          This will <strong style={{ color:'var(--red)' }}>permanently delete</strong> all your transactions and reset everything to default. This cannot be undone.
        </p>
        <div style={{ display:'flex', gap:'10px' }}>
          <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setResetConfirm(false)}>Cancel</button>
          <button className="btn btn-danger" style={{ flex:2 }} onClick={handleReset}>Yes, Reset Everything</button>
        </div>
      </Modal>
    </div>
  );
}
