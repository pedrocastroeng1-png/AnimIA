import { LayoutDashboard, Wand2, Users, Image as ImageIcon, History, LogOut, Activity, Clapperboard, LayoutTemplate } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems: { id: ViewState; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Criar Animação', icon: Wand2 },
    { id: 'characters', label: 'Personagens', icon: Users },
    { id: 'behaviors', label: 'Comportamentos', icon: Activity },
    { id: 'backgrounds', label: 'Cenários', icon: ImageIcon },
    { id: 'scenes', label: 'Cenas', icon: Clapperboard },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'history', label: 'Histórico', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl tracking-tight">
          <Wand2 className="w-6 h-6" />
          <span>AnimIA</span>
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400' 
                    : 'hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors text-sm">
          <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center">
            <span className="text-xs font-bold text-slate-300">P</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-slate-200 font-medium truncate">Pedro</p>
            <p className="text-slate-500 text-xs truncate">Plano Premium</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </aside>
  );
}
