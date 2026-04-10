import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { BrainCircuit, ShieldCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const data = [
  { name: '00:00', velocity: 400, impact: 240 },
  { name: '04:00', velocity: 300, impact: 139 },
  { name: '08:00', velocity: 200, impact: 980 },
  { name: '12:00', velocity: 278, impact: 390 },
  { name: '16:00', velocity: 189, impact: 480 },
  { name: '20:00', velocity: 239, impact: 380 },
  { name: '23:59', velocity: 349, impact: 430 },
];

const decisionHistory = [
  { id: '1', title: 'Supply Chain Optimization - Chennai Hub', impact: '+₹12L', confidence: 98, status: 'Executed', time: '2h ago' },
  { id: '2', title: 'Market Entry Strategy - Mumbai North', impact: 'Pending', confidence: 84, status: 'Review', time: '5h ago' },
  { id: '3', title: 'Dynamic Pricing Adjustment - Bengaluru', impact: '+₹4.5L', confidence: 92, status: 'Executed', time: '8h ago' },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Decisions Made"
          value="1,284"
          change="+12.5%"
          trend="up"
          icon={BrainCircuit}
          color="cyan"
        />
        <StatCard
          label="System Confidence"
          value="98.4%"
          change="+0.2%"
          trend="up"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          label="Projected Impact"
          value="₹2.4Cr"
          change="-2.4%"
          trend="down"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Decision Intelligence</h3>
              <p className="text-sm text-gray-500">Real-time velocity vs impact analysis</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-xs text-gray-400">Velocity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-400">Impact</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#4b5563"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#4b5563"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="velocity"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorVelocity)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="impact"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorImpact)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-2xl">
          <h3 className="text-xl font-bold tracking-tight mb-6">Recent Decisions</h3>
          <div className="space-y-4">
            {decisionHistory.map((decision) => (
              <div
                key={decision.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold group-hover:text-cyan-400 transition-colors">{decision.title}</h4>
                  <span className="text-[10px] text-gray-500">{decision.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Impact</span>
                      <span className={cn(
                        "text-xs font-bold",
                        decision.impact.startsWith('+') ? "text-emerald-400" : "text-gray-400"
                      )}>{decision.impact}</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Conf.</span>
                      <span className="text-xs font-bold text-cyan-400">{decision.confidence}%</span>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    decision.status === 'Executed' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  )}>
                    {decision.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            View Full Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, trend, icon: Icon, color }: any) {
  const colorMap: any = {
    cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent blur-3xl -mr-16 -mt-16 pointer-events-none" />

      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold",
          trend === 'up' ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>

      <p className="text-sm text-gray-500 font-medium tracking-wide">{label}</p>
      <h3 className="text-4xl font-bold mt-1 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        {value}
      </h3>
    </motion.div>
  );
}
