import { LayoutTemplate, Plus, FileStack } from 'lucide-react';
import { MOCK_TEMPLATES } from '../data';

export function Templates() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Templates</h2>
          <p className="text-slate-500">Modelos de vídeos pré-formatados onde você só altera o texto.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Novo Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_TEMPLATES.map(template => (
          <div key={template.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all group flex flex-col cursor-pointer">
            <div className="w-14 h-14 bg-indigo-50 rounded-xl mb-4 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <FileStack className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-xl mb-1">{template.name}</h3>
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md mb-3 w-max">
              {template.category}
            </span>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">
              {template.description}
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-2">
                Usar Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
