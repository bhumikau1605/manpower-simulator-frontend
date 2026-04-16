import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { AlertTriangle, TrendingUp, Users, Clock, Zap, CheckCircle } from 'lucide-react';

const SAGE   = '#4a7c4a';
const BLUSH  = '#e2507a';
const LIGHT  = '#c9dcc9';

export default function ResultsDashboard({ results, inputs, comparison }) {
  if (!results) return null;

  const {
    bottleneckStation, bottleneckCycleTime, effectiveCycleTime,
    unitsPerShift, workerUtilization, idleTimePerWorker,
    optimalWorkers, suggestions,
  } = results;

  // Bar chart: cycle times per station
  const cycleData = inputs.cycleTimes.map((ct, i) => ({
    name: `S${i + 1}`,
    cycleTime: ct,
    isBottleneck: i + 1 === bottleneckStation,
  }));

  // Workers vs output chart
  const workerRange = Array.from({ length: 8 }, (_, i) => {
    const w = Math.max(1, optimalWorkers - 3 + i);
    const util = Math.min(100, ((inputs.cycleTimes.reduce((a,b)=>a+b,0) / (w * effectiveCycleTime)) * 100)).toFixed(1);
    return { workers: w, utilization: parseFloat(util), units: unitsPerShift };
  });

  const stats = [
    { label: 'Units / Shift',       value: unitsPerShift,          unit: 'units',  icon: TrendingUp, color: 'text-sage-600',  bg: 'bg-sage-50'  },
    { label: 'Worker Utilization',  value: `${workerUtilization}`, unit: '%',      icon: Users,      color: 'text-blush-500', bg: 'bg-blush-50' },
    { label: 'Bottleneck Station',  value: `Station ${bottleneckStation}`, unit: `${bottleneckCycleTime}s`, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Optimal Workers',     value: optimalWorkers,         unit: 'workers',icon: Zap,        color: 'text-sage-600',  bg: 'bg-sage-50'  },
    { label: 'Idle Time / Worker',  value: `${idleTimePerWorker}`, unit: 'sec',    icon: Clock,      color: 'text-blush-400', bg: 'bg-blush-50' },
    { label: 'Effective Cycle',     value: effectiveCycleTime,     unit: 'sec',    icon: CheckCircle,color: 'text-sage-500',  bg: 'bg-sage-50'  },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-1`}>
              <s.icon size={16} className={s.color}/>
            </div>
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}
              <span className="text-xs font-normal text-gray-400 ml-1">{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Cycle time chart */}
      <div className="card">
        <h3 className="text-sm font-semibold text-sage-800 mb-4">Cycle Time per Station</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={cycleData} barSize={36}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit="s" />
            <Tooltip formatter={v => [`${v}s`, 'Cycle Time']} />
            <Bar dataKey="cycleTime" radius={[6,6,0,0]}>
              {cycleData.map((d, i) => (
                <Cell key={i} fill={d.isBottleneck ? BLUSH : SAGE} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">
          <span className="inline-block w-3 h-3 rounded-sm bg-blush-500 mr-1 align-middle"></span>
          Bottleneck station highlighted
        </p>
      </div>

      {/* Workers vs Utilization */}
      <div className="card">
        <h3 className="text-sm font-semibold text-sage-800 mb-4">Workers vs Utilization %</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={workerRange}>
            <XAxis dataKey="workers" tick={{ fontSize: 12 }} label={{ value: 'Workers', position: 'insideBottom', offset: -2, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} unit="%" domain={[0, 110]} />
            <Tooltip formatter={v => [`${v}%`, 'Utilization']} />
            <Line type="monotone" dataKey="utilization" stroke={BLUSH} strokeWidth={2.5} dot={{ fill: BLUSH, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison */}
      {comparison && (
        <div className="card border-blush-200">
          <h3 className="text-sm font-semibold text-blush-600 mb-3">What-if Comparison</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Units / Shift', before: comparison.before.unitsPerShift, after: comparison.after.unitsPerShift },
              { label: 'Utilization %', before: comparison.before.workerUtilization, after: comparison.after.workerUtilization },
              { label: 'Optimal Workers', before: comparison.before.optimalWorkers, after: comparison.after.optimalWorkers },
            ].map((row, i) => {
              const diff = ((row.after - row.before) / (row.before || 1) * 100).toFixed(1);
              const positive = row.after >= row.before;
              return (
                <div key={i} className="bg-sage-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">{row.label}</p>
                  <p className="text-sm text-gray-500 line-through">{row.before}</p>
                  <p className="text-lg font-bold text-sage-700">{row.after}</p>
                  <p className={`text-xs font-semibold ${positive ? 'text-sage-500' : 'text-blush-500'}`}>
                    {positive ? '▲' : '▼'} {Math.abs(diff)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="card">
        <h3 className="text-sm font-semibold text-sage-800 mb-3">Optimization Suggestions</h3>
        <ul className="flex flex-col gap-2">
          {suggestions.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600">
              <span className="text-sage-400 mt-0.5">•</span> {s}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
