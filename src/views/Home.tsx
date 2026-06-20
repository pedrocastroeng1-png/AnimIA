import { UserPlus, Sparkles, Clock, Video, Plus, Wand2 } from 'lucide-react';
import { Character } from '../types';

interface HomeProps {
  store: any;
  onNavigateToCreate: () => void;
  onSelectCharacter: (char: Character) => void;
}

export function Home({ store, onNavigateToCreate, onSelectCharacter }: HomeProps) {
  const characters = store?.characters || [];

  return (
    <div className="flex-1 bg-slate-50 min-h-screen overflow-y-auto w-full p-8">
      <div className="max-w-6xl mx-auto space-y-12 pb-16">
        
        <header className="text-center pt-12 pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 mb-6 transition-transform hover:scale-110">
            <Wand2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight sm:text-5xl mb-4">
            Estúdio de Mascotes IA
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Crie mascotes inteligentes e transforme-os em apresentadores virtuais para vídeos, anúncios e campanhas.
          </p>
        </header>

        {characters.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
             <div className="text-6xl mb-6">🎭</div>
             <h2 className="text-3xl font-black text-slate-800 mb-4">Nenhum mascote criado ainda</h2>
             <p className="text-lg text-slate-500 font-medium mb-8 max-w-md">
               Crie seu primeiro mascote para começar a produzir vídeos e animações.
             </p>
             <button 
               onClick={onNavigateToCreate}
               className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center gap-2"
             >
               <Plus className="w-6 h-6" />
               Criar Primeiro Mascote
             </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Sua Coleção de Mascotes</h2>
              <button 
                onClick={onNavigateToCreate}
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Novo Mascote
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {characters.map((char: Character) => {
                 const videoCount = store?.history?.filter((h: any) => h.characterId === char.id)?.length || 0;
                 
                 return (
                  <button
                    key={char.id}
                    onClick={() => onSelectCharacter(char)}
                    className="flex flex-col bg-white rounded-3xl border border-slate-200 hover:border-indigo-600 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden text-left group"
                  >
                    <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                      <img 
                        src={char.imageUrl} 
                        alt={char.name} 
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur text-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          {char.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-3 border-t border-slate-100">
                      <h3 className="text-xl font-black text-slate-800 truncate">{char.name}</h3>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>Hoje</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                          <Video className="w-4 h-4" />
                          <span>{videoCount} vídeos</span>
                        </div>
                      </div>
                    </div>
                  </button>
                 )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
