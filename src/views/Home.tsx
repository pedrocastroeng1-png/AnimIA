import { UserPlus, Sparkles, Clock, Video } from 'lucide-react';
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
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight sm:text-5xl mb-4">
            Atores Virtuais
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            O que você deseja fazer hoje?
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          
           {/* Option 1: Create New Mascot */}
          <button 
            onClick={onNavigateToCreate}
            className="group relative flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-center"
          >
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
               <UserPlus className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">Criar Novo Mascote</h2>
            <p className="text-slate-500 text-lg font-medium max-w-sm">Crie um novo mascote inteligente para utilizar em vídeos e animações.</p>
          </button>

          {/* Option 2: Use Existing Mascot */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col">
            <div className="mb-6 flex justify-between items-end">
               <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Utilizar Mascote Existente</h2>
                  <p className="text-slate-500 font-medium">Selecione para começar a produzir.</p>
               </div>
               <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">{characters.length} cadastrados</span>
            </div>

            {characters.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                  <UserPlus className="w-12 h-12 mb-4 text-slate-300" />
                  <p>Nenhum mascote encontrado.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[400px] pr-2">
                 {characters.map((char: Character) => {
                    const videoCount = store?.history?.filter((h: any) => h.characterId === char.id)?.length || 0;
                    
                    return (
                     <button
                       key={char.id}
                       onClick={() => onSelectCharacter(char)}
                       className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 hover:border-indigo-600 hover:shadow-md transition-all text-left bg-slate-50 hover:bg-white group"
                     >
                       <div className="w-16 h-16 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                         <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform" />
                       </div>
                       <div>
                         <h3 className="font-bold text-slate-800 truncate mb-1">{char.name}</h3>
                         <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                           <Clock className="w-3.5 h-3.5" />
                           Salvo recentemente
                         </div>
                         <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-max">
                           <Video className="w-3.5 h-3.5" />
                           {videoCount} vídeos
                         </div>
                       </div>
                     </button>
                    )
                 })}
               </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
