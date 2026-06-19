import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { MOCK_BACKGROUNDS } from '../data';

export function Backgrounds() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cenários</h2>
          <p className="text-slate-500">Gerencie fundos, vídeos e imagens de fundo.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Adicionar Cenário
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_BACKGROUNDS.map(bg => (
          <div key={bg.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:shadow-lg transition-all hover:border-indigo-200">
            <div className="aspect-video relative bg-slate-100">
              <img src={bg.imageUrl} alt={bg.name} className="w-full h-full object-cover" />
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800">{bg.name}</h3>
              <p className="text-sm font-medium text-slate-500">{bg.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
