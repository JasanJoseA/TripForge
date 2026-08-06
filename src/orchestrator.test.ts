import { describe, expect, it } from 'vitest';
import { Orchestrator } from './orchestrator.js';

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
});
