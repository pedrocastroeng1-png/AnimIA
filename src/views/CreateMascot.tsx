import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, Camera, Image as ImageIcon, X, CheckCircle2, RotateCcw, Edit3, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';
import { Character } from '../types';

interface CreateMascotProps {
  onFinish: (char: Character) => void;
  onCancel: () => void;
}

type Step = 'input' | 'generating' | 'review';

const EXPRESSIONS = [
  { id: 'feliz', label: 'Feliz', emoji: '😀' },
  { id: 'acenando', label: 'Acenando', emoji: '👋' },
  { id: 'falando', label: 'Falando', emoji: '🗣' },
  { id: 'comemorando', label: 'Comemorando', emoji: '🎉' },
  { id: 'apontando', label: 'Apontando', emoji: '👉' },
  { id: 'pensativo', label: 'Pensativo', emoji: '🤔' },
  { id: 'surpreso', label: 'Surpreso', emoji: '😮' },
];

export function CreateMascot({ onFinish, onCancel }: CreateMascotProps) {
  const [step, setStep] = useState<Step>('input');
  
  // Input State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState<{ url: string, name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generating State
  const [loadingText, setLoadingText] = useState('Analisando aparência e anatomia...');
  
  // Review State
  const [generatedData, setGeneratedData] = useState<{
    category: string;
    style: string;
    personality: string;
    colors: string;
  } | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMainImage({ url, name: file.name });
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMainImage(null);
  };

  const isFormValid = name.trim() !== '' && (mainImage !== null || description.trim() !== '');

  const startGeneration = () => {
    if (!isFormValid) return;
    
    setStep('generating');
    setLoadingText('Analisando aparência e anatomia...');
    
    setTimeout(() => {
      setLoadingText('Mapeando estrutura estilo 3D Cartoon...');
    }, 1500);
    
    setTimeout(() => {
      setLoadingText('Gerando biblioteca de expressões e movimentos...');
    }, 3000);
    
    setTimeout(() => {
      setLoadingText('Finalizando ficha estrutural...');
    }, 4500);

    setTimeout(() => {
      const descLower = description.toLowerCase();
      let cat = 'Mascote 3D';
      if (descLower.includes('peixe')) cat = 'Mascote Aquático';
      else if (descLower.includes('tigre') || descLower.includes('cachorro') || descLower.includes('gato')) cat = 'Animal 3D Cartoon';
      else if (descLower.includes('robô') || descLower.includes('robo')) cat = 'Robô Inteligente';
      else if (descLower.includes('construtor') || descLower.includes('ferramenta')) cat = 'Mascote Corporativo';
      else if (name) cat = 'Mascote Exclusivo';

      setGeneratedData({
        category: cat,
        style: '3D Cartoon / Pixar-like',
        personality: 'Amigável e Expressivo',
        colors: mainImage ? 'Extraídas da referência visual' : 'Adaptadas da descrição',
      });
      setStep('review');
    }, 5500);
  };

  const handleApprove = () => {
    onFinish({
      id: 'mascot_' + Date.now(),
      name: name,
      category: generatedData?.category || 'Mascote 3D',
      imageUrl: mainImage?.url || 'https://images.unsplash.com/photo-1579548122080-c35fd6820ceb?auto=format&fit=crop&q=80&w=600&h=600',
      description: description,
      defaultVoice: 'Masculina Padrão', // automatically assign a default voice for simplicity
      personality: generatedData?.personality || 'Amigável',
    });
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen overflow-hidden flex flex-col pt-12 p-8">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Treinamento de Mascote</h2>
            <p className="text-slate-500 font-medium mt-1">Crie um apresentador virtual único em segundos.</p>
          </div>
          {step === 'input' && (
            <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors px-4 py-2 rounded-lg hover:bg-slate-100">
              Cancelar
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            
            {/* STEP: INPUT */}
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 md:p-12 space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Qual será o nome do mascote?</h3>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-lg font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:font-semibold placeholder:text-slate-400" 
                    placeholder="Ex: Tigrão, Ferramentinha, Robô Gui..." 
                  />
                </div>

                <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100/60 rounded-3xl p-8 space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                     <Wand2 className="w-32 h-32 text-indigo-400 rotate-12" />
                   </div>
                   
                   <div className="relative z-10">
                     <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-indigo-500" />
                       Referências Visuais
                     </h3>
                     <p className="text-slate-500 font-medium mb-6">Forneça uma imagem OU uma descrição (ou ambos) para a IA gerar o personagem.</p>
                     
                     <div className="grid md:grid-cols-2 gap-6">
                        {/* Image Upload */}
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Imagem Principal</label>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/png, image/jpeg, image/jpg, image/webp" 
                            className="hidden" 
                          />
                          <div 
                            onClick={handleImageClick}
                            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer w-full h-48 relative overflow-hidden group ${mainImage ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50'}`}
                          >
                            {mainImage ? (
                              <>
                                <img src={mainImage.url} alt="Referência" className="absolute inset-0 w-full h-full object-contain p-2" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                                   <ImageIcon className="w-8 h-8 mb-2" />
                                   <span className="text-sm font-bold text-center">Alterar Imagem</span>
                                </div>
                                <button 
                                  onClick={handleRemoveImage}
                                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full z-10 transition-colors shadow-lg scale-90 hover:scale-100"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <Camera className="w-10 h-10 text-slate-400 mb-3 group-hover:text-indigo-500 transition-colors" />
                                <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600">Escolher Imagem</span>
                                <span className="text-xs text-slate-400 mt-1 font-medium">Opcional</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Text Description */}
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Descrição do Mascote</label>
                          <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Peixe construtor amigável usando capacete amarelo e camisa vermelha."
                            className="w-full h-48 bg-white border border-slate-200 rounded-2xl px-5 py-4 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 resize-none transition-all placeholder:font-medium placeholder:text-slate-400"
                          />
                        </div>
                     </div>
                   </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={startGeneration}
                    disabled={!isFormValid}
                    className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl"
                  >
                    <Wand2 className="w-6 h-6" />
                    GERAR MASCOTE IA
                  </button>
                  <p className="text-center text-slate-500 text-sm font-medium mt-4">
                    A IA cuidará da modelagem 3D, rigging de expressões e adaptação da voz automaticamente.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP: GENERATING */}
            {step === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-white/80 backdrop-blur-sm z-20"
              >
                <div className="w-32 h-32 relative mb-8">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 border-4 border-indigo-200 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                    <BrainCircuit className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4 animate-pulse">Treinando IA...</h3>
                <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-full font-bold text-sm inline-flex items-center gap-2 shadow-sm">
                  <Wand2 className="w-4 h-4 animate-bounce" />
                  {loadingText}
                </div>
              </motion.div>
            )}

            {/* STEP: REVIEW */}
            {step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 md:p-12"
              >
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 font-bold mb-8 shadow-sm border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  Mascote treinado e estruturado com sucesso!
                </div>

                <div className="grid md:grid-cols-5 gap-10">
                  {/* Left Column: Visuals */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-inner relative">
                       <img 
                         src={mainImage?.url || 'https://images.unsplash.com/photo-1579548122080-c35fd6820ceb?auto=format&fit=crop&q=80&w=600&h=600'} 
                         alt={name} 
                         className="w-full h-full object-cover mix-blend-multiply" 
                       />
                       <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12">
                          <h3 className="text-2xl font-black text-white">{name}</h3>
                          <p className="text-white/80 font-medium text-sm">{generatedData?.category}</p>
                       </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Expressões Geradas</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {EXPRESSIONS.map((exp, i) => (
                           <div key={exp.id} className="aspect-square bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center hover:bg-white hover:shadow-md hover:border-indigo-300 transition-all cursor-default group">
                              <span className="text-2xl mb-1 group-hover:scale-125 transition-transform">{exp.emoji}</span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{exp.label}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Details & Actions */}
                  <div className="md:col-span-3 flex flex-col">
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex-1 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                         <BrainCircuit className="w-32 h-32" />
                      </div>
                      
                      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                         <Wand2 className="w-5 h-5 text-indigo-600" />
                         Ficha de Personagem (Análise IA)
                      </h3>

                      <div className="space-y-6 relative z-10">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nome Oficial</p>
                          <p className="text-lg font-black text-slate-800">{name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Categoria</p>
                          <p className="text-lg font-bold text-indigo-700 bg-indigo-50 inline-block px-3 py-1 rounded-lg">{generatedData?.category}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Estilo Visual</p>
                          <p className="text-base font-bold text-slate-700">{generatedData?.style}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Personalidade</p>
                          <p className="text-base font-bold text-slate-700">{generatedData?.personality}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Esquema de Cores</p>
                          <p className="text-base font-bold text-slate-700">{generatedData?.colors}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                       <button 
                         onClick={() => setStep('input')}
                         className="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                       >
                         <Edit3 className="w-5 h-5" />
                         Editar Descrição
                       </button>
                       <button 
                         onClick={startGeneration}
                         className="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                       >
                         <RotateCcw className="w-5 h-5" />
                         Regenerar Análise
                       </button>
                    </div>

                    <button 
                      onClick={handleApprove}
                      className="mt-4 w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Aprovar Personagem
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

