import { useState } from 'react';
import { Sparkles, Image, User, Layers, Video, FileText, Download, Settings, Zap, Star, Crown, Cpu, X, Dna } from 'lucide-react';
import { Character } from '../../types';
import { VIDEO_PROVIDERS, VOICE_PROVIDERS, ProviderTier } from '../../lib/providers';

interface SceneGeneratorProps {
  activeCharacter: Character;
  store: any;
}

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

export function SceneGenerator({ activeCharacter, store }: SceneGeneratorProps) {
  const [sceneDescription, setSceneDescription] = useState('Frente de loja de material de construção');
  const [selectedAction, setSelectedAction] = useState('acenar');
  const [directorNotes, setDirectorNotes] = useState('Animação alegre e chamativa, com a câmera se aproximando lentamente do personagem.');
  const [speechText, setSpeechText] = useState('Olá! Seja bem-vindo ao Armazém.');
  
  // Multi-Provider Settings
  const [generationMode, setGenerationMode] = useState<'simples' | 'avancado'>('simples');
  const [selectedTier, setSelectedTier] = useState<ProviderTier>('equilibrado');
  const [advancedProvider, setAdvancedProvider] = useState('veo');
  const [advancedVoiceProvider, setAdvancedVoiceProvider] = useState('elevenlabs');

  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  const [showDnaModal, setShowDnaModal] = useState(false);

  const bestProvider = generationMode === 'simples' 
    ? VIDEO_PROVIDERS.find(p => p.tier === selectedTier)?.name || 'Motor Inteligente'
    : VIDEO_PROVIDERS.find(p => p.id === advancedProvider)?.name || 'Motor Customizado';

  const bestVoiceProvider = generationMode === 'simples'
    ? VOICE_PROVIDERS.find(p => p.tier === selectedTier)?.name || 'Motor Inteligente'
    : VOICE_PROVIDERS.find(p => p.id === advancedVoiceProvider)?.name || 'Motor Customizado';

  // Fallbacks para o DNA
  const dna = {
    physicalDescription: activeCharacter.physicalDescription || "Aparência padrão baseada na referência visual.",
    facialDescription: activeCharacter.facialDescription || "Rosto expressivo e amigável.",
    clothing: activeCharacter.clothing || "Roupas características da sua profissão.",
    accessories: activeCharacter.accessories || "Acessórios de trabalho.",
    mainColors: activeCharacter.mainColors || "Cores vibrantes que combinam com a marca.",
    personality: activeCharacter.personality || "Carismático e proativo.",
    profession: activeCharacter.profession || "Apresentador da marca.",
    voiceTone: activeCharacter.voiceTone || activeCharacter.defaultVoice || "Voz clara e animada.",
    catchphrase: activeCharacter.catchphrase || "Sempre pronto para ajudar!"
  };

  const generatePrompt = () => {
    const actionLabel = ACTIONS.find(a => a.id === selectedAction)?.label || selectedAction;
    
    const prompt = `[PROMPT DE GERAÇÃO DE VÍDEO COMPLETO]
[MOTOR DE INFERÊNCIA VÍDEO: ${bestProvider.toUpperCase()}]
[MOTOR DE INFERÊNCIA VOZ: ${bestVoiceProvider.toUpperCase()}]

==== DNA DO MASCOTE (MANTER CONSISTÊNCIA) ====
Personagem: ${activeCharacter.name}
Categoria/Tipo: ${activeCharacter.category || 'Mascote 3D'}
Físico: ${dna.physicalDescription}
Rosto/Expressão base: ${dna.facialDescription}
Vestimenta: ${dna.clothing}
Acessórios: ${dna.accessories}
Cores Principais: ${dna.mainColors}
Personalidade: ${dna.personality}
Profissão/Papel: ${dna.profession}
Tom de Voz: ${dna.voiceTone}
Bordão: "${dna.catchphrase}"
Referência Visual: [Anexar a imagem base do mascote para consistência de identidade]

==== CENÁRIO (BACKGROUND) ====
Ambiente: ${sceneDescription}
Iluminação: Iluminação natural e agradável, estilo propaganda publicitária.

==== AÇÃO & DIREÇÃO DE CÂMERA ====
Comportamento principal: ${actionLabel}. 
Diretor de Cena: ${directorNotes}
Direção: O mascote executa o movimento de forma fluida, mantendo contato visual com o espectador (câmera). Estilo de animação expressiva e carismática de acordo com sua personalidade (${dna.personality}).

==== FALA & ÁUDIO (LIP-SYNC) ====
O mascote deve gesticular e articular os lábios em perfeita sincronia com a seguinte fala:
"${speechText}"

==== ESTÉTICA VISUAL ====
Estilo de Animação 3D moderno (estilo Pixar/Disney), renderização de alta qualidade (4K, Unreal Engine 5 render), texturas ricas, iluminação cinematográfica, cores vibrantes, foco no personagem.`;

    setGeneratedPrompt(prompt);
  };

  return (
    <div className="flex h-full flex-col lg:flex-row bg-slate-50">
      
      {/* Visual Canvas (Now displays the logic/prompt preview) */}
      <div className="flex-1 flex flex-col p-8 relative items-center justify-center border-r border-slate-200 overflow-y-auto">
         
         {!generatedPrompt ? (
           <div className="text-center space-y-6 max-w-lg">
             <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Video className="w-12 h-12" />
             </div>
             <h2 className="text-3xl font-black text-slate-800">Pipeline de Vídeo IA</h2>
             <p className="text-slate-500 text-lg">
               Configure a cena ao lado. O sistema irá empacotar o Mascote ({activeCharacter.name}), o Cenário, a Ação e a Fala em um Prompt Estruturado pronto para ferramentas de geração de vídeo.
             </p>
           </div>
         ) : (
           <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative mt-10 lg:mt-0">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
               <FileText className="w-5 h-5" />
               Prompt Estruturado Gerado
             </div>
             
             <div className="mt-4 bg-slate-900 text-slate-300 font-mono text-sm p-6 rounded-xl whitespace-pre-wrap leading-relaxed shadow-inner overflow-x-auto max-h-[60vh] overflow-y-auto custom-scrollbar">
               {generatedPrompt}
             </div>
             
             <div className="mt-6 flex justify-end gap-3">
               <button 
                 onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                 className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
               >
                 <Layers className="w-5 h-5" />
                 Copiar Prompt
               </button>
               <button 
                 className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md"
               >
                 <Download className="w-5 h-5" />
                 Enviar para API de Vídeo
               </button>
             </div>
           </div>
         )}
         
      </div>

      {/* Editor Panel */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col h-full overflow-y-auto shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-10">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-20 backdrop-blur-md">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Layers className="w-5 h-5 text-indigo-600" />
               Configurar Geração
            </h2>
         </div>

         <div className="p-6 space-y-8">
            
            {/* Character Info (Read Only here) */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 p-2 shrink-0">
                <img src={activeCharacter.imageUrl} alt={activeCharacter.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ator Principal</p>
                <h3 className="font-bold text-slate-800 text-lg">{activeCharacter.name}</h3>
                <p className="text-sm text-slate-500">{activeCharacter.category || "Mascote 3D"}</p>
              </div>
              <button 
                onClick={() => setShowDnaModal(true)}
                className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
                title="Ver DNA do Mascote"
              >
                <Dna className="w-5 h-5" />
              </button>
            </div>

            {/* Background Control */}
            <div>
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Image className="w-4 h-4" /> 1. Cenário
               </h3>
               <textarea 
                  rows={2} 
                  value={sceneDescription}
                  onChange={(e) => setSceneDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none" 
                  placeholder="Ex: Sala de estar moderna e iluminada..."
               />
            </div>

            {/* Action Control */}
            <div>
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> 2. Ação (Movimento)
               </h3>
               <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                 {ACTIONS.map(action => (
                   <button
                     key={action.id}
                     onClick={() => setSelectedAction(action.id)}
                     className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                       selectedAction === action.id 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                     }`}
                   >
                     <span className="text-lg">{action.emoji}</span>
                     {action.label}
                   </button>
                 ))}
               </div>
            </div>

            {/* Director Notes / Script Control */}
            <div>
               <div className="flex items-center justify-between mb-3">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4" /> 3. Campo de Roteiro
                 </h3>
                 <button 
                   onClick={() => {
                     setSceneDescription("Loja de materiais de construção cheia, iluminação solar diurna.");
                     setDirectorNotes("A câmera começa em close no mascote e afasta (dolly out) revelando o cenário enquanto ele acena de forma animada.");
                     setSpeechText("Olá, construtores! Confiram as super ofertas do Armazém preparadas especialmente para você!");
                   }}
                   className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 flex items-center gap-1 transition-colors"
                 >
                   <Sparkles className="w-3 h-3" /> IA Diretora
                 </button>
               </div>
               <textarea 
                  rows={2} 
                  value={directorNotes}
                  onChange={(e) => setDirectorNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none text-sm placeholder:text-slate-400" 
                  placeholder="Instruções de câmera, iluminação ou detalhes da animação..."
               />
            </div>

            {/* Speech Control */}
            <div>
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> 4. Campo de Fala
               </h3>
               <textarea 
                  rows={2} 
                  value={speechText}
                  onChange={(e) => setSpeechText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none text-sm placeholder:text-slate-400" 
                  placeholder="Escreva a fala do personagem para esta cena..."
               />
            </div>

            {/* Multi-Provider Settings */}
            <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200">
               <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <Cpu className="w-4 h-4 text-indigo-600" /> Motor de Geração
                  </div>
               </h3>
               
               {/* Mode Toggle */}
               <div className="flex bg-slate-200/50 p-1 rounded-xl mb-4">
                 <button
                   onClick={() => setGenerationMode('simples')}
                   className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${generationMode === 'simples' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   Modo Simples
                 </button>
                 <button
                   onClick={() => setGenerationMode('avancado')}
                   className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${generationMode === 'avancado' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   Modo Avançado
                 </button>
               </div>

               {generationMode === 'simples' ? (
                 <div className="grid grid-cols-3 gap-2">
                   <button 
                     onClick={() => setSelectedTier('rapido')}
                     className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${selectedTier === 'rapido' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'}`}
                   >
                     <Zap className={`w-5 h-5 mb-1 ${selectedTier === 'rapido' ? 'text-amber-500' : 'text-slate-400'}`} />
                     <span className="text-[10px] font-bold uppercase">Rápido</span>
                   </button>
                   <button 
                     onClick={() => setSelectedTier('equilibrado')}
                     className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${selectedTier === 'equilibrado' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'}`}
                   >
                     <Star className={`w-5 h-5 mb-1 ${selectedTier === 'equilibrado' ? 'text-blue-500' : 'text-slate-400'}`} />
                     <span className="text-[10px] font-bold uppercase">Equilibrado</span>
                   </button>
                   <button 
                     onClick={() => setSelectedTier('premium')}
                     className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${selectedTier === 'premium' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'}`}
                   >
                     <Crown className={`w-5 h-5 mb-1 ${selectedTier === 'premium' ? 'text-purple-500' : 'text-slate-400'}`} />
                     <span className="text-[10px] font-bold uppercase">Premium</span>
                   </button>
                 </div>
               ) : (
                 <div className="space-y-3">
                   <div>
                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Modelo de Vídeo</label>
                     <select 
                        value={advancedProvider}
                        onChange={(e) => setAdvancedProvider(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                     >
                        {VIDEO_PROVIDERS.map(provider => (
                          <option key={provider.id} value={provider.id}>{provider.name}</option>
                        ))}
                     </select>
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Modelo de Voz</label>
                     <select 
                        value={advancedVoiceProvider}
                        onChange={(e) => setAdvancedVoiceProvider(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                     >
                        {VOICE_PROVIDERS.map(provider => (
                          <option key={provider.id} value={provider.id}>{provider.name}</option>
                        ))}
                     </select>
                   </div>
                 </div>
               )}
            </div>

            <button 
              onClick={generatePrompt}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
            >
               <Sparkles className="w-5 h-5" />
               Preparar Prompt de Vídeo
            </button>
         </div>
      </div>

      {showDnaModal && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Dna className="w-5 h-5 text-indigo-600" /> DNA Persistente do Mascote
              </h2>
              <button 
                onClick={() => setShowDnaModal(false)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="bg-indigo-50 text-indigo-700 text-sm font-medium p-4 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Estes atributos são injetados automaticamente em todas as cenas geradas. Eles garantem que seu mascote seja consistente entre diferentes geradores de vídeo.</p>
              </div>

              <div className="space-y-4 text-sm font-medium">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">🎭 Personagem / Papel</span>
                  <p className="text-slate-800"><strong>{activeCharacter.name}</strong> • {activeCharacter.category || 'Mascote 3D'}</p>
                  <p className="text-slate-600">{dna.profession}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">👀 Físico e Expressão</span>
                  <p className="text-slate-800"><strong>Físico:</strong> {dna.physicalDescription}</p>
                  <p className="text-slate-800"><strong>Rosto:</strong> {dna.facialDescription}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">👕 Estilo</span>
                  <p className="text-slate-800"><strong>Roupa:</strong> {dna.clothing}</p>
                  <p className="text-slate-800"><strong>Cores:</strong> {dna.mainColors}</p>
                  <p className="text-slate-800"><strong>Acessórios:</strong> {dna.accessories}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">🧠 Identidade Psicológica</span>
                  <p className="text-slate-800"><strong>Personalidade:</strong> {dna.personality}</p>
                  <p className="text-slate-800"><strong>Tom de Voz:</strong> {dna.voiceTone}</p>
                  <p className="text-slate-800"><strong>Bordão:</strong> "{dna.catchphrase}"</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
