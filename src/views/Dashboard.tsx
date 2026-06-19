import { useState } from 'react';
import { Video, Wand2, Users, LayoutTemplate, Play, Sparkles } from 'lucide-react';
import { MOCK_HISTORY, MOCK_CHARACTERS } from '../data';
import { ViewState } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewState, aiPrompt?: string) => void;
  store?: any;
}

export function Dashboard({ onNavigate, store }: DashboardProps) {
  const [prompt, setPrompt] = useState("");

  const stats = [
    { label: 'Vídeos Criados', value: store?.history?.length.toString() || '0', icon: Video, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { label: 'Atores Virtuais', value: store?.characters?.length.toString() || '0', icon: Users, color: 'text-rose-500', bg: 'bg-rose-100' },
    { label: 'Cenas e Templates', value: '18', icon: LayoutTemplate, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* AI Director Section */}
      <div className="bg-white rounded-3xl p-2 shadow-xl shadow-indigo-100/50 border border-indigo-50/50">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 blur-3xl rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Sparkles className="w-6 h-6 text-indigo-100" />
              </div>
              <h2 className="text-2xl font-bold">IA Diretora</h2>
            </div>
            
            <p className="text-indigo-100 text-lg mb-4">O que você deseja anunciar?</p>
            
            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Crie uma propaganda anunciando telha colonial..."
                className="flex-1 bg-transparent border-none text-white placeholder:text-indigo-200 px-4 py-3 focus:outline-none focus:ring-0 text-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && prompt.trim()) {
                    onNavigate('create', prompt);
                  }
                }}
              />
              <button 
                onClick={() => {
                  if (prompt.trim()) {
                    onNavigate('create', prompt);
                  }
                }}
                className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 hover:scale-105 transition-all shadow-sm disabled:opacity-50 disabled:hover:scale-100"
                disabled={!prompt.trim()}
              >
                Gerar com IA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recents */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Criações Recentes</h3>
          <button 
            onClick={() => onNavigate('history')}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
          >
            Ver todos
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_HISTORY.map(video => (
            <div key={video.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm group hover:shadow-md transition-all cursor-pointer hover:border-indigo-100">
              <div className="aspect-video relative">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                    <Play className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700">
                  {video.format}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 mb-1">{video.title}</h4>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">"{video.script}"</p>
                <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {MOCK_CHARACTERS.find(c => c.id === video.characterId)?.name}
                  </span>
                  <span>Há 2h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
