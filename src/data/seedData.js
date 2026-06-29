export const seedCategories = [
  { id:'c1',  name:'House Loan',     icon:'🏠', color:'#FF2D78', type:'expense', budget:6981.54, fixed:true  },
  { id:'c2',  name:'Car Loan',       icon:'🚗', color:'#FF6B6B', type:'expense', budget:3477.35, fixed:true  },
  { id:'c3',  name:'Flat Rent',      icon:'🏘️', color:'#FF9F43', type:'expense', budget:4583.33, fixed:true  },
  { id:'c4',  name:'Wife Allowance', icon:'👩', color:'#FD79A8', type:'expense', budget:3000,    fixed:true  },
  { id:'c5',  name:'Driver Salary',  icon:'🚘', color:'#A29BFE', type:'expense', budget:1850,    fixed:true  },
  { id:'c6',  name:'Food',           icon:'🍽️', color:'#00D4FF', type:'expense', budget:6000,    fixed:false },
  { id:'c7',  name:'Fuel',           icon:'⛽', color:'#FECA57', type:'expense', budget:780,     fixed:false },
  { id:'c8',  name:'Phone',          icon:'📱', color:'#54A0FF', type:'expense', budget:830,     fixed:true  },
  { id:'c9',  name:'Electricity',    icon:'💡', color:'#FDCB6E', type:'expense', budget:200,     fixed:false },
  { id:'c10', name:'Netflix',        icon:'🎬', color:'#E50914', type:'expense', budget:52,      fixed:true  },
  { id:'c11', name:'Claude AI',      icon:'🤖', color:'#8B5CF6', type:'expense', budget:441.88,  fixed:true  },
  { id:'c12', name:'iCloud',         icon:'☁️', color:'#74B9FF', type:'expense', budget:14,      fixed:true  },
  { id:'c13', name:'Cigarettes',     icon:'🚬', color:'#636E72', type:'expense', budget:600,     fixed:false },
  { id:'c14', name:'Travel',         icon:'✈️', color:'#00CEC9', type:'expense', budget:2917,    fixed:false },
  { id:'c15', name:'Other',          icon:'💸', color:'#B2BEC3', type:'expense', budget:0,       fixed:false },
  { id:'c16', name:'Salary',         icon:'💼', color:'#00D4FF', type:'income',  budget:31100,   fixed:true  },
  { id:'c17', name:'Villa Rental',   icon:'🏡', color:'#00FF88', type:'income',  budget:6667,    fixed:true  },
  { id:'c18', name:'Bonus',          icon:'🎁', color:'#FFD700', type:'income',  budget:5000,    fixed:false },
  { id:'c19', name:'Other Income',   icon:'💰', color:'#55EFC4', type:'income',  budget:0,       fixed:false },
];

export const seedAssets = [
  { id:'a1', name:'TASI Shares',              value:154000,  type:'investment', notes:'Saudi stock market — includes accumulated profits', lastUpdated:'2026-06-29', liquid:true  },
  { id:'a2', name:'Flat Under Construction',  value:289560,  type:'property',   notes:'51% ownership share (paid 289,560 of 570,000). Rental ~35,700 SAR/yr once ready', lastUpdated:'2026-06-29', liquid:false },
  { id:'a3', name:'Crypto Portfolio',         value:48750,   type:'investment', notes:'13,000 USD @ 3.75 SAR/USD rate',                   lastUpdated:'2026-06-29', liquid:true  },
  { id:'a4', name:'Tamra Investment Account', value:39000,   type:'investment', notes:'Tamra app investment',                             lastUpdated:'2026-06-29', liquid:true  },
  { id:'a5', name:'Yamaha R6 2019',           value:36000,   type:'vehicle',    notes:'Planned for sale',                                 lastUpdated:'2026-06-29', liquid:false },
  { id:'a6', name:'Three Points (10%)',       value:100000,  type:'investment', notes:'Entertainment venue in Jeddah — 2 years left on contract', lastUpdated:'2026-06-29', liquid:false },
  { id:'a7', name:'Backup Savings Account',   value:16000,   type:'savings',    notes:'Emergency fund',                                   lastUpdated:'2026-06-29', liquid:true  },
];

export const seedSettings = {
  name: 'Khalid',
  monthlySalary: 31100,
  additionalIncome: 6667,
  currency: 'SAR',
  goalName: 'House Loan Break-Even',
  goalDesc: 'Accumulate assets equal to the remaining house loan balance — achieve financial freedom on the property.',
  houseLoanBalance: 2024646.60,
  houseLoanMonthly: 6981.54,
  houseLoanRemaining: 290,
  targetDate: '2029-06-29',
};

// Generate sample fixed transactions for current month
function today() { return new Date().toISOString().split('T')[0]; }
function thisMonth(day) {
  const d = new Date();
  d.setDate(day);
  return d.toISOString().split('T')[0];
}

export const seedTransactions = [
  // Income
  { id:'t1', date: thisMonth(1), type:'income',  category:'Salary',       description:'Monthly Salary',       amount:31100 },
  { id:'t2', date: thisMonth(1), type:'income',  category:'Villa Rental', description:'Villa Rental Income',  amount:6667  },
  // Fixed expenses
  { id:'t3', date: thisMonth(1), type:'expense', category:'House Loan',     description:'House Loan Installment', amount:6981.54 },
  { id:'t4', date: thisMonth(1), type:'expense', category:'Car Loan',       description:'Car Loan Installment',   amount:3477.35 },
  { id:'t5', date: thisMonth(1), type:'expense', category:'Flat Rent',      description:'Monthly Flat Rent',      amount:4583.33 },
  { id:'t6', date: thisMonth(1), type:'expense', category:'Wife Allowance', description:'Monthly Allowance',      amount:3000    },
  { id:'t7', date: thisMonth(1), type:'expense', category:'Driver Salary',  description:'Driver Monthly Salary',  amount:1850    },
  { id:'t8', date: thisMonth(1), type:'expense', category:'Phone',          description:'Phone Bill',             amount:830     },
  { id:'t9', date: thisMonth(1), type:'expense', category:'Claude AI',      description:'Claude AI Subscription', amount:441.88  },
  { id:'t10',date: thisMonth(1), type:'expense', category:'Netflix',        description:'Netflix Subscription',   amount:52      },
  { id:'t11',date: thisMonth(1), type:'expense', category:'iCloud',         description:'iCloud Storage 2TB',     amount:14      },
  // Variable daily
  { id:'t12',date: today(),      type:'expense', category:'Food',           description:'Daily Food',             amount:200     },
  { id:'t13',date: today(),      type:'expense', category:'Fuel',           description:'Car Fuel',               amount:26      },
  { id:'t14',date: today(),      type:'expense', category:'Cigarettes',     description:'Cigarettes',             amount:20      },
  { id:'t15',date: today(),      type:'expense', category:'Electricity',    description:'Electricity Bill',       amount:200     },
];
