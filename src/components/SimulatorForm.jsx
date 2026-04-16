import { useState } from 'react';
import { Play, Plus, Minus } from 'lucide-react';

export default function SimulatorForm({ onResult, loading }) {
  const [workers,       setWorkers]       = useState(5);
  const [stations,      setStations]      = useState(3);
  const [shiftDuration, setShiftDuration] = useState(480);
  const [cycleTimes,    setCycleTimes]    = useState([30, 45, 25]);

  function updateStations(n) {
    const count = Math.max(1, n);
    setStations(count);
    setCycleTimes(prev => {
      const arr = [...prev];
      while (arr.length < count) arr.push(30);
      return arr.slice(0, count);
    });
  }

  function updateCycleTime(i, val) {
    setCycleTimes(prev => prev.map((v, idx) => idx === i ? Number(val) || 0 : v));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onResult({ workers, stations, cycleTimes, shiftDuration });
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-sage-800">Simulation Inputs</h2>
        <p className="text-xs text-gray-400 mt-0.5">Configure your production line parameters</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Workers</label>
          <input type="number" min="1" value={workers}
            onChange={e => setWorkers(Number(e.target.value))}
            className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Shift Duration (min)</label>
          <input type="number" min="1" value={shiftDuration}
            onChange={e => setShiftDuration(Number(e.target.value))}
            className="input-field" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-500">Stations & Cycle Times (sec)</label>
          <div className="flex gap-1 items-center">
            <button type="button" onClick={() => updateStations(stations - 1)}
              className="p-1 rounded-lg bg-sage-50 hover:bg-sage-100 text-sage-600">
              <Minus size={14}/>
            </button>
            <span className="text-xs font-semibold text-sage-700 px-2 py-1">{stations}</span>
            <button type="button" onClick={() => updateStations(stations + 1)}
              className="p-1 rounded-lg bg-sage-50 hover:bg-sage-100 text-sage-600">
              <Plus size={14}/>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {cycleTimes.map((ct, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-20 shrink-0">Station {i + 1}</span>
              <input type="number" min="1" value={ct}
                onChange={e => updateCycleTime(i, e.target.value)}
                className="input-field" />
              <span className="text-xs text-gray-400">sec</span>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="btn-primary flex items-center justify-center gap-2 mt-1">
        <Play size={15}/>
        {loading ? 'Simulating...' : 'Run Simulation'}
      </button>
    </form>
  );
}
