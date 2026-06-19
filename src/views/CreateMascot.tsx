import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, CheckCircle2, User, Camera, Mic, BrainCircuit, Activity, Save } from 'lucide-react';
import { Character } from '../types';

interface CreateMascotProps {
  onFinish: (char: Character) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 'identidade', title: 'Identidade', icon: User },
  { id: 'aparencia', title: 'Aparência', icon: Camera },
  { id: 'voz', title: 'Voz', icon: Mic },
  { id: 'personalidade', title: 'Personalidade', icon: BrainCircuit },
  { id: 'comportamentos', title: 'Comportamentos', icon: Activity },
];

export function CreateMascot({ onFinish, onCancel }: CreateMascotProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  const [draft, setDraft] = useState<Partial<Character>>({
    name: '',
    category: 'Mascote 3D',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1698056230985-2e18587189f3?q=80&w=600&auto=format&fit=crop', // default demo image
    defaultVoice: 'Zephyr',
    personality: 'Profissional',
    favoriteBehaviors: [],
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleTrain = () => {
    setIsTraining(true);
    setTimeout(() => {
      setIsTraining(false);
      setIsDone(true);
    }, 2000);
  };

  const finishCreation = () => {
    onFinish({
      id: 'mascot_' + Date.now(),
      name: draft.name || 'Mascote Novo',
      category: draft.category || 'Outro',
      imageUrl: draft.imageUrl || '',
      defaultVoice: draft.defaultVoice,
      personality: draft.personality,
      favoriteBehaviors: draft.favoriteBehaviors,
      description: draft.description,
    });
  };

  const toggleBehavior = (b: string) => {
    const current = draft.favoriteBehaviors || [];
    if (current.includes(b)) {
      setDraft({ ...draft, favoriteBehaviors: current.filter(x => x !== b) });
    } else {
      setDraft({ ...draft, favoriteBehaviors: [...current, b] });
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen overflow-hidden flex flex-col pt-12 p-8">
       <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
             <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Treinamento de Mascote</h2>
                <p className="text-slate-500 font-medium mt-1">Configure todas as propriedades da sua IA.</p>
             </div>
             <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 font-semibold text-sm">
               Cancelar
             </button>
          </div>

          {!isTraining && !isDone && (
            <div className="flex flex-1 overflow-hidden">
               {/* Sidebar Steps */}
               <div className="w-64 bg-slate-50 border-r border-slate-100 p-6 space-y-2">
                 {STEPS.map((step, idx) => {
                   const isActive = currentStep === idx;
                   const isPast = currentStep > idx;
                   return (
                     <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-indigo-100 text-indigo-700 font-bold' : isPast ? 'text-slate-600 font-semibold' : 'text-slate-400 font-medium'}`}>
                        <step.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : isPast ? 'text-indigo-400' : 'text-slate-300'}`} />
                        {step.title}
                     </div>
                   );
                 })}
               </div>

               {/* Content */}
               <div className="flex-1 p-8 overflow-y-auto">
                 <AnimatePresence mode="popLayout">
                   <motion.div
                     key={currentStep}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="max-w-xl space-y-8"
                   >
                      {currentStep === 0 && (
                        <div className="space-y-6">
                           <h3 className="text-2xl font-bold text-slate-800">Identidade Biográfica</h3>
                           <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Nome do mascote</label>
                             <input type="text" value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" placeholder="Ex: Baianinho, Lu, João..." />
                           </div>
                           <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
                             <select value={draft.category} onChange={e => setDraft({...draft, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                               <option>Mascote 3D</option>
                               <option>Personagem 2D</option>
                               <option>Ator Real</option>
                               <option>Avatar Realista</option>
                             </select>
                           </div>
                           <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Descrição (História / Lore)</label>
                             <textarea value={draft.description} onChange={e => setDraft({...draft, description: e.target.value})} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" placeholder="Quem é esse mascote? Qual seu objetivo?"></textarea>
                           </div>
                        </div>
                      )}

                      {currentStep === 1 && (
                        <div className="space-y-6">
                           <h3 className="text-2xl font-bold text-slate-800">Aparência Visual</h3>
                           <p className="text-slate-500">Faça upload de fotos do mascote em diferentes ângulos para a IA aprender suas feições.</p>
                           
                           <div className="grid grid-cols-2 gap-4">
                              {['Frente', 'Perfil Esquerdo', 'Perfil Direito', 'Costas'].map(angle => (
                                <div key={angle} className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer aspect-square">
                                   <Camera className="w-8 h-8 text-slate-400 mb-2" />
                                   <span className="text-sm font-bold text-slate-600">{angle}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6">
                           <h3 className="text-2xl font-bold text-slate-800">Assinatura de Voz</h3>
                           <div className="space-y-3">
                             {['Masculina (Jovem)', 'Masculina (Madura)', 'Feminina (Jovem)', 'Feminina (Profissional)', 'Nordestina', 'Narrador Publicitário', 'Personalizada'].map(v => (
                               <label key={v} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${draft.defaultVoice === v ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                                 <input type="radio" name="voice" checked={draft.defaultVoice === v} onChange={() => setDraft({...draft, defaultVoice: v})} className="hidden" />
                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${draft.defaultVoice === v ? 'border-indigo-600' : 'border-slate-300'}`}>
                                    {draft.defaultVoice === v && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                 </div>
                                 <span className="font-bold text-slate-700">{v}</span>
                               </label>
                             ))}
                           </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                           <h3 className="text-2xl font-bold text-slate-800">Personalidade e Tom</h3>
                           <div className="grid grid-cols-2 gap-4">
                             {['Comercial / Vendedor', 'Institucional', 'Infantil / Lúdico', 'Engraçado / Memes', 'Profissional / Sério', 'Educativo'].map(p => (
                               <button key={p} onClick={() => setDraft({...draft, personality: p})} className={`p-4 rounded-xl border text-left font-bold transition-all ${draft.personality === p ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}`}>
                                 {p}
                               </button>
                             ))}
                           </div>
                        </div>
                      )}

                      {currentStep === 4 && (
                        <div className="space-y-6">
                           <h3 className="text-2xl font-bold text-slate-800">Comportamentos Base</h3>
                           <p className="text-slate-500">Selecione os movimentos que este mascote deve dominar para a geração de cenas.</p>
                           <div className="flex flex-wrap gap-3">
                             {['Falar para câmera', 'Caminhar', 'Acenar', 'Apontar', 'Comemorar', 'Mostrar produto', 'Mostrar preço', 'Dança', 'Entrar em cena', 'Sair de cena'].map(b => (
                               <button key={b} onClick={() => toggleBehavior(b)} className={`px-4 py-2 rounded-xl border font-bold text-sm transition-all ${draft.favoriteBehaviors?.includes(b) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}`}>
                                 {b}
                               </button>
                             ))}
                           </div>
                        </div>
                      )}
                   </motion.div>
                 </AnimatePresence>
               </div>
            </div>
          )}

          {isTraining && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50">
               <div className="w-24 h-24 relative mb-8">
                  <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-pulse"></div>
                  <div className="absolute border-4 border-indigo-600 rounded-full border-t-transparent animate-spin w-24 h-24"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
               </div>
               <h3 className="text-2xl font-black text-slate-800 mb-2">Treinando Rede Neural...</h3>
               <p className="text-slate-500 max-w-md">Processando ângulos, gerando síntese de voz e calibrando movimentos do esqueleto.</p>
            </div>
          )}

          {isDone && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white">
               <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-sm">
                  <CheckCircle2 className="w-12 h-12" />
               </div>
               <h3 className="text-3xl font-black text-slate-800 mb-2">Mascote Treinado!</h3>
               <p className="text-slate-500 max-w-md mb-8">Base de dados completa. Este mascote agora está pronto para atuar em qualquer vídeo.</p>
               <button onClick={finishCreation} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-600/30">
                 <Save className="w-5 h-5" />
                 Salvar na Biblioteca
               </button>
            </div>
          )}

          {/* Footer Navigation */}
          {!isTraining && !isDone && (
            <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center">
              <div>
                {currentStep > 0 && (
                  <button onClick={handlePrev} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5" />
                    Voltar
                  </button>
                )}
              </div>
              <div>
                {currentStep < STEPS.length - 1 ? (
                  <button onClick={handleNext} disabled={!draft.name && currentStep === 0} className="bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
                    Avançar
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button onClick={handleTrain} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm">
                    Treinar Mascote
                    <BrainCircuit className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

       </div>
    </div>
  );
}
