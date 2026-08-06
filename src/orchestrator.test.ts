import { describe, expect, it } from 'vitest';
import { Orchestrator } from './orchestrator.js';
import { getAgentById } from './agents/agentRegistry.js';
import type { AgentDefinition } from './types.js';

describe('Orchestrator', () => {
  it('selects only the relevant agents for a sushi request in Tokyo', async () => {
    const orchestrator = new Orchestrator();
    const result = await orchestrator.run('I need sushi recommendations in Tokyo.');

    expect(result.selectedAgents.map((agent) => agent.id)).toEqual(['destination', 'food']);
    expect(result.outputs.some((output) => output.agentId === 'food')).toBe(true);
    expect(result.outputs.some((output) => output.agentId === 'flight')).toBe(false);
    expect(result.outputs.some((output) => output.agentId === 'hotel')).toBe(false);
    expect(result.outputs.some((output) => output.agentId === 'packing')).toBe(false);
  });

  it('runs all selected agents in parallel and shares collaboration context', async () => {
    const orchestrator = new Orchestrator();
    const selectedAgents = [getAgentById('destination'), getAgentById('food')].filter((agent): agent is AgentDefinition => Boolean(agent));
    const result = await orchestrator.run('Plan a food-focused city break in Tokyo.', selectedAgents);

    expect(result.outputs).toHaveLength(2);
    expect(result.outputs.every((output) => output.status === 'completed')).toBe(true);
    expect(result.outputs.every((output) => output.content.includes('Collaboration context'))).toBe(true);
    expect(result.itinerary).toContain('##');
  });
});
