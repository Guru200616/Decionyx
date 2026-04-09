import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Shield, Info, ChevronRight, Loader2, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { orchestrator } from '@/src/services/agents';
import { Decision } from '@/src/types';

export function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDecision, setActiveDecision] = useState<Decision | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      // In a real app, we'd pass actual context
      const decision = await orchestrator.processQuery(input, "System context: Enterprise operations, Q2 2026.");
      
      const botMsg = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: decision.insight,
        decision 
      };
      
      setMessages(prev => [...prev, botMsg]);
      setActiveDecision(decision);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'system', 
        content: "An error occurred in the intelligence layer. Please retry." 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
      {/* Chat Window */}
      <div className="lg:col-span-2 flex flex-col bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Decision Engine v1.0</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Multi-Agent Orchestration Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Online</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold">How can Decionyx assist you today?</h4>
              <p className="text-gray-500 max-w-sm text-sm">Ask about market trends, operational risks, or strategic simulations.</p>
              <div className="grid grid-cols-2 gap-3 max-w-md w-full mt-4">
                {['Analyze Q2 Risk', 'Simulate Expansion', 'Optimize Supply Chain', 'Detect Anomalies'].map(q => (
                  <button 
                    key={q}
                    onClick={() => setInput(q)}
                    className="p-3 rounded-xl border border-white/5 bg-white/5 text-xs text-gray-400 hover:text-white hover:border-cyan-500/30 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4",
                msg.role === 'user' ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                msg.role === 'user' ? "bg-blue-600 text-white" : "bg-white/10 text-cyan-400"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' ? "bg-blue-600/10 border border-blue-600/20 text-blue-100" : "bg-white/5 border border-white/10 text-gray-200"
              )}>
                {msg.content}
                {msg.decision && (
                  <button 
                    onClick={() => setActiveDecision(msg.decision)}
                    className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    View Full Analysis <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {isProcessing && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-gray-500 ml-2">Orchestrating Agents...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5">
          <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Enter your strategic query..."
              className="w-full bg-[#050505] border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={isProcessing || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-cyan-500 text-white hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-600 mt-4 uppercase tracking-widest">
            Decionyx AI can make mistakes. Verify critical outputs.
          </p>
        </div>
      </div>

      {/* Why Panel (Explainability) */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
          <Info className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-widest">"Why?" Panel</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {!activeDecision ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-600 p-8">
              <Shield className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">Select a decision to view the execution path and reasoning.</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Confidence Score */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Confidence Score</span>
                  <span className="text-2xl font-bold">{(activeDecision.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${activeDecision.confidence * 100}%` }}
                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  />
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" /> Reasoning Path
                </h4>
                <div className="space-y-3">
                  {activeDecision.reasoning.map((r, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-300">
                      <span className="text-cyan-500 font-bold">{i + 1}.</span>
                      <p>{r}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Evidence & Grounding
                </h4>
                <div className="space-y-2">
                  {activeDecision.evidence.map((e, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 italic">
                      "{e}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Path */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Execution Trail</h4>
                <div className="space-y-4 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/5" />
                  {activeDecision.agentPath.map((agent, i) => (
                    <div key={i} className="flex items-center gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-white z-10">
                        {i + 1}
                      </div>
                      <span className="text-xs font-medium capitalize text-gray-300">{agent} Agent</span>
                      <div className="ml-auto text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">Verified</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
