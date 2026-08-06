import type { AgentDefinition, AgentId } from '../types.js';

const createAgent = (id: AgentId, name: string, description: string, template: (task: string, userInput: string) => string): AgentDefinition => ({
  id,
  name,
  description,
  execute: async ({ task, userInput, sharedContext }) => {
    const prompt = template(task, userInput);
    return `Agent ${name} handled ${task}.\n\n${prompt}\n\nCollaboration context:\n${sharedContext}`;
  }
});

export const agentRegistry: AgentDefinition[] = [
  createAgent('destination', 'Destination Agent', 'Researches destination relevance and highlights.', (task, userInput) => `Destination analysis for: ${userInput}\nTask focus: ${task}`),
  createAgent('flight', 'Flight Agent', 'Handles flight planning for the selected trip.', (task, userInput) => `Flight planning for: ${userInput}\nTask focus: ${task}`),
  createAgent('hotel', 'Hotel Agent', 'Selects suitable accommodations.', (task, userInput) => `Hotel guidance for: ${userInput}\nTask focus: ${task}`),
  createAgent('transportation', 'Transportation Agent', 'Plans movement between locations.', (task, userInput) => `Transportation plan for: ${userInput}\nTask focus: ${task}`),
  createAgent('budget', 'Budget Agent', 'Builds budget estimates.', (task, userInput) => `Budget estimate for: ${userInput}\nTask focus: ${task}`),
  createAgent('weather', 'Weather Agent', 'Provides weather context.', (task, userInput) => `Weather outlook for: ${userInput}\nTask focus: ${task}`),
  createAgent('activity', 'Activity Agent', 'Suggests activities and experiences.', (task, userInput) => `Activity ideas for: ${userInput}\nTask focus: ${task}`),
  createAgent('food', 'Food Agent', 'Recommends food and dining.', (task, userInput) => `Food recommendations for: ${userInput}\nTask focus: ${task}`),
  createAgent('packing', 'Packing Agent', 'Produces packing lists.', (task, userInput) => `Packing checklist for: ${userInput}\nTask focus: ${task}`),
  createAgent('safety', 'Safety Agent', 'Provides travel safety context.', (task, userInput) => `Safety guidance for: ${userInput}\nTask focus: ${task}`)
];

export function getAgentById(id: AgentId): AgentDefinition | undefined {
  return agentRegistry.find((agent) => agent.id === id);
}
