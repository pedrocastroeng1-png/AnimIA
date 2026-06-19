import { Clapperboard, Plus, MoreHorizontal } from 'lucide-react';
import { MOCK_SCENES, MOCK_BACKGROUNDS } from '../data';

export function Scenes() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cenas Reutilizáveis</h2>
          <p className="text-slate-500">Crie cenários prontos com posições e decorações pré-configuradas.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Nova Cena
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SCENES.map(scene => {
          const bg = MOCK_BACKGROUNDS.find(b => b.id === scene.backgroundId);
          return (
            <div key={scene.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group hover:border-indigo-200 flex flex-col">
              <div className="aspect-video relative bg-slate-100">
                {bg && <img src={bg.imageUrl} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-indigo-700 flex items-center gap-1">
                  <Clapperboard className="w-3.5 h-3.5" /> Cena Pronta
                </div>
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-slate-900 shadow-sm">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-800 text-lg mb-1">{scene.name}</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4">{scene.description}</p>
                <div className="mt-auto">
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-bold w-full text-left">
                    Editar Configuração
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
