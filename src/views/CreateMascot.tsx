import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, CheckCircle2, User, Camera, Mic, BrainCircuit, Activity, Save, Play, Image as ImageIcon, X, Pause, Square, Loader2, Wand2 } from 'lucide-react';
import { Character } from '../types';

const formatTime = (time: number) => {
  if (isNaN(time)) return "00:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

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

const VOICES = [
  { id: 'Masculina Padrão', desc: 'Voz natural e equilibrada para diversas situações.' },
  { id: 'Masculina Nordestina', desc: 'Tom amigável e regional, ideal para comércio local e propaganda de lojas.' },
  { id: 'Masculina Corporativa', desc: 'Tom sério e formal para apresentações institucionais.' },
  { id: 'Feminina Padrão', desc: 'Voz suave e versátil para narrações do dia a dia.' },
  { id: 'Feminina Corporativa', desc: 'Confiança e clareza para vídeos de negócios.' },
  { id: 'Narrador Publicitário', desc: 'Voz marcante e energética para ofertas e promoções.' },
  { id: 'Jovem Masculina', desc: 'Tom descontraído, ótimo para redes sociais e público jovem.' },
  { id: 'Jovem Feminina', desc: 'Animada e espontânea para conteúdos modernos.' },
];

export function CreateMascot({ onFinish, onCancel }: CreateMascotProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mainImage, setMainImage] = useState<{ url: string, name: string } | null>(null);
  const [visualPrompt, setVisualPrompt] = useState("");
  const [isGeneratingAppearance, setIsGeneratingAppearance] = useState(false);
  const [appearanceGenerated, setAppearanceGenerated] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentLoadingVoice = useRef<string | null>(null);
  const audioCache = useRef<Record<string, string>>({});
  
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [testText, setTestText] = useState("");

  const [voiceSettings, setVoiceSettings] = useState({
    speed: 'Normal',
    pitch: 'Médio',
    emotion: 'Neutro'
  });

  const [draft, setDraft] = useState<Partial<Character>>({
    name: '',
    category: 'Mascote 3D',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ceb?auto=format&fit=crop&q=80&w=600&h=600', // default demo image
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMainImage({ url, name: file.name });
      setDraft(prev => ({ ...prev, imageUrl: url }));
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMainImage(null);
    setAppearanceGenerated(false);
    setDraft(prev => ({ ...prev, imageUrl: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ceb?auto=format&fit=crop&q=80&w=600&h=600' }));
  };

  const handleGenerateAppearance = () => {
    if (!mainImage && !visualPrompt.trim()) return;
    setIsGeneratingAppearance(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGeneratingAppearance(false);
      setAppearanceGenerated(true);
    }, 3000);
  };

  const handlePlayVoice = async (voiceId: string, customText?: string) => {
    if (playingVoice === voiceId && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (playingVoice === voiceId && !isPlaying && audioRef.current?.src) {
      audioRef.current?.play();
      setIsPlaying(true);
      return;
    }

    setPlayingVoice(voiceId);
    currentLoadingVoice.current = voiceId;
    setIsAudioLoading(true);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
       audioRef.current.pause();
       audioRef.current.removeAttribute('src');
    }

    const txt = customText || `Olá! Seja bem-vindo ao Gerador de Animações IA. Esta é uma demonstração da voz ${voiceId}.`;
    const cacheKey = `${txt}|${voiceId}`;

    try {
      let base64 = audioCache.current[cacheKey];
      if (!base64) {
        const res = await fetch('/api/tts', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ text: txt, voiceName: voiceId })
        });
        const data = await res.json();
        if (data.audioBase64) {
           base64 = data.audioBase64;
           audioCache.current[cacheKey] = base64;
        }
      }

      if (currentLoadingVoice.current === voiceId) {
         if (base64 && audioRef.current) {
            audioRef.current.src = `data:audio/mp3;base64,${base64}`;
            audioRef.current.play();
            setIsPlaying(true);
         }
      }
    } catch (e) {
      console.error("Audio error", e);
    } finally {
      if (currentLoadingVoice.current === voiceId) {
         setIsAudioLoading(false);
      }
    }
  };

  const handleStopVoice = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (audioRef.current) {
       audioRef.current.pause();
       audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setPlayingVoice(null);
  };

  const handleTestCustomText = async () => {
     if (!testText.trim() || !draft.defaultVoice) return;
     handlePlayVoice(draft.defaultVoice, testText);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen overflow-hidden flex flex-col pt-12 p-8">
       <audio 
         ref={audioRef}
         onTimeUpdate={(e) => setAudioCurrentTime(e.currentTarget.currentTime)}
         onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
         onEnded={() => setIsPlaying(false)}
       />
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
                               <option>Mascote 2D</option>
                               <option>Animal 3D</option>
                               <option>Robô 3D</option>
                               <option>Objeto Animado</option>
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
                           <p className="text-slate-500">Envie uma imagem de referência ou descreva o mascote. A IA cuidará do resto.</p>
                           
                           <input 
                             type="file" 
                             ref={fileInputRef} 
                             onChange={handleFileChange} 
                             accept="image/png, image/jpeg, image/jpg, image/webp" 
                             className="hidden" 
                           />

                           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Imagem Principal (Opcional)</label>
                                <div 
                                  onClick={handleImageClick}
                                  className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer w-full h-48 relative overflow-hidden group ${mainImage ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-white'}`}
                                >
                                  {mainImage ? (
                                    <>
                                      <img src={mainImage.url} alt="Referência" className="absolute inset-0 w-full h-full object-contain opacity-90 p-2" />
                                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                                         <ImageIcon className="w-8 h-8 mb-2" />
                                         <span className="text-sm font-bold text-center">Substituir Imagem</span>
                                         <span className="text-xs text-white/80 max-w-full truncate px-2">{mainImage.name}</span>
                                      </div>
                                      <button 
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full z-10 transition-colors shadow-sm"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <Camera className="w-10 h-10 text-slate-400 mb-3 group-hover:text-indigo-500 transition-colors" />
                                      <span className="text-base font-bold text-slate-600 group-hover:text-indigo-600">Fazer upload de referência</span>
                                      <span className="text-sm text-slate-400 mt-1">PNG, JPG ou WEBP</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Descrição Visual (Opcional)</label>
                                <textarea 
                                  value={visualPrompt}
                                  onChange={(e) => setVisualPrompt(e.target.value)}
                                  placeholder="Ex: Peixe construtor amigável usando capacete amarelo e camisa vermelha."
                                  rows={3}
                                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
                                />
                              </div>

                              <button
                                onClick={handleGenerateAppearance}
                                disabled={(!mainImage && !visualPrompt.trim()) || isGeneratingAppearance}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-indigo-200"
                              >
                                {isGeneratingAppearance ? (
                                  <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Gerando Mascote IA...
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="w-6 h-6" />
                                    Gerar Mascote IA
                                  </>
                                )}
                              </button>
                           </div>

                           {appearanceGenerated && (
                             <motion.div 
                               initial={{ opacity: 0, y: 20 }}
                               animate={{ opacity: 1, y: 0 }}
                               className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-6"
                             >
                                <div className="flex items-center gap-2 mb-4 text-indigo-700">
                                   <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                   <h4 className="font-bold">Mascote gerado com sucesso!</h4>
                                </div>
                                <p className="text-sm text-slate-600 font-medium mb-4">A IA processou sua referência e gerou automaticamente todos os ângulos e expressões necessários para animação.</p>
                                
                                <div className="grid grid-cols-4 gap-3">
                                   {['Frente', 'Perfil', 'Costas', 'Feliz', 'Acenando', 'Pensativo', 'Surpreso', 'Falando'].map((view, i) => (
                                      <div key={view} className="relative aspect-square rounded-xl bg-white border border-indigo-100 overflow-hidden shadow-sm flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity">
                                         <div className="absolute inset-0 bg-indigo-50/50 flex items-center justify-center text-indigo-300">
                                            {/* Imagem placeholder que daria a ideia do angulo gerado */}
                                            <ImageIcon className="w-6 h-6 opacity-50 mb-4" />
                                         </div>
                                         <span className="relative z-10 block w-full bg-white/80 backdrop-blur-sm pt-4 pb-2 text-[10px] font-bold text-indigo-900 mt-auto uppercase tracking-wider">{view}</span>
                                      </div>
                                   ))}
                                </div>
                             </motion.div>
                           )}
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6">
                           <h3 className="text-2xl font-bold text-slate-800">Assinatura de Voz</h3>
                           <p className="text-slate-500">Ouça os exemplos e escolha a voz que melhor representa seu mascote.</p>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 pb-4">
                             {VOICES.map(v => (
                               <div 
                                 key={v.id} 
                                 onClick={() => setDraft({...draft, defaultVoice: v.id})}
                                 className={`flex flex-col p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${draft.defaultVoice === v.id ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                               >
                                 {draft.defaultVoice === v.id && (
                                   <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                                      <CheckCircle2 className="w-3 h-3" /> Selecionada
                                   </div>
                                 )}
                                 
                                 <div className="flex items-start gap-4 mb-3">
                                   <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${draft.defaultVoice === v.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                      <Mic className="w-6 h-6" />
                                   </div>
                                   <div className="flex-1 pr-16">
                                     <h4 className={`font-bold ${draft.defaultVoice === v.id ? 'text-indigo-900' : 'text-slate-800'}`}>{v.id}</h4>
                                     <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-2">{v.desc}</p>
                                   </div>
                                 </div>
                                 
                                 {playingVoice === v.id ? (
                                    <div className="mt-auto bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                                       <div className="flex items-center gap-2">
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); handlePlayVoice(v.id); }}
                                            className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition"
                                          >
                                            {isAudioLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                          </button>
                                          <button 
                                            onClick={handleStopVoice}
                                            className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition"
                                          >
                                            <Square className="w-3.5 h-3.5 fill-current" />
                                          </button>
                                          
                                          <div className="flex-1 text-right text-xs font-bold text-indigo-900">
                                            {formatTime(audioCurrentTime)} / {formatTime(audioDuration || 0)}
                                          </div>
                                       </div>
                                       
                                       <div className="h-1.5 w-full bg-indigo-200 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-indigo-600 transition-all duration-200 ease-linear" 
                                            style={{ width: `${audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0}%` }}
                                          ></div>
                                       </div>
                                    </div>
                                 ) : (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handlePlayVoice(v.id); }}
                                      className="mt-auto flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                    >
                                      <Play className="w-4 h-4 ml-1" /> Ouvir Amostra
                                    </button>
                                 )}
                               </div>
                             ))}
                           </div>

                           <div className="pt-6 border-t border-slate-100 mt-6">
                              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Teste de Voz Personalizada</h4>
                              
                              <div className="flex gap-2">
                                 <input 
                                   type="text" 
                                   placeholder="Digite um texto para testar (Ex: Olá! Eu sou o mascote da sua empresa...)" 
                                   value={testText}
                                   onChange={(e) => setTestText(e.target.value)}
                                   className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                 />
                                 <button 
                                   onClick={handleTestCustomText}
                                   disabled={!testText.trim() || !draft.defaultVoice || isAudioLoading}
                                   className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
                                 >
                                    {isAudioLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                                    Gerar Teste
                                 </button>
                              </div>
                           </div>

                           <div className="pt-6 border-t border-slate-100 mt-6">
                              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Controles Avançados</h4>
                              
                              <div className="grid grid-cols-3 gap-6">
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-2">Velocidade</label>
                                  <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                                    value={voiceSettings.speed}
                                    onChange={(e) => setVoiceSettings({ ...voiceSettings, speed: e.target.value })}
                                  >
                                    <option>Lenta</option>
                                    <option>Normal</option>
                                    <option>Rápida</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-2">Tom</label>
                                  <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                                    value={voiceSettings.pitch}
                                    onChange={(e) => setVoiceSettings({ ...voiceSettings, pitch: e.target.value })}
                                  >
                                    <option>Grave</option>
                                    <option>Médio</option>
                                    <option>Agudo</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-2">Emoção</label>
                                  <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                                    value={voiceSettings.emotion}
                                    onChange={(e) => setVoiceSettings({ ...voiceSettings, emotion: e.target.value })}
                                  >
                                    <option>Neutro</option>
                                    <option>Animado</option>
                                    <option>Empolgado</option>
                                    <option>Profissional</option>
                                    <option>Vendedor</option>
                                    <option>Institucional</option>
                                  </select>
                                </div>
                              </div>
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
                  <button onClick={handleNext} disabled={(!draft.name && currentStep === 0) || (!appearanceGenerated && currentStep === 1)} className="bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
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
