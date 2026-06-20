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

const ACTIONS = [
  { id: 'entrar', label: 'Entrar em cena', emoji: '🚶' },
  { id: 'sair', label: 'Sair de cena', emoji: '🏃' },
  { id: 'caminhar', label: 'Caminhar', emoji: '🚶‍♂️' },
  { id: 'acenar', label: 'Acenar', emoji: '👋' },
  { id: 'apontar', label: 'Apontar', emoji: '👉' },
  { id: 'produto', label: 'Mostrar produto', emoji: '📦' },
  { id: 'preco', label: 'Mostrar preço', emoji: '💲' },
  { id: 'whatsapp', label: 'Mostrar WhatsApp', emoji: '💬' },
  { id: 'apresentar', label: 'Apresentar empresa', emoji: '🏢' },
  { id: 'chamar', label: 'Chamar cliente', emoji: '🗣️' },
  { id: 'entrega', label: 'Fazer entrega', emoji: '🚚' },
  { id: 'entrar_veiculo', label: 'Entrar em veículo', emoji: '🚗' },
  { id: 'sair_veiculo', label: 'Sair de veículo', emoji: '🚪' },
];

const SimulatedMascot = ({ expression, action, isSpeaking, name, category, emoji, referenceUrl }: any) => {
  const imageUrl = referenceUrl || 'https://images.unsplash.com/photo-1579548122080-c35fd6820ceb?auto=format&fit=crop&q=80&w=600&h=600';
  
  // Decide how the mascot animates based on action OR expression
  const isActionState = !!action;
  
  const getScale = () => {
    if (isActionState) {
      if (action === 'entrar') return [0, 1.2, 1];
      if (action === 'sair') return [1, 1.2, 0];
      return 1;
    }
    return expression === 'surpreso' ? 1.15 : expression === 'comemorando' ? [1, 1.1, 1] : 1;
  };

  const getRotate = () => {
    if (isActionState) {
      if (action === 'caminhar') return [-5, 5, -5];
      if (action === 'acenar') return [-5, 5, -5];
      if (action === 'apontar') return -5;
      return 0;
    }
    return expression === 'acenando' ? [-5, 5, -5] : expression === 'pensativo' ? 3 : expression === 'apontando' ? -5 : 0;
  };

  const getY = () => {
    if (isActionState) {
      if (action === 'caminhar') return [0, -10, 0];
      if (action === 'entrar' || action === 'sair') return 0;
      return 0;
    }
    return expression === 'feliz' || expression === 'comemorando' ? [-10, 10, -10] : isSpeaking ? [-3, 3, -3] : 0;
  };

  const getX = () => {
    if (isActionState) {
      if (action === 'entrar') return [-200, 0];
      if (action === 'sair') return [0, 200];
      return 0;
    }
    return 0;
  };

  const getOpacity = () => {
    if (isActionState) {
      if (action === 'entrar') return [0, 1];
      if (action === 'sair') return [1, 0];
      return 1;
    }
    return 1;
  };

  const getTransition = () => {
    if (isActionState) {
      if (action === 'caminhar' || action === 'acenar') return { repeat: Infinity, duration: 0.6 };
      if (action === 'entrar' || action === 'sair') return { duration: 0.8, ease: "backOut" };
      return { duration: 0.5 };
    }
    return {
      repeat: expression === 'acenando' || expression === 'feliz' || expression === 'comemorando' || isSpeaking ? Infinity : 0,
      duration: expression === 'comemorando' ? 0.6 : isSpeaking ? 0.2 : 1.5,
      ease: "easeInOut"
    };
  };
  
  return (
    <div className="aspect-square bg-slate-100/50 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-inner relative flex items-center justify-center">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/40 to-transparent"></div>

      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-xl text-[10px] font-black text-indigo-700 backdrop-blur shadow-sm z-20 flex items-center gap-1.5 border border-indigo-100">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
        RIG. 2D SIMULADO (PROTÓTIPO)
      </div>
      
      {/* Base Mascot Image with Transforms */}
      <motion.div 
        key={`mascot-${isActionState ? action : expression}`}
        className="absolute inset-0 z-10 flex items-center justify-center"
        animate={{
          scale: getScale(),
          rotate: getRotate(),
          y: getY(),
          x: getX(),
          opacity: getOpacity(),
          filter: !isActionState ? (expression === 'pensativo' ? 'sepia(0.2) brightness(0.95)' : expression === 'feliz' ? 'saturate(1.2)' : 'sepia(0) brightness(1)') : 'sepia(0) brightness(1)'
        }}
        transition={getTransition()}
        style={{ transformOrigin: (!isActionState && expression === 'acenando') || (isActionState && action === 'acenar') ? 'bottom center' : 'center center' }}
      >
        <img src={imageUrl} alt="Mascote" className="w-full h-full object-contain drop-shadow-xl p-8" />
      </motion.div>

      {/* Visual Props / Overlays based on expression/action */}
      <AnimatePresence>
        {!isActionState && expression === 'falando' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.5 }}
             className="absolute md:top-1/4 md:right-1/4 top-10 right-10 z-20 bg-white p-4 rounded-3xl rounded-bl-sm shadow-xl font-bold text-slate-800 border-2 border-slate-200"
           >
             {isSpeaking ? (
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
             ) : (
               <div className="text-xl px-1">💬</div>
             )}
           </motion.div>
        )}

        {!isActionState && expression === 'pensativo' && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 10 }}
             className="absolute top-1/4 right-1/4 z-20 text-6xl drop-shadow-2xl"
           >
             <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
               🤔
             </motion.div>
           </motion.div>
        )}

        {!isActionState && expression === 'acenando' && (
           <motion.div 
             initial={{ opacity: 0, x: -20, rotate: -45 }}
             animate={{ opacity: 1, x: 0, rotate: 0 }}
             exit={{ opacity: 0, x: -20, rotate: -45 }}
             className="absolute bottom-1/4 left-8 z-20 text-7xl drop-shadow-2xl origin-bottom-right"
           >
             <motion.div
               animate={{ rotate: [0, 20, 0, 20, 0] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
             >
               👋
             </motion.div>
           </motion.div>
        )}

        {!isActionState && expression === 'comemorando' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0 }}
             className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden"
           >
             <div className="absolute top-10 left-10 text-5xl animate-bounce">🎉</div>
             <div className="absolute top-20 right-10 text-4xl animate-bounce" style={{ animationDelay: '200ms' }}>✨</div>
             <div className="absolute bottom-32 left-20 text-5xl animate-bounce" style={{ animationDelay: '400ms' }}>🎊</div>
             <div className="absolute bottom-20 right-20 text-6xl animate-bounce" style={{ animationDelay: '600ms' }}>🎈</div>
           </motion.div>
        )}

        {!isActionState && expression === 'apontando' && (
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="absolute md:top-1/2 right-12 z-20 text-7xl drop-shadow-2xl origin-left"
             style={{ y: '-50%' }}
           >
             <motion.div
               animate={{ x: [0, 15, 0] }}
               transition={{ repeat: Infinity, duration: 1 }}
             >
               👉
             </motion.div>
           </motion.div>
        )}

        {!isActionState && expression === 'surpreso' && (
           <motion.div 
             initial={{ opacity: 0, scale: 2 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0 }}
             className="absolute top-1/4 left-1/2 z-20 text-7xl drop-shadow-2xl -translate-x-1/2"
           >
             <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
               ❕
             </motion.div>
           </motion.div>
        )}

        {!isActionState && expression === 'feliz' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.5 }}
             className="absolute top-1/4 right-1/4 z-20 text-5xl drop-shadow-2xl"
           >
             <motion.div
               animate={{ scale: [1, 1.3, 1], rotate: [-15, 15, -15] }}
               transition={{ repeat: Infinity, duration: 2 }}
             >
               ✨
             </motion.div>
           </motion.div>
        )}

        {/* --- ACTION OVERLAYS --- */}
        {isActionState && action === 'produto' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.5, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.5 }}
             className="absolute bottom-1/4 right-8 z-20 text-7xl drop-shadow-2xl"
           >
             <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2 }}>📦</motion.div>
           </motion.div>
        )}

        {isActionState && action === 'preco' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.5, y: -20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.5 }}
             className="absolute top-1/4 right-12 z-20 text-7xl drop-shadow-2xl"
           >
             <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>💲</motion.div>
           </motion.div>
        )}

        {isActionState && action === 'whatsapp' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0 }}
             className="absolute top-1/4 left-12 z-20 text-7xl drop-shadow-xl"
           >
             <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 2 }}>💬</motion.div>
           </motion.div>
        )}

        {isActionState && action === 'apresentar' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0 }}
             className="absolute top-1/4 right-12 z-20 text-6xl drop-shadow-xl"
           >
             🏢
           </motion.div>
        )}

        {isActionState && action === 'chamar' && (
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="absolute md:top-1/2 left-8 z-20 text-6xl drop-shadow-2xl"
             style={{ y: '-50%' }}
           >
             <motion.div animate={{ x: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>🗣️</motion.div>
           </motion.div>
        )}

        {isActionState && action === 'entrega' && (
           <motion.div 
             initial={{ opacity: 0, x: -100 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 100 }}
             className="absolute bottom-6 left-6 z-20 text-7xl drop-shadow-2xl"
           >
             <motion.div animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>🚚</motion.div>
           </motion.div>
        )}

        {isActionState && action === 'entrar_veiculo' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.8 }}
             className="absolute top-1/3 left-6 z-20 text-7xl drop-shadow-2xl"
           >
             🚗
           </motion.div>
        )}

        {isActionState && action === 'sair_veiculo' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.8 }}
             className="absolute top-1/3 right-6 z-20 text-7xl drop-shadow-2xl"
           >
             🚪
           </motion.div>
        )}

        {isActionState && action === 'apontar' && (
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="absolute md:top-1/2 right-12 z-20 text-7xl drop-shadow-2xl origin-left"
             style={{ y: '-50%' }}
           >
             <motion.div
               animate={{ x: [0, 15, 0] }}
               transition={{ repeat: Infinity, duration: 1 }}
             >
               👉
             </motion.div>
           </motion.div>
        )}

        {isActionState && action === 'acenar' && (
           <motion.div 
             initial={{ opacity: 0, x: -20, rotate: -45 }}
             animate={{ opacity: 1, x: 0, rotate: 0 }}
             exit={{ opacity: 0, x: -20, rotate: -45 }}
             className="absolute bottom-1/4 left-8 z-20 text-7xl drop-shadow-2xl origin-bottom-right"
           >
             <motion.div
               animate={{ rotate: [0, 20, 0, 20, 0] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
             >
               👋
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent p-6 pt-16 z-20 pointer-events-none">
         <h3 className="text-2xl font-black text-white drop-shadow-lg">{name || 'Mascote'}</h3>
         <p className="text-white/90 font-bold text-sm tracking-wide uppercase drop-shadow-lg opacity-80 mt-1">
           {category}
         </p>
      </div>

    </div>
  );
}

export function CreateMascot({ onFinish, onCancel }: CreateMascotProps) {
  const [step, setStep] = useState<Step>('input');
  const [activeTab, setActiveTab] = useState<'expressoes' | 'acoes'>('expressoes');
  const [activeExpression, setActiveExpression] = useState('feliz');
  const [activeAction, setActiveAction] = useState<string | null>(null);
  
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
                      action={activeAction}
                      isSpeaking={isSpeaking} 
                      name={name} 
                      category={generatedData?.category || 'Mascote'} 
                      emoji={
                        activeTab === 'acoes' && activeAction 
                          ? ACTIONS.find(a => a.id === activeAction)?.emoji 
                          : EXPRESSIONS.find(e => e.id === activeExpression)?.emoji
                      } 
                      referenceUrl={mainImage?.url}
                    />

                    <div>
                      <div className="flex bg-slate-100 p-1.5 rounded-xl mb-4">
                        <button
                          onClick={() => {
                            setActiveTab('expressoes');
                            setActiveAction(null);
                          }}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'expressoes' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Expressões
                        </button>
                        <button
                          onClick={() => setActiveTab('acoes')}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'acoes' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Ações
                        </button>
                      </div>

                      {activeTab === 'expressoes' && (
                        <div className="grid grid-cols-4 gap-2">
                          {EXPRESSIONS.map((exp) => {
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
                      )}

                      {activeTab === 'acoes' && (
                        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[300px] pr-2">
                          {ACTIONS.map((action) => {
                             const isActive = activeAction === action.id;
                             return (
                               <button 
                                 key={action.id} 
                                 onClick={() => setActiveAction(action.id)}
                                 className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all group overflow-hidden ${
                                   isActive 
                                     ? 'bg-indigo-50 border-2 border-indigo-500 shadow-sm' 
                                     : 'bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-md hover:border-indigo-300'
                                 }`}
                               >
                                 {isActive && (
                                   <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                                     ATIVA
                                   </div>
                                 )}
                                 <span className={`text-2xl mb-2 transition-transform ${isActive ? 'scale-125' : 'group-hover:scale-110'}`}>{action.emoji}</span>
                                 <span className={`text-[10px] font-bold text-center leading-tight ${isActive ? 'text-indigo-700' : 'text-slate-500'}`}>{action.label}</span>
                               </button>
                             );
                          })}
                        </div>
                      )}

                      {activeTab === 'expressoes' && activeExpression === 'falando' && (
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

