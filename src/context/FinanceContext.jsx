import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { seedCategories, seedAssets, seedSettings, seedTransactions } from '../data/seedData';
import { uid } from '../utils/helpers';

const Ctx = createContext(null);
export const useFinance = () => useContext(Ctx);

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => load('kft_tx',   seedTransactions));
  const [assets,       setAssets]       = useState(() => load('kft_as',   seedAssets));
  const [categories,   setCategories]   = useState(() => load('kft_cat',  seedCategories));
  const [settings,     setSettings]     = useState(() => load('kft_cfg',  seedSettings));

  useEffect(() => { localStorage.setItem('kft_tx',  JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('kft_as',  JSON.stringify(assets));       }, [assets]);
  useEffect(() => { localStorage.setItem('kft_cat', JSON.stringify(categories));   }, [categories]);
  useEffect(() => { localStorage.setItem('kft_cfg', JSON.stringify(settings));     }, [settings]);

  /* ── Transactions ─────────────────────────────────── */
  const addTransaction = (t) =>
    setTransactions(p => [{ ...t, id: uid() }, ...p]);

  const editTransaction = (id, u) =>
    setTransactions(p => p.map(t => t.id === id ? { ...t, ...u } : t));

  const deleteTransaction = (id) =>
    setTransactions(p => p.filter(t => t.id !== id));

  /* ── Assets ───────────────────────────────────────── */
  const addAsset = (a) =>
    setAssets(p => [...p, { ...a, id: uid(), lastUpdated: new Date().toISOString().split('T')[0] }]);

  const editAsset = (id, u) =>
    setAssets(p => p.map(a => a.id === id ? { ...a, ...u, lastUpdated: new Date().toISOString().split('T')[0] } : a));

  const deleteAsset = (id) =>
    setAssets(p => p.filter(a => a.id !== id));

  /* ── Categories ───────────────────────────────────── */
  const addCategory = (c) =>
    setCategories(p => [...p, { ...c, id: uid() }]);

  const editCategory = (id, u) =>
    setCategories(p => p.map(c => c.id === id ? { ...c, ...u } : c));

  const deleteCategory = (id) =>
    setCategories(p => p.filter(c => c.id !== id));

  /* ── Computed ─────────────────────────────────────── */
  const totalAssets = useMemo(() => assets.reduce((s, a) => s + (a.value || 0), 0), [assets]);

  const goalProgress = useMemo(() =>
    Math.min((totalAssets / (settings.houseLoanBalance || 1)) * 100, 100),
    [totalAssets, settings.houseLoanBalance]
  );

  const getMonthTx = (year, month) =>
    transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

  const getDayTx = (dateStr) =>
    transactions.filter(t => t.date === dateStr);

  return (
    <Ctx.Provider value={{
      transactions, assets, categories, settings,
      addTransaction, editTransaction, deleteTransaction,
      addAsset, editAsset, deleteAsset,
      addCategory, editCategory, deleteCategory,
      setSettings,
      totalAssets, goalProgress,
      getMonthTx, getDayTx,
    }}>
      {children}
    </Ctx.Provider>
  );
}
