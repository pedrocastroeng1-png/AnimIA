import { Activity, Play, Plus, Search, MoreHorizontal } from 'lucide-react';
import { MOCK_BEHAVIORS } from '../data';

export function Behaviors() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Comportamentos</h2>
          <p className="text-slate-500">Gerencie ações, movimentos e expressões dos seus avatares.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Novo Comportamento
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_BEHAVIORS.map(b => (
          <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{b.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{b.category}</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-indigo-600">
              <Play className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
