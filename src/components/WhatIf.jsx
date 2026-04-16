import { useState } from 'react';
import { Sliders, RefreshCw } from 'lucide-react';

export default function WhatIf({ baseInputs, onCompare }) {
  const [workers,    setWorkers]    = useState(baseInputs.workers);
  const [cycleDelta, setCycleDelta] = useState(0);

  function handleRun() {
    const modifiedCycleTimes = baseInputs.cycleTimes.map(ct =>
      Math.max(1, ct + Number(cycleDelta))
    );
    onCompare({ ...baseInputs, workers: Number(workers), cycleTimes: modifiedCycleTimes });
  }

  return (
    <div className="card border-blush-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blush-50 flex items-center justify-center">
          <Sliders size={15} className="text-blush-500"/>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-sage-800">What-if Scenario</h2>
          <p className="text-xs text-gray-400">Adjust parameters and compare instantly</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Workers <span className="text-gray-300">(was {baseInputs.workers})</span>
          </label>
          <input type="number" min="1" value={workers}
            onChange={e => setWorkers(e.target.value)}
            className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Cycle Time Δ (sec) <span className="text-gray-300">applied to all</span>
          </label>
          <input type="number" value={cycleDelta}
            onChange={e => setCycleDelta(e.target.value)}
            className="input-field" placeholder="e.g. -5 or +10" />
        </div>
      </div>

      <button onClick={handleRun}
        className="btn-secondary flex items-center gap-2 w-full justify-center">
        <RefreshCw size={14}/>
        Compare Scenario
      </button>
    </div>
  );
}
