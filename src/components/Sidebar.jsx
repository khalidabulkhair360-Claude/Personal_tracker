import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, BarChart3,
  TrendingUp, Wallet, Settings, Target
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatSAR } from '../utils/helpers';

const NAV = [
  { to:'/',        icon: LayoutDashboard, label:'Dashboard'   },
  { to:'/daily',   icon: CalendarDays,    label:'Daily'       },
  { to:'/monthly', icon: BarChart3,       label:'Monthly'     },
  { to:'/annual',  icon: TrendingUp,      label:'Annual'      },
  { to:'/assets',  icon: Wallet,          label:'Assets'      },
  { to:'/settings',icon: Settings,        label:'Settings'    },
];

export default function Sidebar() {
  const { totalAssets, goalProgress, settings } = useFinance();
  const loc = useLocation();

  return (
    <aside className="sidebar" style={{
      background: 'rgba(6,6,15,0.98)',
      borderRight: '1px solid rgba(0,212,255,0.12)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="orb" style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '2px' }}>
          <span className="np">K</span><span className="nb">F</span><span style={{ color:'var(--purple)' }}>T</span>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--w40)', letterSpacing: '2px', marginTop: '2px' }}>
          FINANCE TRACKER
        </div>
      </div>

      {/* Goal mini-bar */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'10px', color:'var(--w40)', letterSpacing:'1px', textTransform:'uppercase' }}>
            <Target size={11} color="var(--pink)" />
            House Break-Even
          </div>
          <span className="orb np" style={{ fontSize:'11px' }}>{goalProgress.toFixed(1)}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill-p" style={{ width: `${goalProgress}%` }} />
        </div>
        <div style={{ fontSize:'10px', color:'var(--w40)', marginTop:'5px' }}>
          {formatSAR(totalAssets, true)} of {formatSAR(settings.houseLoanBalance, true)}
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '10px',
              marginBottom: '3px', textDecoration: 'none',
              fontSize: '13px', fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--blue)' : 'var(--w70)',
              background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
              boxShadow: isActive ? 'inset 0 0 0 1px rgba(0,212,255,0.2)' : 'none',
              transition: 'all .2s',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom user */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--w70)' }}>{settings.name}</div>
        <div style={{ fontSize: '10px', color: 'var(--w40)', marginTop: '2px' }}>Project Quality Manager</div>
      </div>
    </aside>
  );
}
