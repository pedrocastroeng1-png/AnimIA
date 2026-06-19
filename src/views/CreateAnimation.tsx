import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Wand2, CheckCircle2, Play, Download, Loader2, LayoutTemplate } from 'lucide-react';
import { MOCK_CHARACTERS, MOCK_BACKGROUNDS } from '../data';
import { ViewState, DraftVideo } from '../types';

interface CreateProps {
  onNavigate: (view: ViewState) => void;
  initialPrompt?: string;
  store?: any;
}

const STEPS = [
  'Personagem',
  'Cenário',
  'Roteiro',
  'Voz',
  'Estilo',
  'Formato',
  'Gerar'
];

const VOICES = ['Masculina', 'Feminina', 'Infantil', 'Nordestina', 'Paulista', 'Carioca', 'Corporativa', 'Narrador'];
const STYLES = ['Realista', 'Cartoon', '3D Pixar', 'Comercial de TV', 'Cinematográfico', 'Infantil', 'Corporativo'];
const FORMATS = [
  { id: 'reels', label: 'Reels / TikTok', res: '1080x1920', icon: '📱' },
  { id: 'horizontal', label: 'YouTube / TV', res: '1920x1080', icon: '📺' },
  { id: 'quadrado', label: 'Quadrado (Feed)', res: '1080x1080', icon: '⏹️' }
];

export function CreateAnimation({ onNavigate, initialPrompt, store }: CreateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<DraftVideo>({ script: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  
  // AI Generated Results
  const [aiResult, setAiResult] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);

  useEffect(() => {
    if (initialPrompt) {
      handleAIGenerateFromPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleAIGenerateFromPrompt = async (prompt: string) => {
    setIsGenerating(true);
    setCurrentStep(STEPS.length - 1);
    
    // Choose defaults if not set manually
    const defaultCharacter = MOCK_CHARACTERS[0];
    const defaultBackground = MOCK_BACKGROUNDS[0];
    
    setDraft({
      ...draft,
      characterId: defaultCharacter.id,
      backgroundId: defaultBackground.id,
      format: 'reels',
      style: 'Comercial de TV',
      voice: 'Narrador'
    });

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          characterData: defaultCharacter,
          backgroundData: defaultBackground
        })
      });

      const json = await response.json();
      if (json.success) {
        setAiResult(json.data);
        // Save to history
        if (store?.addHistory) {
           store.addHistory({
             id: 'vid_' + Date.now(),
             title: json.data.title || 'Vídeo Gerado por IA',
             characterId: defaultCharacter.id,
             backgroundId: defaultBackground.id,
             script: json.data.fullScript || prompt,
             voice: 'Zephyr (IA)',
             format: 'reels',
             thumbnailUrl: defaultBackground.imageUrl,
             createdAt: new Date().toISOString(),
             status: 'completed',
           });
        }
      } else {
        alert('Erro ao gerar roteiro via IA.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while generating video.');
    } finally {
      setIsGenerating(false);
      setGenerationComplete(true);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        // Reset scene if finished
        if (currentSceneIdx >= (aiResult?.scenes?.length || 1) - 1 && audioRef.current.ended) {
           setCurrentSceneIdx(0);
           audioRef.current.currentTime = 0;
           audioRef.current.play();
        }
      }
      setIsPlaying(!isPlaying);
    } else if (!audioRef.current && !isPlaying) {
       // if no audio simply simulate scene timing
       setIsPlaying(!isPlaying);
    }
  };

  // Simulate scene progression based on time (mock logic for visual)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && aiResult && aiResult.scenes) {
      interval = setInterval(() => {
         setCurrentSceneIdx((prev) => {
           if (prev < aiResult.scenes.length - 1) return prev + 1;
           return prev; // stays at last until audio ends
         });
      }, 3000); // switch scene every 3 seconds roughly
    }
    return () => clearInterval(interval);
  }, [isPlaying, aiResult]);

  useEffect(() => {
    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentSceneIdx(aiResult?.scenes?.length ? aiResult.scenes.length - 1 : 0);
    };
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
    }
  }, [audioRef.current, aiResult]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
  };
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay if manual
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 h-full flex flex-col relative">
      
      {/* Stepper Header */}
      {!generationComplete && !isGenerating && (
        <div className="mb-8">
          <div className="flex items-center justify-between relative z-10">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' : isPast ? 'bg-indigo-100 border-indigo-100 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'}`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-semibold ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{step}</span>
                </div>
              );
            })}
            {/* Progress Line */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-200 -z-10">
              <motion.div 
                className="h-full bg-indigo-600" 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-visible relative">
        <AnimatePresence mode="wait">
          {!generationComplete && !isGenerating && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col"
            >
              <div className="flex-1 overflow-y-auto pr-2 pb-8">
                
                {/* STEP 1: CHARACTER */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Escolha o Personagem</h2>
                      <p className="text-slate-500">Selecione o mascote ou avatar que irá apresentar o vídeo.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {MOCK_CHARACTERS.map(c => (
                        <button 
                          key={c.id} 
                          onClick={() => setDraft({ ...draft, characterId: c.id })}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${draft.characterId === c.id ? 'border-indigo-600 shadow-md shadow-indigo-200' : 'border-slate-100 hover:border-indigo-300'}`}
                        >
                          <img src={c.imageUrl} className="w-full h-full object-cover mix-blend-multiply bg-slate-50" />
                          <div className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end ${draft.characterId === c.id ? 'opacity-100' : 'opacity-0'}`}>
                             <p className="text-white font-bold text-sm">{c.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: BACKGROUND */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Escolha o Cenário</h2>
                      <p className="text-slate-500">Onde a gravação vai acontecer?</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {MOCK_BACKGROUNDS.map(bg => (
                        <button 
                          key={bg.id} 
                          onClick={() => setDraft({ ...draft, backgroundId: bg.id })}
                          className={`relative aspect-video rounded-2xl overflow-hidden border-2 transition-all ${draft.backgroundId === bg.id ? 'border-indigo-600 shadow-md shadow-indigo-200' : 'border-slate-100 hover:border-indigo-300'}`}
                        >
                          <img src={bg.imageUrl} className="w-full h-full object-cover" />
                          <div className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end ${draft.backgroundId === bg.id ? 'opacity-100' : 'opacity-0'}`}>
                             <p className="text-white font-bold text-sm tracking-wide">{bg.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: SCRIPT */}
                {currentStep === 2 && (
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Roteiro</h2>
                      <p className="text-slate-500">O que o personagem deve falar?</p>
                    </div>
                    <div className="space-y-2">
                       <textarea 
                         value={draft.script}
                         onChange={(e) => setDraft({ ...draft, script: e.target.value.slice(0, 1000) })}
                         placeholder="Ex: Olá, pessoal! Temos uma super promoção..."
                         className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all text-slate-800 font-medium"
                       />
                       <p className="text-right text-xs font-semibold text-slate-400">
                         {draft.script.length} / 1000 caracteres
                       </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: VOICE */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Voz Inteligente</h2>
                      <p className="text-slate-500">Escolha o timbre que dará vida ao seu projeto.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       {VOICES.map(v => (
                         <button 
                           key={v}
                           onClick={() => setDraft({ ...draft, voice: v })}
                           className={`p-4 rounded-xl border-2 text-left transition-all ${draft.voice === v ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-200 hover:border-indigo-300'}`}
                         >
                           <Play className={`w-5 h-5 mb-2 ${draft.voice === v ? 'text-indigo-600' : 'text-slate-400'}`} />
                           <p className={`font-bold ${draft.voice === v ? 'text-indigo-700' : 'text-slate-700'}`}>{v}</p>
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: STYLE */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Estilo Visual</h2>
                      <p className="text-slate-500">Defina o tom e a estética da animação final.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {STYLES.map(s => (
                         <button 
                           key={s}
                           onClick={() => setDraft({ ...draft, style: s })}
                           className={`px-6 py-3 rounded-full border-2 font-bold transition-all ${draft.style === s ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'}`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: FORMAT */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Formato de Saída</h2>
                      <p className="text-slate-500">Para onde este vídeo vai?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {FORMATS.map(f => (
                         <button 
                           key={f.id}
                           onClick={() => setDraft({ ...draft, format: f.id, resolution: f.res })}
                           className={`p-6 rounded-2xl border-2 text-center transition-all ${draft.format === f.id ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' : 'border-slate-200 hover:border-indigo-300'}`}
                         >
                           <div className="text-4xl mb-4">{f.icon}</div>
                           <h3 className={`font-bold text-lg mb-1 ${draft.format === f.id ? 'text-indigo-800' : 'text-slate-800'}`}>{f.label}</h3>
                           <p className={`text-sm font-semibold ${draft.format === f.id ? 'text-indigo-500' : 'text-slate-400'}`}>{f.res}</p>
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                {/* STEP 7: REVIEW */}
                {currentStep === 6 && (
                  <div className="space-y-8 flex flex-col items-center justify-center text-center pt-8">
                     <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-indigo-50 shadow-inner">
                        <Wand2 className="w-12 h-12" />
                     </div>
                     <div>
                       <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Tudo pronto!</h2>
                       <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
                         Revisamos todas as suas escolhas. Clique no botão abaixo para iniciar a renderização turbinada por IA.
                       </p>
                     </div>
                     <button 
                       onClick={handleGenerate}
                       className="bg-indigo-600 hover:bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 active:translate-y-0"
                     >
                       <Wand2 className="w-6 h-6" />
                       GERAR VÍDEO IA
                     </button>
                  </div>
                )}

              </div>

              {/* Navigation Footer */}
              <div className="pt-6 mt-auto border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors ${currentStep === 0 ? 'text-transparent cursor-default' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Voltar
                </button>
                {currentStep < 6 && (
                  <button 
                    onClick={handleNext}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    Avançar
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full bg-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center text-white"
            >
               <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mb-6" />
               <h2 className="text-2xl font-bold mb-2">Processando Animação...</h2>
               <p className="text-slate-400 mb-8 max-w-sm text-center">Nossos motores de IA estão sincronizando fala, expressões e movimentos.</p>
               
               <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-indigo-500"
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 4, ease: "linear" }}
                 />
               </div>
            </motion.div>
          )}

          {generationComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center"
            >
               {aiResult && aiResult.audioBase64 && (
                 <audio ref={audioRef} src={`data:audio/mp3;base64,${aiResult.audioBase64}`} />
               )}
               
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10" />
               </div>
               <h2 className="text-3xl font-black text-slate-800 mb-2">{aiResult?.title || "Vídeo Gerado com Sucesso!"}</h2>
               <p className="text-slate-500 mb-8">{aiResult ? "Roteiro, voz e movimentos gerados por IA." : "Seu mascote agora é um vendedor virtual."}</p>

               <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mb-8 items-center md:items-start justify-center">
                 {/* Video Simulator */}
                 <div className="w-[300px] h-[533px] bg-slate-100 rounded-2xl overflow-hidden relative shadow-lg border border-slate-200 group shrink-0">
                    <img src={MOCK_BACKGROUNDS.find(b => b.id === draft.backgroundId)?.imageUrl || MOCK_BACKGROUNDS[0].imageUrl} className="w-full h-full object-cover transition-transform duration-1000" style={{ transform: isPlaying ? 'scale(1.05)' : 'scale(1)' }} />
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-8">
                       <img src={MOCK_CHARACTERS.find(c => c.id === draft.characterId)?.imageUrl || MOCK_CHARACTERS[0].imageUrl} className={`w-48 h-48 object-contain mix-blend-screen transition-transform duration-500 ${isPlaying ? 'scale-110' : 'scale-100'}`} />
                    </div>

                    {/* Subtitles Overlay */}
                    {aiResult?.scenes && (
                      <div className="absolute bottom-8 inset-x-4 max-h-24 overflow-hidden pointer-events-none text-center">
                        <span className="bg-black/60 text-white font-bold px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm block shadow-sm border border-white/10 uppercase" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                          {aiResult.scenes[currentSceneIdx]?.textFragment || "..."}
                        </span>
                      </div>
                    )}

                    <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                      <button onClick={handlePlayPause} className="w-16 h-16 bg-white/90 text-indigo-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-sm">
                        <Play className="w-8 h-8 ml-1" />
                      </button>
                    </div>
                 </div>

                 {/* Script & Scenes Detail */}
                 {aiResult?.scenes && (
                   <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left overflow-y-auto max-h-[533px]">
                     <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                       Timeline do Diretor ({aiResult.scenes.length} Cenas)
                     </h3>
                     <div className="space-y-4">
                       {aiResult.scenes.map((scene: any, idx: number) => (
                         <div key={idx} className={`p-4 border rounded-xl transition-all ${idx === currentSceneIdx && isPlaying ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white'}`}>
                           <p className="text-xs font-bold text-slate-400 mb-1">CENA {scene.id}</p>
                           <p className="text-slate-700 text-sm font-semibold mb-2">"{scene.textFragment}"</p>
                           <p className="text-xs text-indigo-600 font-bold bg-indigo-100 px-2 py-1 rounded w-max">Ação: {scene.behavior}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               <div className="flex gap-4">
                 <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
                   <Download className="w-5 h-5" />
                   Baixar MP4
                 </button>
                 <button 
                   onClick={() => onNavigate('dashboard')}
                   className="bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 px-8 py-3.5 rounded-xl font-bold transition-all"
                 >
                   Voltar ao Início
                 </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
