import { generateDecision } from "./gemini";
import { Agent, Decision, AgentRole } from "../types";

export class AgentOrchestrator {
  private agents: Agent[] = [
    { id: '1', name: 'Collector', role: 'collector', description: 'Ingests and pre-processes raw data.', status: 'idle' },
    { id: '2', name: 'Analyst', role: 'analyst', description: 'Detects patterns, anomalies, and trends.', status: 'idle' },
    { id: '3', name: 'Strategist', role: 'strategist', description: 'Generates strategic decision options.', status: 'idle' },
    { id: '4', name: 'Critic', role: 'critic', description: 'Validates decisions and detects biases.', status: 'idle' },
    { id: '5', name: 'Executor', role: 'executor', description: 'Handles controlled execution of decisions.', status: 'idle' },
  ];

  async processQuery(query: string, context: string): Promise<Decision> {
    console.log(`[Orchestrator] Processing query: ${query}`);

    // Step 1: Collector
    this.updateAgentStatus('collector', 'working');
    // Simulate data ingestion
    await new Promise(r => setTimeout(r, 1000));
    this.updateAgentStatus('collector', 'completed');

    // Step 2: Analyst
    this.updateAgentStatus('analyst', 'working');
    await new Promise(r => setTimeout(r, 1500));
    this.updateAgentStatus('analyst', 'completed');

    // Step 3: Strategist (The core AI call)
    this.updateAgentStatus('strategist', 'working');
    const decisionData = await generateDecision(query, context);
    this.updateAgentStatus('strategist', 'completed');

    // Step 4: Critic
    this.updateAgentStatus('critic', 'working');
    // In a real system, this would be another LLM call to critique the strategist
    await new Promise(r => setTimeout(r, 1000));
    this.updateAgentStatus('critic', 'completed');

    // Step 5: Executor
    this.updateAgentStatus('executor', 'working');
    await new Promise(r => setTimeout(r, 500));
    this.updateAgentStatus('executor', 'completed');

    return {
      id: "dec_" + Math.random().toString(36).substr(2, 9),
      query,
      ...decisionData,
      timestamp: new Date().toISOString(),
      agentPath: ['collector', 'analyst', 'strategist', 'critic', 'executor']
    };
  }

  private updateAgentStatus(role: AgentRole, status: Agent['status']) {
    const agent = this.agents.find(a => a.role === role);
    if (agent) {
      agent.status = status;
      // In a real app, we'd emit an event or update global state
    }
  }

  getAgents() {
    return this.agents;
  }
}

export const orchestrator = new AgentOrchestrator();
