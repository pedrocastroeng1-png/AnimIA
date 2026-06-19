import { Download, Play, MoreHorizontal, Copy } from 'lucide-react';
import { MOCK_HISTORY } from '../data';

export function History() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Histórico de Vídeos</h2>
        <p className="text-slate-500">Todos os vídeos gerados por IA.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 font-medium">
              <th className="py-4 px-6">Vídeo</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Data</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {MOCK_HISTORY.map(video => (
              <tr key={video.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded bg-slate-200 overflow-hidden relative shrink-0">
                      <img src={video.thumbnailUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{video.title}</p>
                      <p className="text-slate-500 text-xs w-64 truncate">{video.script}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Concluído
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-500">
                  {new Date(video.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent" title="Baixar">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent" title="Duplicar">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
