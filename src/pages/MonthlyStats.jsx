import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { formatSAR, CHART_COLORS, daysInMonth } from '../utils/helpers';

export default function MonthlyStats() {
  const { getMonthTx, categories, settings } = useFinance();
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const shiftMonth = (n) => {
    let m = month + n, y = year;
    if (m > 12) { m = 1; y++; }
    if (m < 1)  { m = 12; y--; }
    setMonth(m); setYear(y);
  };

  const txs      = useMemo(() => getMonthTx(year, month), [getMonthTx, year, month]);
  const income   = txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expenses = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const net      = income - expenses;

  const monthLabel = new Date(year, month-1, 1).toLocaleDateString('en-SA', { month:'long', year:'numeric' });

  // Category bar data
  const catBar = useMemo(() => {
    const m = {};
    txs.filter(t=>t.type==='expense').forEach(t=>{ m[t.category]=(m[t.category]||0)+t.amount; });
    return Object.entries(m)
      .map(([name,amount])=>({ name, amount, budget: categories.find(c=>c.name===name)?.budget||0 }))
      .sort((a,b)=>b.amount-a.amount);
  }, [txs, categories]);

  // Daily line
  const dailyLine = useMemo(() => {
    const days = daysInMonth(year, month);
    return Array.from({length:days},(_,i)=>{
      const day = i+1;
      const ds  = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const sp  = txs.filter(t=>t.date===ds&&t.type==='expense').reduce((s,t)=>s+t.amount,0);
      return { day: String(day), spent: sp };
    });
  }, [txs, year, month]);

  // Pie data
  const pie = useMemo(() => {
    const m = {};
    txs.filter(t=>t.type==='expense').forEach(t=>{ m[t.category]=(m[t.category]||0)+t.amount; });
    return Object.entries(m).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  }, [txs]);

  const savingsRate = income > 0 ? ((net/income)*100).toFixed(1) : '0.0';

  return (
    <div style={{ padding:'28px', minHeight:'100vh', background:'var(--bg)' }} className="grid-bg">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <h1 className="orb" style={{ fontSize:'22px', fontWeight:700, color:'var(--pink)', textShadow:'0 0 16px var(--pink)' }}>Monthly Stats</h1>
          <p style={{ fontSize:'13px', color:'var(--w40)', marginTop:'4px' }}>Deep-dive into your monthly flow.</p>
        </div>
        {/* Month nav */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button className="btn btn-ghost" onClick={()=>shiftMonth(-1)}><ChevronLeft size={16}/></button>
          <span className="orb" style={{ fontSize:'14px', fontWeight:600, color:'var(--white)', minWidth:'160px', textAlign:'center' }}>{monthLabel}</span>
          <button className="btn btn-ghost" onClick={()=>shiftMonth(1)}><ChevronRight size={16}/></button>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
        {[
          { l:'Total Income',  v:income,        c:'var(--green)',  sign:'+' },
          { l:'Total Spent',   v:expenses,      c:'var(--pink)',   sign:'-' },
          { l:'Net Saved',     v:Math.abs(net), c: net>=0?'var(--green)':'var(--red)', sign: net>=0?'+':'-' },
          { l:'Savings Rate',  v:`${savingsRate}%`, c:'var(--blue)', sign:'' },
        ].map((s,i)=>(
          <div key={i} className="card" style={{ padding:'18px', textAlign:'center' }}>
            <div style={{ fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--w40)', marginBottom:'8px' }}>{s.l}</div>
            <div className="orb" style={{ fontSize:'20px', fontWeight:700, color:s.c, textShadow:`0 0 14px ${s.c}` }}>
              {s.sign}{i<3?formatSAR(s.v):s.v}
            </div>
          </div>
        ))}
      </div>

      {/* Category bar vs budget */}
      <div className="card" style={{ padding:'24px', marginBottom:'20px' }}>
        <div className="sec-label">Expenses vs Budget by Category</div>
        {catBar.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={catBar} margin={{ top:5,right:10,left:-10,bottom:40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill:'rgba(255,255,255,0.4)', fontSize:10 }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fill:'rgba(255,255,255,0.4)', fontSize:10 }} />
              <Tooltip formatter={v=>[formatSAR(v)]} contentStyle={{ background:'#0c0c22', border:'1px solid #FF2D78', borderRadius:'10px', color:'#fff' }} />
              <Legend wrapperStyle={{ paddingTop:'30px', fontSize:'11px', color:'rgba(255,255,255,0.5)' }} />
              <Bar dataKey="amount" name="Actual Spend" fill="#FF2D78" radius={[4,4,0,0]}>
                {catBar.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} />)}
              </Bar>
              <Bar dataKey="budget" name="Monthly Budget" fill="rgba(255,255,255,0.1)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--w40)', fontSize:'13px' }}>
            No expense transactions for {monthLabel}
          </div>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'20px', marginBottom:'20px' }}>
        {/* Daily spend line */}
        <div className="card" style={{ padding:'24px' }}>
          <div className="sec-label">Daily Spending — {monthLabel}</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyLine} margin={{ top:5,right:5,left:-20,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:9 }} />
              <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:9 }} />
              <Tooltip formatter={v=>[formatSAR(v),'Spent']} contentStyle={{ background:'#0c0c22', border:'1px solid #00D4FF', borderRadius:'10px', color:'#fff' }} />
              <Line type="monotone" dataKey="spent" stroke="#00D4FF" strokeWidth={2} dot={false} activeDot={{ r:5, fill:'#00D4FF' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="card" style={{ padding:'24px' }}>
          <div className="sec-label">Expense Distribution</div>
          {pie.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pie.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v=>[formatSAR(v)]} contentStyle={{ background:'#0c0c22', border:'1px solid #00D4FF', borderRadius:'10px', color:'#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', flexDirection:'column', gap:'5px', marginTop:'8px' }}>
                {pie.slice(0,5).map((p,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'11px' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--w70)' }}>
                      <span style={{ width:8,height:8,borderRadius:'50%',background:CHART_COLORS[i%CHART_COLORS.length],display:'inline-block' }} />
                      {p.name}
                    </span>
                    <span style={{ color:'var(--w40)' }}>{formatSAR(p.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--w40)', fontSize:'13px' }}>No data</div>
          )}
        </div>
      </div>

      {/* Transaction list */}
      <div className="card" style={{ padding:'24px' }}>
        <div className="sec-label">{txs.length} transactions in {monthLabel}</div>
        {txs.length === 0 ? (
          <div style={{ textAlign:'center', color:'var(--w40)', padding:'40px', fontSize:'13px' }}>No transactions recorded for this month.</div>
        ) : (
          <table className="tbl">
            <thead><tr><th>Date</th><th>Category</th><th>Description</th><th style={{ textAlign:'right' }}>Amount</th></tr></thead>
            <tbody>
              {txs.sort((a,b)=>b.date.localeCompare(a.date)).map(tx=>{
                const cat = categories.find(c=>c.name===tx.category);
                return (
                  <tr key={tx.id}>
                    <td style={{ color:'var(--w40)', fontSize:'12px' }}>{tx.date}</td>
                    <td><span style={{ fontSize:'15px' }}>{cat?.icon||'💸'}</span> <span style={{ color:'var(--w70)', fontSize:'13px' }}>{tx.category}</span></td>
                    <td style={{ color:'var(--w40)', fontSize:'12px' }}>{tx.description||'—'}</td>
                    <td style={{ textAlign:'right' }}>
                      <span className="orb" style={{ fontWeight:700, fontSize:'13px', color: tx.type==='income'?'var(--green)':'var(--pink)' }}>
                        {tx.type==='income'?'+':'-'}{formatSAR(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
