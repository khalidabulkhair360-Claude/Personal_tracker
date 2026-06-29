import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Award, Target, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { formatSAR, getLast12Months, CHART_COLORS } from '../utils/helpers';

export default function AnnualStats() {
  const { getMonthTx, totalAssets, goalProgress, settings } = useFinance();
  const [year, setYear] = useState(new Date().getFullYear());

  // Full year data (Jan–Dec)
  const yearData = useMemo(() => {
    return Array.from({length:12}, (_,i) => {
      const mo   = i + 1;
      const txs  = getMonthTx(year, mo);
      const inc  = txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
      const exp  = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
      const net  = inc - exp;
      const label= new Date(year,i,1).toLocaleDateString('en-SA',{month:'short'});
      return { label, income:inc, expenses:exp, net, savingsRate: inc>0?+((net/inc)*100).toFixed(1):0 };
    });
  }, [getMonthTx, year]);

  const totalInc  = yearData.reduce((s,d)=>s+d.income,0);
  const totalExp  = yearData.reduce((s,d)=>s+d.expenses,0);
  const totalNet  = totalInc - totalExp;
  const avgSaving = yearData.filter(d=>d.income>0).reduce((s,d)=>s+d.savingsRate,0) / (yearData.filter(d=>d.income>0).length||1);
  const bestMonth = [...yearData].sort((a,b)=>b.net-a.net)[0];
  const worstMo   = [...yearData].filter(d=>d.expenses>0).sort((a,b)=>a.net-b.net)[0];

  // Cumulative savings curve
  const cumulative = useMemo(() => {
    let cum = 0;
    return yearData.map(d => { cum += d.net; return { label:d.label, cumulative: cum }; });
  }, [yearData]);

  // Performance score 0–100
  const score = useMemo(() => {
    const sr = Math.min(avgSaving, 50);
    const gp = Math.min(goalProgress, 100);
    return Math.round((sr/50)*60 + (gp/100)*40);
  }, [avgSaving, goalProgress]);

  const scoreColor = score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--yellow)' : 'var(--red)';
  const scoreLabel = score >= 70 ? 'EXCELLENT' : score >= 40 ? 'ON TRACK' : 'NEEDS ATTENTION';

  // Timeline to break-even
  const monthlyFree = totalNet / Math.max(yearData.filter(d=>d.income>0).length, 1);
  const gap = settings.houseLoanBalance - totalAssets;
  const monthsLeft = monthlyFree > 0 ? Math.ceil(gap / monthlyFree) : 999;
  const yearsLeft  = (monthsLeft / 12).toFixed(1);

  return (
    <div style={{ padding:'28px', minHeight:'100vh', background:'var(--bg)' }} className="grid-bg">

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <h1 className="orb" style={{ fontSize:'22px', fontWeight:700, color:'var(--purple)', textShadow:'0 0 16px var(--purple)' }}>Annual Stats</h1>
          <p style={{ fontSize:'13px', color:'var(--w40)', marginTop:'4px' }}>Your yearly financial performance.</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button className="btn btn-ghost" onClick={()=>setYear(y=>y-1)}><ChevronLeft size={16}/></button>
          <span className="orb" style={{ fontSize:'18px', fontWeight:700, color:'var(--white)' }}>{year}</span>
          <button className="btn btn-ghost" onClick={()=>setYear(y=>y+1)}><ChevronRight size={16}/></button>
        </div>
      </div>

      {/* Performance Score + KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:'20px', marginBottom:'24px' }}>
        {/* Score */}
        <div className="card ring-pink" style={{ padding:'24px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <Award size={20} color="var(--pink)" style={{ marginBottom:'8px' }} />
          <div style={{ fontSize:'9px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--w40)', marginBottom:'10px' }}>
            PERF SCORE
          </div>
          <div className="orb" style={{ fontSize:'52px', fontWeight:900, color:scoreColor, textShadow:`0 0 24px ${scoreColor}`, lineHeight:1 }}>
            {score}
          </div>
          <div style={{ fontSize:'9px', letterSpacing:'2px', color:scoreColor, marginTop:'8px', fontWeight:700 }}>{scoreLabel}</div>
          <div className="progress-track" style={{ width:'100%', marginTop:'14px', height:'6px' }}>
            <div style={{ width:`${score}%`, height:'100%', borderRadius:'4px', background:scoreColor, boxShadow:`0 0 10px ${scoreColor}`, transition:'width 1s ease' }} />
          </div>
        </div>

        {/* KPI grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
          {[
            { l:'Annual Income',   v:totalInc,     c:'var(--green)',  f:true  },
            { l:'Annual Expenses', v:totalExp,     c:'var(--pink)',   f:true  },
            { l:'Net Saved',       v:totalNet,     c: totalNet>=0?'var(--green)':'var(--red)', f:true },
            { l:'Avg Savings Rate',v:`${avgSaving.toFixed(1)}%`, c:'var(--blue)',  f:false },
            { l:'Best Month',      v:bestMonth?.label||'—',      c:'var(--green)', f:false, sub:bestMonth?.net?formatSAR(bestMonth.net):''},
            { l:'Months to Goal',  v:`${monthsLeft}mo`,          c:'var(--yellow)',f:false, sub:`≈ ${yearsLeft} yrs` },
          ].map((k,i)=>(
            <div key={i} className="card" style={{ padding:'16px' }}>
              <div style={{ fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--w40)', marginBottom:'8px' }}>{k.l}</div>
              <div className="orb" style={{ fontSize:'17px', fontWeight:700, color:k.c, textShadow:`0 0 12px ${k.c}` }}>
                {k.f ? formatSAR(k.v, true) : k.v}
              </div>
              {k.sub && <div style={{ fontSize:'10px', color:'var(--w40)', marginTop:'3px' }}>{k.sub}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Income vs Expenses bar */}
      <div className="card" style={{ padding:'24px', marginBottom:'20px' }}>
        <div className="sec-label">Monthly Income vs Expenses — {year}</div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={yearData} margin={{ top:5,right:10,left:-10,bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="label" tick={{ fill:'rgba(255,255,255,0.4)', fontSize:11 }} />
            <YAxis tick={{ fill:'rgba(255,255,255,0.4)', fontSize:10 }} />
            <Tooltip formatter={v=>[formatSAR(v)]} contentStyle={{ background:'#0c0c22', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'10px', color:'#fff' }} />
            <Legend wrapperStyle={{ fontSize:'11px', color:'rgba(255,255,255,0.5)' }} />
            <Bar dataKey="income"   name="Income"   fill="#00D4FF" radius={[4,4,0,0]} opacity={0.85} />
            <Bar dataKey="expenses" name="Expenses" fill="#FF2D78" radius={[4,4,0,0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'20px', marginBottom:'20px' }}>
        {/* Cumulative savings */}
        <div className="card" style={{ padding:'24px' }}>
          <div className="sec-label">Cumulative Net Savings — {year}</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={cumulative} margin={{ top:5,right:5,left:-20,bottom:0 }}>
              <defs>
                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00FF88" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:9 }} />
              <YAxis  tick={{ fill:'rgba(255,255,255,0.3)', fontSize:9 }} />
              <Tooltip formatter={v=>[formatSAR(v),'Cumulative']} contentStyle={{ background:'#0c0c22', border:'1px solid #00FF88', borderRadius:'10px', color:'#fff' }} />
              <Area type="monotone" dataKey="cumulative" stroke="#00FF88" fill="url(#cumGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Savings rate line */}
        <div className="card" style={{ padding:'24px' }}>
          <div className="sec-label">Monthly Savings Rate %</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={yearData} margin={{ top:5,right:5,left:-20,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:9 }} />
              <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:9 }} unit="%" />
              <Tooltip formatter={v=>[`${v}%`,'Savings Rate']} contentStyle={{ background:'#0c0c22', border:'1px solid #8B5CF6', borderRadius:'10px', color:'#fff' }} />
              <Line type="monotone" dataKey="savingsRate" stroke="#8B5CF6" strokeWidth={2} dot={{ r:3, fill:'#8B5CF6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goal timeline */}
      <div className="card ring-blue" style={{ padding:'28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}>
          <Target size={18} color="var(--blue)" />
          <div className="sec-label" style={{ marginBottom:0, color:'var(--blue)' }}>House Loan Break-Even Timeline</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
          {[
            { l:'Current Assets',          v:formatSAR(totalAssets, true),              c:'var(--white)'   },
            { l:'Goal (Loan Balance)',      v:formatSAR(settings.houseLoanBalance, true),c:'var(--pink)'    },
            { l:'Gap Remaining',           v:formatSAR(gap, true),                      c:'var(--yellow)'  },
            { l:'Est. Time (at avg pace)', v:`${yearsLeft} years`,                      c:'var(--blue)'    },
          ].map((g,i)=>(
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--w40)', marginBottom:'8px' }}>{g.l}</div>
              <div className="orb" style={{ fontSize:'16px', fontWeight:700, color:g.c, textShadow:`0 0 12px ${g.c}` }}>{g.v}</div>
            </div>
          ))}
        </div>
        <hr className="divider" />
        <div className="progress-track" style={{ height:'12px', marginBottom:'8px' }}>
          <div className="progress-fill-b" style={{ width:`${Math.min(goalProgress,100)}%` }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'var(--w40)' }}>
          <span>0 SAR</span>
          <span className="nb orb" style={{ fontWeight:700 }}>{goalProgress.toFixed(1)}% Complete</span>
          <span>{formatSAR(settings.houseLoanBalance, true)}</span>
        </div>
      </div>
    </div>
  );
}
