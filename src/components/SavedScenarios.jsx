import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function SavedScenarios({ scenarios, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  if (!scenarios.length) return (
    <div className="card text-center text-sm text-gray-400 py-8">
      No saved scenarios yet. Run a simulation and save it!
    </div>
  );

  return (
    <div className="card flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-sage-800">Saved Scenarios</h2>
      {scenarios.map(s => (
        <div key={s._id} className="border border-sage-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-sage-50 cursor-pointer"
            onClick={() => setExpanded(expanded === s._id ? null : s._id)}>
            <div>
              <p className="text-sm font-medium text-sage-800">{s.name}</p>
              <p className="text-xs text-gray-400">{s.workers} workers · {s.stations} stations · {s.shiftDuration} min shift</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); onDelete(s._id); }}
                className="p-1.5 rounded-lg hover:bg-blush-100 text-blush-400 transition">
                <Trash2 size={13}/>
              </button>
              {expanded === s._id ? <ChevronUp size={14} className="text-sage-400"/> : <ChevronDown size={14} className="text-sage-400"/>}
            </div>
          </div>
          {expanded === s._id && (
            <div className="px-4 py-3 grid grid-cols-2 gap-2 text-xs text-gray-600 bg-white">
              <p><span className="text-gray-400">Units/Shift:</span> <strong>{s.results.unitsPerShift}</strong></p>
              <p><span className="text-gray-400">Utilization:</span> <strong>{s.results.workerUtilization}%</strong></p>
              <p><span className="text-gray-400">Bottleneck:</span> <strong>Station {s.results.bottleneckStation}</strong></p>
              <p><span className="text-gray-400">Optimal Workers:</span> <strong>{s.results.optimalWorkers}</strong></p>
              <p className="col-span-2"><span className="text-gray-400">Cycle Times:</span> <strong>{s.cycleTimes.join(', ')} sec</strong></p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
