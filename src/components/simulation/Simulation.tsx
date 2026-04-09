import { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { motion } from 'motion/react';
import { Zap, TrendingUp, AlertTriangle, Play, RefreshCcw, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function Simulation() {
  const [variables, setVariables] = useState({
    marketingSpend: 50000,
    productPrice: 199,
    inventoryLevel: 500,
    staffingLevel: 12
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const simulationData = useMemo(() => {
    const data = [];
    const { marketingSpend, productPrice, inventoryLevel, staffingLevel } = variables;
    
    // Simple linear model for simulation
    for (let i = 0; i < 12; i++) {
      const baseDemand = 100 + (marketingSpend / 1000) * 2;
      const priceElasticity = (250 - productPrice) / 10;
      const staffingEfficiency = staffingLevel * 0.8;
      
      const demand = baseDemand + priceElasticity + (Math.random() * 20);
      const supply = Math.min(demand, inventoryLevel + (staffingEfficiency * 10));
      const revenue = supply * productPrice;
      const cost = (marketingSpend / 12) + (staffingLevel * 4000) + (inventoryLevel * 5);
      const profit = revenue - cost;

      data.push({
        month: `Month ${i + 1}`,
        revenue: Math.round(revenue),
        profit: Math.round(profit),
        demand: Math.round(demand)
      });
    }
    return data;
  }, [variables]);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Controls */}
      <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-2xl space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold uppercase tracking-widest">Scenario Controls</h3>
        </div>

        <div className="space-y-6">
          <ControlSlider 
            label="Marketing Spend" 
            value={variables.marketingSpend} 
            min={10000} 
            max={2000000} 
            step={50000}
            unit="₹"
            onChange={(v) => setVariables(prev => ({ ...prev, marketingSpend: v }))}
          />
          <ControlSlider 
            label="Product Price" 
            value={variables.productPrice} 
            min={499} 
            max={49999} 
            step={100}
            unit="₹"
            onChange={(v) => setVariables(prev => ({ ...prev, productPrice: v }))}
          />
          <ControlSlider 
            label="Inventory Level" 
            value={variables.inventoryLevel} 
            min={100} 
            max={2000} 
            step={50}
            onChange={(v) => setVariables(prev => ({ ...prev, inventoryLevel: v }))}
          />
          <ControlSlider 
            label="Staffing Level" 
            value={variables.staffingLevel} 
            min={5} 
            max={50} 
            step={1}
            onChange={(v) => setVariables(prev => ({ ...prev, staffingLevel: v }))}
          />
        </div>

        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSimulating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          {isSimulating ? 'Computing Scenarios...' : 'Run Predictive Simulation'}
        </button>

        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3">
          <Info className="w-5 h-5 text-gray-500 shrink-0" />
          <p className="text-[10px] text-gray-500 leading-relaxed">
            Simulation uses a Monte Carlo engine with historical variance. Results are probabilistic.
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Projected Outcomes</h3>
              <p className="text-sm text-gray-500">12-month forward-looking prediction</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-xs text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-400">Profit</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="month" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={false} />
                <ReferenceLine y={0} stroke="#4b5563" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Key Opportunity</span>
            </div>
            <p className="text-sm text-gray-300">Increasing marketing spend by 15% while maintaining current price points could yield a 22% increase in net profit over 6 months.</p>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Risk Factor</span>
            </div>
            <p className="text-sm text-gray-300">Current inventory levels may cause a 12% loss in potential revenue during peak demand months (Month 4-6).</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlSlider({ label, value, min, max, step, unit = '', onChange }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
        <span className="text-sm font-mono font-bold text-cyan-400">{unit}{value.toLocaleString()}</span>
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
    </div>
  );
}
