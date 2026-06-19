import { Bell, Search } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const viewTitles: Record<ViewState, string> = {
  dashboard: 'Dashboard',
  create: 'Criar Animação',
  characters: 'Atores Virtuais',
  behaviors: 'Módulo de Comportamentos',
  backgrounds: 'Biblioteca de Cenários',
  scenes: 'Estúdio de Cenas',
  templates: 'Templates de Vídeo',
  history: 'Histórico de Vídeos',
};

export function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
      <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
        {viewTitles[currentView]}
      </h1>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
          />
        </div>
        
        <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        {currentView !== 'create' && (
          <button 
            onClick={() => onNavigate('create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-200"
          >
            Novo Vídeo
          </button>
        )}
      </div>
    </header>
  );
}
