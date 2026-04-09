export type AgentRole = 'collector' | 'analyst' | 'strategist' | 'critic' | 'executor';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  status: 'idle' | 'working' | 'completed' | 'error';
}

export interface Decision {
  id: string;
  query: string;
  insight: string;
  reasoning: string[];
  evidence: string[];
  confidence: number;
  action: string;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  agentPath: string[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  variables: Record<string, number>;
  prediction: number;
  confidence: number;
}
