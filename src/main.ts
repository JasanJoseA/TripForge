import { Orchestrator } from './orchestrator.js';

const orchestrator = new Orchestrator();

const userInputEl = document.getElementById('userInput') as HTMLTextAreaElement | null;
const runBtn = document.getElementById('runBtn') as HTMLButtonElement | null;
const statusBar = document.getElementById('statusBar');
const taskList = document.getElementById('taskList');
const summary = document.getElementById('summary');
const outputList = document.getElementById('outputList');

if (!userInputEl || !runBtn || !statusBar || !taskList || !summary || !outputList) {
  throw new Error('Required UI elements were not found.');
}

runBtn.addEventListener('click', async () => {
  const userInput = userInputEl.value.trim();
  if (!userInput) {
    alert('Please enter a travel request.');
    return;
  }

  runBtn.disabled = true;
  runBtn.textContent = 'Running…';
  statusBar.innerHTML = '';
  outputList.innerHTML = '';

  const intent = orchestrator.analyzeIntent(userInput);
  taskList.innerHTML = intent.tasks.map((task) => `<div class="badge">${task}</div>`).join('');
  statusBar.innerHTML = `
    <span class="badge">Intent: ${intent.intent}</span>
    <span class="badge">Reason: ${intent.rationale}</span>
  `;

  try {
    const result = await orchestrator.run(userInput);
    summary.innerHTML = `<div class="result-card"><p>${result.summary.replace(/\n/g, '<br />')}</p></div>`;

    outputList.innerHTML = result.outputs
      .map((output) => `
        <div class="result-card">
          <h3>${output.agentName} · ${output.status}</h3>
          <p>${output.content.replace(/\n/g, '<br />')}</p>
        </div>
      `)
      .join('');
  } catch (error) {
    statusBar.innerHTML = `<span class="badge">Orchestration failed: ${error instanceof Error ? error.message : 'Unknown error'}</span>`;
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = 'Run Orchestrator';
  }
});
