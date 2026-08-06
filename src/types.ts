export type AgentId = 'destination' | 'flight' | 'hotel' | 'transportation' | 'budget' | 'weather' | 'activity' | 'food' | 'packing' | 'safety';

export interface AgentDefinition {
  id: AgentId;
  name: string;
  description: string;
  execute: (context: AgentExecutionContext) => Promise<string>;
}

export interface AgentExecutionContext {
  userInput: string;
  task: string;
  selectedAgents: AgentDefinition[];
  itineraryContext: string;
  sharedContext: string;
}

export interface IntentAnalysis {
  intent: string;
  tasks: AgentId[];
  rationale: string;
  destinationDetected: boolean;
}

export interface OrchestrationResult {
  intent: IntentAnalysis;
  selectedAgents: AgentDefinition[];
  outputs: Array<{
    agentId: AgentId;
    agentName: string;
    content: string;
    status: 'completed' | 'failed';
    durationMs: number;
  }>;
  summary: string;
  itinerary: string;
}
