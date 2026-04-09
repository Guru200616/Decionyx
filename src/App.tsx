/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Zap, 
  Bell, 
  FileText, 
  Settings, 
  Menu, 
  X,
  BrainCircuit,
  ShieldCheck,
  TrendingUp,
  History,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

import { Dashboard } from './components/dashboard/Dashboard';
import { Chat } from './components/chat/Chat';
import { Simulation } from './components/simulation/Simulation';

const translations = {
  en: {
    dashboard: "Dashboard",
    chat: "AI Chat",
    simulation: "Simulation",
    alerts: "Alerts",
    reports: "Reports",
    memory: "Memory",
    settings: "Settings",
    tagline: "Autonomous Intelligence for Business Decisions",
    builtBy: "Built by",
    systemSecure: "System Secure",
    initializing: "Module Initializing",
    initializingDesc: "The module is being provisioned by the Intelligence Layer. Check back shortly."
  },
  ta: {
    dashboard: "தகவல் பலகை",
    chat: "AI அரட்டை",
    simulation: "உருவகப்படுத்துதல்",
    alerts: "எச்சரிக்கைகள்",
    reports: "அறிக்கைகள்",
    memory: "நினைவகம்",
    settings: "அமைப்புகள்",
    tagline: "வணிக முடிவுகளுக்கான தன்னாட்சி நுண்ணறிவு",
    builtBy: "உருவாக்கியவர்",
    systemSecure: "பாதுகாப்பான அமைப்பு",
    initializing: "தொகுதி தொடங்குகிறது",
    initializingDesc: "இந்தத் தொகுதி நுண்ணறிவு அடுக்கால் வழங்கப்படுகிறது. சிறிது நேரத்தில் சரிபார்க்கவும்."
  }
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState<'en' | 'ta'>('en');

  const t = translations[lang];

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'chat', label: t.chat, icon: MessageSquare },
    { id: 'simulation', label: t.simulation, icon: Zap },
    { id: 'alerts', label: t.alerts, icon: Bell },
    { id: 'reports', label: t.reports, icon: FileText },
    { id: 'memory', label: t.memory, icon: History },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-cyan-500/30">
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
              >
                Decionyx
              </motion.span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  activeTab === item.id 
                    ? "bg-white/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-cyan-400" : "text-gray-400 group-hover:text-white")} />
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r-full"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Branding Footer */}
          <div className="p-4 border-t border-white/5">
            <div className={cn("flex flex-col gap-1", !isSidebarOpen && "items-center")}>
              {isSidebarOpen ? (
                <>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">{t.builtBy}</p>
                  <p className="text-xs font-medium text-gray-300">Guru Rengarajan</p>
                </>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400">
                  GR
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#1a1a1a] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          isSidebarOpen ? "pl-64" : "pl-20"
        )}
      >
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/50 backdrop-blur-md sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight capitalize">{translations[lang][activeTab as keyof typeof translations['en']]}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{t.tagline}</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider"
            >
              <Languages className="w-3 h-3" />
              {lang === 'en' ? 'தமிழ்' : 'English'}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              {t.systemSecure}
            </div>
            <button className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#050505]" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10" />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'chat' && <Chat />}
              {activeTab === 'simulation' && <Simulation />}
              {activeTab !== 'dashboard' && activeTab !== 'chat' && activeTab !== 'simulation' && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Zap className="w-10 h-10 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{t.initializing}</h2>
                  <p className="text-gray-500 max-w-md">{t.initializingDesc}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function DashboardPlaceholder() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      {[
        { label: 'Decisions Made', value: '1,284', change: '+12%', icon: BrainCircuit, color: 'text-cyan-400' },
        { label: 'System Confidence', value: '98.4%', change: '+0.2%', icon: ShieldCheck, color: 'text-emerald-400' },
        { label: 'Projected Impact', value: '$2.4M', change: '+18%', icon: TrendingUp, color: 'text-blue-400' },
      ].map((stat, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -5 }}
          className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/30 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-xl bg-white/5", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
              {stat.change}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
          <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
        </motion.div>
      ))}

      {/* Main Chart Placeholder */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 h-[400px] flex flex-col items-center justify-center">
        <div className="w-full h-full flex items-end gap-2 px-4">
          {[40, 60, 45, 90, 65, 80, 55, 70, 85, 50, 75, 95].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex-1 bg-gradient-to-t from-cyan-500/20 to-cyan-500/60 rounded-t-lg"
            />
          ))}
        </div>
        <p className="mt-6 text-gray-500 text-sm font-medium">Decision Velocity & Impact Analysis (Real-time)</p>
      </div>
    </div>
  );
}
