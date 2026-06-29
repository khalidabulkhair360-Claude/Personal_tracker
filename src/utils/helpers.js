export const formatSAR = (n, compact = false) => {
  if (n === undefined || n === null) return '0 SAR';
  if (compact && Math.abs(n) >= 1000) {
    return (n / 1000).toFixed(1) + 'K SAR';
  }
  return n.toLocaleString('en-SA', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' SAR';
};

export const today = () => new Date().toISOString().split('T')[0];

export const toDateStr = (d) => (d instanceof Date ? d : new Date(d)).toISOString().split('T')[0];

export const shortDate = (str) => {
  const d = new Date(str);
  return d.toLocaleDateString('en-SA', { month: 'short', day: 'numeric' });
};

export const monthLabel = (year, month) => {
  return new Date(year, month - 1, 1).toLocaleDateString('en-SA', { month: 'long', year: 'numeric' });
};

export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const ASSET_TYPES = [
  { value:'investment', type:'investment', label:'Investment',  color:'#00D4FF', icon:'📈' },
  { value:'property',   type:'property',   label:'Property',    color:'#FF2D78', icon:'🏠' },
  { value:'savings',    type:'savings',    label:'Savings',     color:'#00FF88', icon:'💵' },
  { value:'vehicle',    type:'vehicle',    label:'Vehicle',     color:'#FECA57', icon:'🚗' },
  { value:'other',      type:'other',      label:'Other',       color:'#A29BFE', icon:'💎' },
];

export const getAssetMeta = (type) =>
  ASSET_TYPES.find(t => t.value === type) || ASSET_TYPES[4];

export const CHART_COLORS = [
  '#FF2D78','#00D4FF','#00FF88','#8B5CF6',
  '#FECA57','#FF9F43','#A29BFE','#FD79A8',
  '#55EFC4','#74B9FF','#E17055','#636E72',
];

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

export const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

export const getLast12Months = () => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleDateString('en-SA', { month: 'short' }) });
  }
  return months;
};
