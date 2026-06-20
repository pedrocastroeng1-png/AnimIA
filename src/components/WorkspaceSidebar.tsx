import { Clapperboard, Image, Package, Truck, Wand2, FolderOpen, Settings, Mic } from 'lucide-react';
import { WorkspaceView } from '../types';

interface WorkspaceSidebarProps {
  currentView: WorkspaceView;
  onNavigate: (view: WorkspaceView) => void;
}

const MENU_ITEMS = [
  { id: 'scenes', label: 'Gerador de Cenas', icon: Clapperboard },
  { id: 'director', label: 'IA Diretora', icon: Wand2 },
  { id: 'backgrounds', label: 'Cenários', icon: Image },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'vehicles', label: 'Veículos', icon: Truck },
  { id: 'voices', label: 'Vozes', icon: Mic },
  { id: 'projects', label: 'Projetos', icon: FolderOpen },
];

export function WorkspaceSidebar({ currentView, onNavigate }: WorkspaceSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-20">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Clapperboard className="w-5 h-5 text-white" />
        </div>
        <span className="font-black text-slate-800 text-lg tracking-tight">Estúdio</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {MENU_ITEMS.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as WorkspaceView)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                 isActive 
                   ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                   : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
               }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
         <button
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
               currentView === 'settings' 
                 ? 'bg-slate-100 text-slate-900 shadow-sm' 
                 : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
             }`}
          >
            <Settings className="w-5 h-5" />
            Config. Mascote
          </button>
      </div>
    </div>
  );
}
