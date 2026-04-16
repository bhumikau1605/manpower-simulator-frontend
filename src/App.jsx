import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Factory, Save, RotateCcw } from 'lucide-react';
import SimulatorForm    from './components/SimulatorForm';
import ResultsDashboard from './components/ResultsDashboard';
import WhatIf           from './components/WhatIf';
import SavedScenarios   from './components/SavedScenarios';
import { runSimulation, saveScenario, getScenarios, deleteScenario } from './api';

export default function App() {
  const [results,     setResults]     = useState(null);
  const [inputs,      setInputs]      = useState(null);
  const [comparison,  setComparison]  = useState(null);
  const [scenarios,   setScenarios]   = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [scenarioName,setScenarioName]= useState('');
  const [tab,         setTab]         = useState('simulator'); // simulator | saved

  useEffect(() => { fetchScenarios(); }, []);

  async function fetchScenarios() {
    try {
      const res = await getScenarios();
      setScenarios(res.data.scenarios);
    } catch { toast.error('Could not load scenarios'); }
  }

  async function handleSimulate(data) {
    setLoading(true);
    setComparison(null);
    try {
      const res = await runSimulation(data);
      setResults(res.data.results);
      setInputs(data);
      toast.success('Simulation complete!');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Simulation failed');
    } finally { setLoading(false); }
  }

  async function handleSave() {
    if (!inputs || !results) return;
    try {
      await saveScenario({ ...inputs, name: scenarioName || 'Unnamed Scenario' });
      toast.success('Scenario saved!');
      setScenarioName('');
      fetchScenarios();
    } catch { toast.error('Could not save scenario'); }
  }

  async function handleDelete(id) {
    try {
      await deleteScenario(id);
      toast.success('Deleted');
      fetchScenarios();
    } catch { toast.error('Could not delete'); }
  }

  async function handleCompare(modifiedInputs) {
    try {
      const [before, after] = await Promise.all([
        runSimulation(inputs),
        runSimulation(modifiedInputs),
      ]);
      setComparison({ before: before.data.results, after: after.data.results });
      toast.success('Comparison ready!');
    } catch { toast.error('Comparison failed'); }
  }

  function handleReset() {
    setResults(null);
    setInputs(null);
    setComparison(null);
  }

  return (
    <div className="min-h-screen bg-sage-50">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#fff', color: '#2e552e', border: '1px solid #c9dcc9', fontSize: '13px' }
      }}/>

      {/* Header */}
      <header className="bg-white border-b border-sage-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sage-500 flex items-center justify-center">
              <Factory size={18} className="text-white"/>
            </div>
            <div>
              <h1 className="text-base font-bold text-sage-900 leading-tight">Manpower Optimization</h1>
              <p className="text-xs text-gray-400">Production Line Simulator</p>
            </div>
          </div>
          <div className="flex gap-1 bg-sage-100 rounded-xl p-1">
            {['simulator','saved'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition capitalize
                  ${tab === t ? 'bg-white text-sage-700 shadow-sm' : 'text-sage-500 hover:text-sage-700'}`}>
                {t === 'saved' ? `Saved (${scenarios.length})` : 'Simulator'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'simulator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">

            {/* Left panel */}
            <div className="flex flex-col gap-4">
              <SimulatorForm onResult={handleSimulate} loading={loading}/>

              {results && (
                <>
                  {/* Save panel */}
                  <div className="card flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-sage-800">Save Scenario</h3>
                    <input value={scenarioName} onChange={e => setScenarioName(e.target.value)}
                      placeholder="Scenario name..." className="input-field"/>
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="btn-primary flex items-center gap-1.5 flex-1 justify-center">
                        <Save size={13}/> Save
                      </button>
                      <button onClick={handleReset} className="btn-ghost flex items-center gap-1.5">
                        <RotateCcw size={13}/> Reset
                      </button>
                    </div>
                  </div>

                  {/* What-if */}
                  <WhatIf baseInputs={inputs} onCompare={handleCompare}/>
                </>
              )}
            </div>

            {/* Right panel */}
            <div>
              {results
                ? <ResultsDashboard results={results} inputs={inputs} comparison={comparison}/>
                : (
                  <div className="card h-full min-h-[400px] flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-sage-100 flex items-center justify-center">
                      <Factory size={28} className="text-sage-400"/>
                    </div>
                    <p className="text-sm font-medium text-sage-700">Run a simulation to see results</p>
                    <p className="text-xs text-gray-400 max-w-xs">Configure your production line on the left and click Run Simulation</p>
                  </div>
                )
              }
            </div>
          </div>
        ) : (
          <SavedScenarios scenarios={scenarios} onDelete={handleDelete}/>
        )}
      </main>
    </div>
  );
}
