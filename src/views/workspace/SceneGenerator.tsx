import { Sparkles, Image, User, Layers, Video } from 'lucide-react';
import { Character } from '../../types';

interface SceneGeneratorProps {
  activeCharacter: Character;
  store: any;
}

export function SceneGenerator({ activeCharacter, store }: SceneGeneratorProps) {
  return (
    <div className="flex h-full flex-col lg:flex-row bg-slate-50">
      
      {/* Visual Canvas */}
      <div className="flex-1 flex flex-col p-8 relative items-center justify-center border-r border-slate-200">
         <div className="w-[360px] h-[640px] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white isolate">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center opacity-50"></div>
            
            <div className="absolute inset-x-0 bottom-0 top-1/2 flex items-end justify-center p-8 bg-gradient-to-t from-black/50 to-transparent">
               <img src={activeCharacter.imageUrl} className="w-64 h-64 object-contain mix-blend-multiply drop-shadow-2xl hover:scale-105 transition-transform cursor-grab" />
            </div>

            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-md flex items-center gap-2">
               <Video className="w-4 h-4 text-rose-500" />
               Cena 1 (00:00)
            </div>
         </div>
      </div>

      {/* Editor Panel */}
      <div className="w-96 bg-white flex flex-col h-full overflow-y-auto hidden lg:flex shrink-0">
         <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Layers className="w-5 h-5 text-indigo-600" />
               Customizar Cena
            </h2>
         </div>

         <div className="p-6 space-y-8">
            {/* Background Control */}
            <div>
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Image className="w-4 h-4" /> Cenário
               </h3>
               <div className="grid grid-cols-2 gap-2">
                  <button className="aspect-video bg-slate-100 rounded-lg border-2 border-indigo-600 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </button>
                  <button className="aspect-video bg-slate-100 rounded-lg border border-slate-200 hover:border-indigo-300 relative overflow-hidden opacity-50">
                    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </button>
               </div>
            </div>

            {/* Character Control */}
            <div>
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" /> Mascote ({activeCharacter.name})
               </h3>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Comportamento (Ação)</label>
               <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                  <option>Falar e Gesticular</option>
                  <option>Apontar para o lado</option>
                  <option>Emocionado/Comemorar</option>
                  <option>Mostrar Produto</option>
               </select>

               <label className="block text-sm font-semibold text-slate-700 mt-4 mb-2">Posição</label>
               <div className="flex gap-2">
                 <button className="flex-1 py-2 text-center bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 rounded-lg">Meio</button>
                 <button className="flex-1 py-2 text-center bg-white text-slate-600 font-bold border border-slate-200 rounded-lg">Lado</button>
               </div>
            </div>

            {/* Subtitle/Text Control */}
            <div>
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Roteiro (Fala da Cena)
               </h3>
               <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" placeholder="Escreva a fala do personagem para esta cena..."></textarea>
               <button className="mt-3 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                  Gerar Narração (TTS)
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
