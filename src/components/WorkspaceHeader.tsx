import { Bell, HelpCircle, LogOut } from 'lucide-react';
import { Character } from '../types';

interface WorkspaceHeaderProps {
  activeCharacter: Character;
  onChangeMascot: () => void;
}

export function WorkspaceHeader({ activeCharacter, onChangeMascot }: WorkspaceHeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
      
      {/* Current Mascot Display */}
      <div className="flex items-center gap-4">
         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mascote Atual:</span>
         <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full pl-2 pr-4 py-1.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
              <img src={activeCharacter.imageUrl} alt={activeCharacter.name} className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <span className="font-bold text-slate-800 text-sm">{activeCharacter.name}</span>
            <button 
               onClick={onChangeMascot}
               className="ml-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full"
            >
               <LogOut className="w-3 h-3" />
               Trocar Mascote
            </button>
         </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold ml-2 shadow-sm border-2 border-white">
          A
        </div>
      </div>
    </header>
  );
}
