import { useState } from 'react';
import { Plus, MoreHorizontal, MessageSquare, Footprints, User, BrainCircuit, Mic, Smile, Palette, Package, Activity, Navigation, LogIn, PartyPopper, Users } from 'lucide-react';
import { MOCK_CHARACTERS } from '../data';
import { ViewState } from '../types';

interface CharactersProps {
  onNavigate: (view: ViewState) => void;
  store?: any;
}

export function Characters({ onNavigate, store }: CharactersProps) {
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  
  const characters = store?.characters || MOCK_CHARACTERS;

  const quickActions = [
    { label: 'Falar', icon: MessageSquare },
    { label: 'Andar', icon: Footprints },
    { label: 'Apontar', icon: Navigation },
    { label: 'Mostrar Produto', icon: Package },
    { label: 'Acenar', icon: User },
    { label: 'Comemorar', icon: PartyPopper },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Atores Virtuais</h2>
          <p className="text-slate-500">Cadastre seus avatares e configure suas memórias e comportamentos.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Novo Ator Virtual
        </button>
      </div>

      <div className="flex gap-8 flex-1 min-h-0">
        {/* Character List */}
        <div className="w-1/3 min-w-[320px] overflow-y-auto pr-2 space-y-4">
          {characters.map((char: any) => (
            <div 
              key={char.id} 
              onClick={() => setSelectedChar(char.id)}
              className={`bg-white border rounded-2xl p-4 flex gap-4 cursor-pointer transition-all ${selectedChar === char.id ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}
            >
              <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="flex-1 min-w-0 py-1 flex flex-col">
                <h3 className="font-bold text-slate-800 truncate mb-1">{char.name}</h3>
                <p className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md w-max mb-auto">{char.category}</p>
                {char.favoriteBehaviors && (
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    Memória Ativa
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Character Detail & Memory Dashboard */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-y-auto">
          {selectedChar ? (() => {
            const char = characters.find((c: any) => c.id === selectedChar)!;
            return (
              <div className="p-8">
                <div className="flex items-start gap-6 border-b border-slate-100 pb-8 mb-8">
                  <div className="w-32 h-32 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-black text-slate-800">{char.name}</h2>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg border border-indigo-100">Pronto para atuar</span>
                    </div>
                    <p className="text-slate-500 font-medium mb-6">Cadastrado há 2 meses</p>
                    
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Ações Rápidas (Gerar Cena)</p>
                      <div className="flex flex-wrap gap-2">
                        {quickActions.map(action => (
                          <button key={action.label} onClick={() => onNavigate('create')} className="bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors">
                            <action.icon className="w-4 h-4" />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Memory Settings */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-2">
                       <BrainCircuit className="w-5 h-5 text-indigo-600" />
                       <h3 className="text-xl font-bold text-slate-800">Memória do Avatar</h3>
                     </div>
                     <button className="text-indigo-600 text-sm font-bold hover:text-indigo-800">
                       Editar Memória
                     </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* Voice & Style */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                       <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                           <Mic className="w-4 h-4" />
                         </div>
                         <div>
                           <p className="text-xs font-bold text-slate-400 uppercase">Voz Padrão</p>
                           <p className="font-semibold text-slate-800">{char.defaultVoice || 'Não configurada'}</p>
                         </div>
                       </div>
                       <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                           <Smile className="w-4 h-4" />
                         </div>
                         <div>
                           <p className="text-xs font-bold text-slate-400 uppercase">Expressão Principal</p>
                           <p className="font-semibold text-slate-800">{char.defaultExpression || 'Neutra'}</p>
                         </div>
                       </div>
                       <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                           <Palette className="w-4 h-4" />
                         </div>
                         <div>
                           <p className="text-xs font-bold text-slate-400 uppercase">Estilo de Fala</p>
                           <p className="font-semibold text-slate-800">{char.speakingStyle || 'Natural'}</p>
                         </div>
                       </div>
                    </div>

                    {/* Behaviors & Scenes */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                       <div>
                         <p className="text-xs font-bold text-slate-400 uppercase mb-2">Movimentos Favoritos</p>
                         <div className="flex flex-wrap gap-2">
                           {char.favoriteBehaviors?.length ? char.favoriteBehaviors.map(b => (
                             <span key={b} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-sm text-slate-700 font-medium shadow-sm">{b}</span>
                           )) : <span className="text-sm text-slate-500">Nenhum salvo.</span>}
                         </div>
                       </div>
                       <div className="pt-2">
                         <p className="text-xs font-bold text-slate-400 uppercase mb-2">Objetos Frequentes</p>
                         <div className="flex flex-wrap gap-2">
                           {char.frequentObjects?.length ? char.frequentObjects.map(b => (
                             <span key={b} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-sm text-slate-700 font-medium shadow-sm">{b}</span>
                           )) : <span className="text-sm text-slate-500">Nenhum salvo.</span>}
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })() : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                <Users className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-1">Selecione um Ator Virtual</h3>
              <p className="max-w-xs">Clique em um personagem na lista ao lado para ver sua memória e ações rápidas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
