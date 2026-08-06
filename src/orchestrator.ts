import type { AgentDefinition, AgentExecutionContext, IntentAnalysis, OrchestrationResult, AgentId } from './types.js';
import { getAgentById } from './agents/agentRegistry.js';

export class Orchestrator {
  analyzeIntent(userInput: string): IntentAnalysis {
    const normalized = userInput.toLowerCase();
    const destinationDetected = /tokyo|japan|paris|rome|bali|new york|london|sydney|singapore|kyoto|osaka|dubai|thailand|italy|spain|india|canada|france|greece|switzerland|malaysia|seoul|hanoi|bangkok|barcelona/i.test(normalized);

    const tasks: AgentId[] = [];
    const intentParts: string[] = [];

    if (/(sushi|food|restaurant|eat|dining|coffee|brunch|market)/i.test(normalized)) {
      tasks.push('food');
      intentParts.push('food recommendations');
    }

    if (/(hotel|stay|accommodation|lodging|room|hostel|resort)/i.test(normalized)) {
      tasks.push('hotel');
      intentParts.push('accommodation planning');
    }

    if (/(flight|fly|airplane|airfare|ticket|airport|arrive|depart)/i.test(normalized)) {
      tasks.push('flight');
      intentParts.push('flight planning');
    }

    if (/(weather|rain|sun|season|climate|forecast)/i.test(normalized)) {
      tasks.push('weather');
      intentParts.push('weather guidance');
    }

    if (/(budget|cost|price|cheap|expensive|spend|affordable|money)/i.test(normalized)) {
      tasks.push('budget');
      intentParts.push('budget planning');
    }

    if (/(activity|things to do|visit|tour|sightseeing|attraction|museum|hiking|beach|nightlife|anime|photography)/i.test(normalized)) {
      tasks.push('activity');
      intentParts.push('activity suggestions');
    }

    if (/(transport|train|bus|metro|taxi|car|ride|commute|getting around)/i.test(normalized)) {
      tasks.push('transportation');
      intentParts.push('transportation planning');
    }

    if (/(pack|packing|clothes|what to wear|outfit|luggage)/i.test(normalized)) {
      tasks.push('packing');
      intentParts.push('packing guidance');
    }

    if (/(safe|safety|advisory|health|scam|emergency|customs|vaccin)/i.test(normalized)) {
      tasks.push('safety');
      intentParts.push('safety planning');
    }

    if (tasks.length === 0 || !destinationDetected) {
      tasks.unshift('destination');
      intentParts.unshift('destination research');
    }

    if (!tasks.includes('destination')) {
      tasks.unshift('destination');
    }

    const deduped = Array.from(new Set(tasks));

    return {
      intent: deduped.length > 0 ? `Trip planning focused on ${intentParts.join(', ') || 'core travel needs'}` : 'General travel planning',
      tasks: deduped,
      rationale: `The orchestrator selected ${deduped.join(', ')} based on request cues and travel-planning needs.`,
      destinationDetected
    };
  }

  async run(userInput: string): Promise<OrchestrationResult> {
    const intent = this.analyzeIntent(userInput);
    const selectedAgents = this.selectAgents(intent.tasks);

    const context: AgentExecutionContext = {
      userInput,
      task: intent.tasks.join(', '),
      selectedAgents,
      itineraryContext: ''
    };

    const outputs = [] as OrchestrationResult['outputs'];

    const executionResults = await Promise.all(
      selectedAgents.map(async (agent) => {
        const startedAt = Date.now();
        try {
          const content = await agent.execute(context);
          return {
            agentId: agent.id,
            agentName: agent.name,
            content,
            status: 'completed' as const,
            durationMs: Date.now() - startedAt
          };
        } catch (error) {
          return {
            agentId: agent.id,
            agentName: agent.name,
            content: error instanceof Error ? error.message : 'Agent failed unexpectedly.',
            status: 'failed' as const,
            durationMs: Date.now() - startedAt
          };
        }
      })
    );

    outputs.push(...executionResults);

    const itinerary = this.mergeOutputs(outputs);
    const summary = this.summarize(itinerary, outputs);

    return {
      intent,
      selectedAgents,
      outputs,
      summary,
      itinerary
    };
  }

  private selectAgents(taskIds: AgentId[]): AgentDefinition[] {
    return taskIds
      .map((id) => getAgentById(id))
      .filter((agent): agent is AgentDefinition => Boolean(agent));
  }

  private mergeOutputs(outputs: OrchestrationResult['outputs']): string {
    return outputs
      .filter((output) => output.status === 'completed')
      .map((output) => `## ${output.agentName}\n${output.content}`)
      .join('\n\n');
  }

  private summarize(itinerary: string, outputs: OrchestrationResult['outputs']): string {
    const completed = outputs.filter((output) => output.status === 'completed').length;
    const failed = outputs.length - completed;
    return `Completed ${completed} agent${completed === 1 ? '' : 's'} with ${failed} failure${failed === 1 ? '' : 's'}.\n\n${itinerary.slice(0, 900)}${itinerary.length > 900 ? '…' : ''}`;
  }
}
