import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Target, TrendingUp, TrendingDown, Zap, Plus, ArrowUpRight } from 'lucide-react';
import { formatSAR, CHART_COLORS, today } from '../utils/helpers';
import Modal from '../components/Modal';
import { useFinance as useFin } from '../context/FinanceContext';

export default function Dashboard() {
  const { transactions, assets, categories, settings, totalAssets, goalProgress, addTransaction } = useFinance();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ date: today(), type:'expense', category:'', description:'', amount:'' });

  const now = new Date();
  const yr = now.getFullYear(), mo = now.getMonth() + 1;

  const monthTx = useMemo(() =>
    transactions.filter(t => { const d = new Date(t.date); return d.getFullYear()===yr && d.getMonth()+1===mo; }),
    [transactions, yr, mo]
  );

  const income   = useMemo(() => monthTx.filter(t => t.type==='income').reduce((s,t)=>s+t.amount,0),  [monthTx]);
  const expenses = useMemo(() => monthTx.filter(t => t.type==='expense').reduce((s,t)=>s+t.amount,0), [monthTx]);
  const freeCash = income - expenses;
  const savingsRate = income > 0 ? ((freeCash/income)*100).toFixed(1) : '0.0';

  // 30-day area chart
  const area30 = useMemo(() => {
    const res = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const spent = transactions.filter(t=>t.date===ds&&t.type==='expense').reduce((s,t)=>s+t.amount,0);
      res.push({ date: ds.slice(8), spent });
    }
    return res;
  }, [transactions]);

  // Pie by category
  const pie = useMemo(() => {
    const m = {};
    monthTx.filter(t=>t.type==='expense').forEach(t => { m[t.category]=(m[t.category]||0)+t.amount; });
    return Object.entries(m).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,8);
  }, [monthTx]);

  const recent = transactions.slice(0, 6);
  const gap    = settings.houseLoanBalance - totalAssets;

  const expCats  = categories.filter(c=>c.type==='expense');
  const incCats  = categories.filter(c=>c.type==='income');

  const handleAdd = () => {
    if (!form.category || !form.amount) return;
    addTransaction({ ...form, amount: parseFloat(form.amount) });
    setForm({ date:today(), type:'expense', category:'', description:'', amount:'' });
    setModal(false);
  };

  const KPI = ({ label, value, sub, color, Icon, trend }) => (
    <div className="card" style={{ padding:'22px 18px', borderLeft:`2px solid ${color}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{ fontSize:'9px', letterSpacing:'2.5px', textTransform:'uppercase', color:'var(--w40)' }}>{label}</span>
        <Icon size={15} color={color} />
      </div>
      <div className="orb" style={{ fontSize:'22px', fontWeight:700, color, textShadow:`0 0 16px ${color}`, margin:'10px 0 4px' }}>{value}</div>
      <div style={{ fontSize:'11px', color:'var(--w40)' }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ padding:'28px', minHeight:'100vh', background:'var(--bg)' }} className="grid-bg">

      {/* Hero — Goal */}
      <div className="card ring-pink pulse-p" style={{ padding:'32px', marginBottom:'24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 20% 60%, rgba(255,45,120,0.07) 0%,transparent 60%), radial-gradient(ellipse at 80% 40%, rgba(0,212,255,0.05) 0%,transparent 60%)' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
            <Target size={16} color="var(--pink)" />
            <span style={{ fontSize:'9px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--w40)' }}>
              {settings.goalName}
            </span>
          </div>

          <div style={{ display:'flex', alignItems:'flex-end', gap:'16px', flexWrap:'wrap', marginBottom:'6px' }}>
            <div className="orb" style={{ fontSize:'44px', fontWeight:900, lineHeight:1, background:'linear-gradient(135deg,#FF2D78,#00D4FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              {goalProgress.toFixed(1)}%
            </div>
            <div style={{ paddingBottom:'6px' }}>
              <div className="orb nb" style={{ fontSize:'20px', fontWeight:700 }}>{formatSAR(totalAssets)}</div>
              <div style={{ fontSize:'12px', color:'var(--w40)' }}>achieved of {formatSAR(settings.houseLoanBalance)}</div>
            </div>
          </div>

          <div style={{ marginTop:'16px' }}>
            <div className="progress-track" style={{ height:'14px', marginBottom:'8px' }}>
              <div className="progress-fill-p" style={{ width:`${goalProgress}%` }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'var(--w40)' }}>
              <span>Remaining: <span className="np" style={{ fontWeight:600 }}>{formatSAR(gap)}</span></span>
              <span>{settings.houseLoanRemaining} loan installments left</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
        <KPI label="Monthly Income"  value={formatSAR(income||37767,true)}   sub="Salary + Rental"   color="var(--blue)"   Icon={TrendingUp}   />
        <KPI label="Monthly Spend"   value={formatSAR(expenses||24226,true)} sub="All categories"    color="var(--pink)"   Icon={TrendingDown} />
        <KPI label="Free Cash"       value={formatSAR(freeCash||13541,true)} sub="Available to save" color="var(--green)"  Icon={Zap}          />
        <KPI label="Savings Rate"    value={`${savingsRate}%`}              sub="Of total income"   color="var(--purple)" Icon={ArrowUpRight}  />
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:'20px', marginBottom:'24px' }}>
        <div className="card" style={{ padding:'24px' }}>
          <div className="sec-label">30-Day Spending Trend</div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={area30} margin={{ top:5,right:5,left:-20,bottom:0 }}>
              <defs>
                <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF2D78" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#FF2D78" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:9 }} />
              <YAxis  tick={{ fill:'rgba(255,255,255,0.3)', fontSize:9 }} />
              <Tooltip formatter={v=>[formatSAR(v),'Spent']} contentStyle={{ background:'#0c0c22', border:'1px solid #FF2D78', borderRadius:'10px', color:'#fff' }} />
              <Area type="monotone" dataKey="spent" stroke="#FF2D78" fill="url(#ag1)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding:'24px' }}>
          <div className="sec-label">Expense Breakdown</div>
          {pie.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={pie} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="value">
                    {pie.map((_,i) => <Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v=>[formatSAR(v)]} contentStyle={{ background:'#0c0c22', border:'1px solid #00D4FF', borderRadius:'10px', color:'#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'8px' }}>
                {pie.slice(0,4).map((p,i)=>(
                  <span key={i} style={{ fontSize:'10px', color:'var(--w70)', display:'flex', alignItems:'center', gap:'4px' }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:CHART_COLORS[i%CHART_COLORS.length], display:'inline-block' }} />
                    {p.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height:190, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--w40)', fontSize:'13px', textAlign:'center' }}>
              No transactions<br/>this month yet
            </div>
          )}
        </div>
      </div>

      {/* Recent + Quick Add */}
      <div className="card" style={{ padding:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
          <div className="sec-label" style={{ marginBottom:0 }}>Recent Transactions</div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button className="btn btn-ghost" style={{ fontSize:'12px', padding:'7px 14px' }} onClick={()=>navigate('/daily')}>
              View All
            </button>
            <button className="btn btn-p" style={{ fontSize:'12px', padding:'7px 14px' }} onClick={()=>setModal(true)}>
              <Plus size={14}/> Add
            </button>
          </div>
        </div>

        {recent.length === 0 ? (
          <div style={{ textAlign:'center', color:'var(--w40)', padding:'40px', fontSize:'13px' }}>
            No transactions yet — click <strong>Add</strong> to get started!
          </div>
        ) : (
          <div>
            {recent.map(tx => {
              const cat = categories.find(c=>c.name===tx.category);
              return (
                <div key={tx.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:36, height:36, borderRadius:'10px', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'17px' }}>
                      {cat?.icon || '💸'}
                    </div>
                    <div>
                      <div style={{ fontWeight:500, fontSize:'14px' }}>{tx.description || tx.category}</div>
                      <div style={{ fontSize:'11px', color:'var(--w40)' }}>{tx.category} · {tx.date}</div>
                    </div>
                  </div>
                  <div className="orb" style={{ fontWeight:700, color: tx.type==='income'?'var(--green)':'var(--pink)', textShadow: tx.type==='income'?'0 0 10px var(--green)':'0 0 10px var(--pink)' }}>
                    {tx.type==='income'?'+':'-'}{formatSAR(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick-Add Modal */}
      <Modal open={modal} onClose={()=>setModal(false)} title="Quick Add Transaction" accent="pink">
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>TYPE</label>
              <select className="inp" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value,category:''}))}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>DATE</label>
              <input className="inp" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
            </div>
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>CATEGORY</label>
            <select className="inp" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              <option value="">Select category…</option>
              {(form.type==='expense'?expCats:incCats).map(c=>(
                <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>DESCRIPTION</label>
            <input className="inp" placeholder="Optional note…" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
          </div>
          <div>
            <label style={{ fontSize:'11px', color:'var(--w40)', letterSpacing:'1px', marginBottom:'6px', display:'block' }}>AMOUNT (SAR)</label>
            <input className="inp" type="number" placeholder="0.00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} />
          </div>
          <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
            <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-p" style={{ flex:1 }} onClick={handleAdd}>Save Transaction</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
