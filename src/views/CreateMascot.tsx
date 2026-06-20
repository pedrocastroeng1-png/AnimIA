import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, Camera, Image as ImageIcon, X, CheckCircle2, RotateCcw, Edit3, ArrowRight, BrainCircuit, Sparkles, Play, Loader2 } from 'lucide-react';
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

const SimulatedMascot = ({ expression, isSpeaking, baseColor = "#4f46e5", name, category, emoji, referenceUrl }: any) => {
  // Define states
  let leftArm = "M 30,60 L 15,80"; 
  let rightArm = "M 70,60 L 85,80";
  let eyes = <><circle cx="35" cy="45" r="4" fill="#1e293b" /><circle cx="65" cy="45" r="4" fill="#1e293b" /></>;
  let mouth = <path d="M 40,60 Q 50,65 60,60" fill="transparent" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
  let bodyTransform = "translate(0, 0)";
  
  if (expression === 'feliz') {
     mouth = <path d="M 35,55 Q 50,75 65,55" fill="transparent" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />;
     leftArm = "M 30,60 Q 20,70 15,60";
     rightArm = "M 70,60 Q 80,70 85,60";
  } else if (expression === 'acenando') {
     rightArm = "M 70,55 Q 85,30 95,20"; // Up and curved
     mouth = <path d="M 40,60 Q 50,70 60,60" fill="transparent" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
  } else if (expression === 'falando') {
     mouth = isSpeaking 
       ? <ellipse cx="50" cy="65" rx="6" ry="10" fill="#1e293b" />
       : <path d="M 40,60 Q 50,65 60,60" fill="transparent" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
     leftArm = isSpeaking ? "M 30,55 Q 15,45 10,40" : "M 30,60 L 15,80";
  } else if (expression === 'comemorando') {
     leftArm = "M 30,50 Q 15,20 10,15";
     rightArm = "M 70,50 Q 85,20 90,15";
     mouth = <path d="M 35,55 Q 50,80 65,55 Z" fill="#1e293b" />; // Open smile
     eyes = <><path d="M 30,45 Q 35,40 40,45" fill="transparent" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" /><path d="M 60,45 Q 65,40 70,45" fill="transparent" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" /></>; // Happy eyes
     bodyTransform = "translate(0, -10)";
  } else if (expression === 'apontando') {
     rightArm = "M 70,60 L 98,60";
     bodyTransform = "translate(-5, 0) rotate(-5 50 50)"; // Leaning slightly
  } else if (expression === 'pensativo') {
     rightArm = "M 70,60 Q 60,75 50,68"; // Hand to chin
     eyes = <><circle cx="35" cy="45" r="4" fill="#1e293b" /><line x1="30" y1="38" x2="40" y2="40" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" /><circle cx="65" cy="45" r="4" fill="#1e293b" /><line x1="60" y1="40" x2="70" y2="38" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" /></>; // Eyebrows down
     mouth = <line x1="45" y1="65" x2="55" y2="65" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
  } else if (expression === 'surpreso') {
     eyes = <><circle cx="35" cy="43" r="5" fill="#1e293b" /><circle cx="65" cy="43" r="5" fill="#1e293b" /></>; // Big eyes
     mouth = <circle cx="50" cy="65" r="5" fill="#1e293b" />; // O shape
     leftArm = "M 30,60 Q 20,40 25,35";
     rightArm = "M 70,60 Q 80,40 75,35";
  }

  // Generate some CSS keyframes string
  const breathingAnim = isSpeaking ? "speakBounce 0.3s infinite alternate" : "breathe 1.5s infinite alternate ease-in-out";

  return (
    <div className="aspect-square bg-slate-100/50 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-inner relative flex items-center justify-center">
      <style>{`
        @keyframes breathe {
          from { transform: translateY(0px); }
          to { transform: translateY(5px); }
        }
        @keyframes speakBounce {
          from { transform: translateY(0px) scale(1); }
          to { transform: translateY(3px) scale(1.02); }
        }
      `}</style>

      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/40 to-transparent"></div>

      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-xl text-[10px] font-black text-indigo-700 backdrop-blur shadow-sm z-20 flex items-center gap-1.5 border border-indigo-100">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
        RIG 3D SIMULADO
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl max-w-[280px]" style={{ overflow: 'visible' }}>
          <g style={{ animation: breathingAnim, transformOrigin: '50% 50%' }}>
            <g transform={bodyTransform} style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {/* Arms */}
              <path d={leftArm} stroke={baseColor} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
              <path d={rightArm} stroke={baseColor} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
              
              {/* Body */}
              <rect x="20" y="20" width="60" height="65" rx="25" fill={baseColor} />
              {/* Inner face area */}
              <rect x="25" y="25" width="50" height="55" rx="20" fill="#ffffff" />

              {/* Face Container */}
              <g style={{ transition: 'all 0.3s ease' }}>
                {eyes}
                {mouth}
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-6 pt-12 z-20">
         <h3 className="text-2xl font-black text-white drop-shadow-lg">{name || 'Mascote'}</h3>
         <p className="text-white/90 font-medium text-sm flex items-center gap-2 drop-shadow-lg">
           {category}
         </p>
      </div>

      {referenceUrl && (
        <div className="absolute bottom-6 right-6 w-16 h-16 rounded-xl border-2 border-white shadow-xl overflow-hidden bg-white z-20" title="Imagem Base">
          <img src={referenceUrl} alt="Ref" className="w-full h-full object-cover" />
        </div>
      )}
      
      {!referenceUrl && (
         <motion.div
           key={`emoji-${expression}`}
           initial={{ opacity: 0, scale: 0 }}
           animate={{ opacity: 1, scale: 1 }}
           className="absolute bottom-6 right-6 bg-white shadow-xl rounded-full w-14 h-14 flex items-center justify-center text-3xl border border-slate-200 z-20"
         >
           {emoji}
         </motion.div>
      )}
    </div>
  );
}

export function CreateMascot({ onFinish, onCancel }: CreateMascotProps) {
  const [step, setStep] = useState<Step>('input');
  const [activeExpression, setActiveExpression] = useState('feliz');
  
  // Audio Simulator State
  const [speakText, setSpeakText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

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
    colors: string;
  } | null>(null);

  // Character Profile State
  const [catchphrase, setCatchphrase] = useState("Deixa comigo, pode confiar!");
  const [profession, setProfession] = useState("Vendedor / Especialista");
  const [voiceTone, setVoiceTone] = useState("Animado e Convincente");
  const [traits, setTraits] = useState([
    { name: 'Vendedor', value: 70 },
    { name: 'Amigável', value: 20 },
    { name: 'Engraçado', value: 10 },
  ]);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'mascot', text: string}[]>([]);

  // Sequence Testing
  const [isTestingSequence, setIsTestingSequence] = useState(false);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    
    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput("");
    setIsSpeaking(true);
    setActiveExpression('pensativo');
    
    // Simulate AI response
    setTimeout(() => {
      setActiveExpression('falando');
      let responseText = `Olá! Como um autêntico mascote da nossa marca, estou sempre pronto para interagir. ${catchphrase}`;
      if (userText.toLowerCase().includes("quem é você")) {
        responseText = `Eu sou ${name || 'seu mascote'}, focado em ser ${profession}! ${catchphrase}`;
      }
      setChatMessages(prev => [...prev, { role: 'mascot', text: responseText }]);
      setTimeout(() => {
        setIsSpeaking(false);
        setActiveExpression('feliz');
      }, 3000);
    }, 1500);
  };

  const handleTestSequence = () => {
    if (isTestingSequence) return;
    setIsTestingSequence(true);
    const seq = ['feliz', 'acenando', 'falando', 'apontando', 'comemorando'];
    let i = 0;
    
    const runStep = () => {
      if (i >= seq.length) {
        setIsTestingSequence(false);
        setActiveExpression('feliz');
        return;
      }
      setActiveExpression(seq[i]);
      i++;
      setTimeout(runStep, 1500);
    };
    runStep();
  };

  const handlePresentation = () => {
    setActiveExpression('falando');
    setSpeakText(`Olá! Eu sou ${name || 'o mascote'}, sou ${profession} e estou pronto para ajudar nossa marca. ${catchphrase}`);
    handleTestFala();
  };

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

  const handleTestFala = () => {
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 3000); // simulate 3 sec audio
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
      description: `${description}\n\nProfissão: ${profession}\nBordão: "${catchphrase}"`,
      defaultVoice: voiceTone || 'Masculina Padrão',
      personality: traits.map(t => `${t.name}: ${t.value}%`).join(', '),
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
                    <SimulatedMascot 
                      expression={activeExpression} 
                      isSpeaking={isSpeaking} 
                      name={name} 
                      category={generatedData?.category || 'Mascote'} 
                      emoji={EXPRESSIONS.find(e => e.id === activeExpression)?.emoji} 
                      referenceUrl={mainImage?.url}
                    />

                    <div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Expressões Geradas</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {EXPRESSIONS.map((exp, i) => {
                           const isActive = activeExpression === exp.id;
                           return (
                             <button 
                               key={exp.id} 
                               onClick={() => setActiveExpression(exp.id)}
                               className={`relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all group overflow-hidden ${
                                 isActive 
                                   ? 'bg-indigo-50 border-2 border-indigo-500 shadow-sm' 
                                   : 'bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-md hover:border-indigo-300'
                               }`}
                             >
                               {isActive && (
                                 <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                                   SELECIONADA
                                 </div>
                               )}
                               <span className={`text-2xl mb-1 transition-transform ${isActive ? 'scale-125' : 'group-hover:scale-110'}`}>{exp.emoji}</span>
                               <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-indigo-700' : 'text-slate-500'}`}>{exp.label}</span>
                             </button>
                           );
                        })}
                      </div>

                      {activeExpression === 'falando' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl overflow-hidden mt-4"
                        >
                           <h4 className="text-sm font-bold text-slate-800 mb-3 hover:text-indigo-700">Teste de Voz e Animação</h4>
                           <input 
                             type="text" 
                             value={speakText}
                             onChange={(e) => setSpeakText(e.target.value)}
                             placeholder="Ex: Olá! Eu sou seu novo mascote virtual." 
                             className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 mb-3 placeholder:font-medium placeholder:text-slate-400"
                           />
                           <button 
                             onClick={handleTestFala}
                             disabled={isSpeaking}
                             className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                           >
                              {isSpeaking ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                                  Teste em andamento...
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 fill-current text-white" />
                                  Testar Fala
                                </>
                              )}
                           </button>
                        </motion.div>
                      )}
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
                         Perfil do Personagem
                      </h3>

                      <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nome Oficial</p>
                            <p className="text-lg font-black text-slate-800">{name}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Categoria</p>
                            <p className="text-sm font-bold text-indigo-700 bg-indigo-50 inline-block px-3 py-1 rounded-lg">{generatedData?.category}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Estilo Visual</p>
                            <p className="text-sm font-bold text-slate-700">{generatedData?.style}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Profissão</p>
                            <input type="text" value={profession} onChange={e => setProfession(e.target.value)} className="bg-white border border-slate-200 px-2 py-1 rounded-md text-sm font-bold w-full" />
                          </div>
                        </div>

                        <div>
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tom de Voz</p>
                           <input type="text" value={voiceTone} onChange={e => setVoiceTone(e.target.value)} className="bg-white border border-slate-200 px-2 py-1 rounded-md text-sm font-bold w-full" />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Personalidade</p>
                          <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-200">
                             {traits.map((t, idx) => (
                               <div key={t.name} className="flex items-center gap-3">
                                 <span className="w-24 text-xs font-bold text-slate-600 truncate">{t.name}</span>
                                 <input 
                                   type="range" 
                                   min="0" max="100" 
                                   value={t.value} 
                                   onChange={(e) => {
                                     const newTraits = [...traits];
                                     newTraits[idx].value = parseInt(e.target.value, 10);
                                     setTraits(newTraits);
                                   }}
                                   className="flex-1 accent-indigo-600" 
                                 />
                                 <span className="w-10 text-right text-xs font-bold text-indigo-600">{t.value}%</span>
                               </div>
                             ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bordão do Mascote</p>
                          <input 
                            type="text" 
                            value={catchphrase}
                            onChange={(e) => setCatchphrase(e.target.value)}
                            placeholder="Ex: Pode confiar!" 
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                       <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                          >
                            <BrainCircuit className="w-4 h-4" />
                            Conversar
                          </button>
                          <button 
                            onClick={handleTestSequence}
                            disabled={isTestingSequence}
                            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                          >
                            {isTestingSequence ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Testar Personagem
                          </button>
                       </div>
                       <button 
                          onClick={handlePresentation}
                          className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                          <Wand2 className="w-4 h-4" />
                          Apresentar Mascote
                        </button>
                    </div>

                    <AnimatePresence>
                      {isChatOpen && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm"
                        >
                          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                             <span className="text-xs font-bold text-slate-600 uppercase">Chat com {name}</span>
                             <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                          </div>
                          <div className="p-4 h-48 overflow-y-auto space-y-3 flex flex-col">
                            {chatMessages.length === 0 && <span className="text-xs font-medium text-slate-400 text-center my-auto">Envie uma mensagem para testar a personalidade de {name}.</span>}
                            {chatMessages.map((msg, i) => (
                              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`text-sm py-2 px-3 rounded-2xl max-w-[80%] font-medium ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-700 rounded-tl-sm'}`}>
                                  {msg.text}
                                </div>
                              </div>
                            ))}
                          </div>
                          <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
                             <input 
                               type="text" 
                               value={chatInput}
                               onChange={e => setChatInput(e.target.value)}
                               placeholder="Diga algo..." 
                               className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-indigo-400"
                             />
                             <button type="submit" disabled={!chatInput.trim()} className="bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 text-sm">
                               Enviar
                             </button>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      onClick={handleApprove}
                      className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Aprovar Personagem
                      <ArrowRight className="w-6 h-6" />
                    </button>
                    
                    <div className="mt-4 flex justify-center">
                       <button 
                         onClick={() => setStep('input')}
                         className="text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider flex items-center gap-1"
                       >
                         <RotateCcw className="w-3 h-3" /> refazer análise
                       </button>
                    </div>
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

