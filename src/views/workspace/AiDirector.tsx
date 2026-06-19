import { useState, useRef, useEffect } from 'react';
import { Play, Loader2, Sparkles, LayoutTemplate, CheckCircle2 } from 'lucide-react';
import { Character, WorkspaceView, DraftVideo } from '../../types';
import { MOCK_BACKGROUNDS } from '../../data';

interface AiDirectorProps {
  activeCharacter: Character;
  store: any;
  onNavigate: (view: WorkspaceView) => void;
}

export function AiDirector({ activeCharacter, store, onNavigate }: AiDirectorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [error, setError] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setAiResult(null);
    setError('');

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          characterData: activeCharacter,
          backgroundData: MOCK_BACKGROUNDS[0]
        })
      });

      const json = await response.json();
      if (json.success) {
        setAiResult(json.data);
        if (store?.addHistory) {
           store.addHistory({
             id: 'vid_' + Date.now(),
             title: json.data.title || 'Vídeo Gerado',
             characterId: activeCharacter.id,
             backgroundId: MOCK_BACKGROUNDS[0].id,
             script: json.data.fullScript || prompt,
             voice: activeCharacter.defaultVoice || 'Padrão',
             format: 'reels',
             thumbnailUrl: MOCK_BACKGROUNDS[0].imageUrl,
             createdAt: new Date().toISOString(),
             status: 'completed',
           });
        }
      } else {
        setError('Erro ao gerar: ' + json.error);
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão ao gerar o vídeo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current && aiResult?.audioBase64) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        if (currentSceneIdx >= (aiResult?.scenes?.length || 1) - 1 && audioRef.current.ended) {
           setCurrentSceneIdx(0);
           audioRef.current.currentTime = 0;
           audioRef.current.play();
        }
      }
      setIsPlaying(!isPlaying);
    } else {
       setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && aiResult?.scenes) {
      interval = setInterval(() => {
         setCurrentSceneIdx((prev) => {
           if (prev < aiResult.scenes.length - 1) return prev + 1;
           return prev; 
         });
      }, 3000); 
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

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 h-full flex flex-col">
      <div className="shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <Sparkles className="absolute top-4 right-8 w-32 h-32 text-white/10" />
        <h1 className="text-3xl font-black mb-2">IA Diretora</h1>
        <p className="text-indigo-100 mb-6 text-lg">O que você deseja anunciar utilizando {activeCharacter.name}?</p>
        
        <div className="flex bg-white/10 rounded-2xl p-2 backdrop-blur-md border border-white/20 gap-2">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="Ex: Promoção de cimento CP-II, entrega grátis hoje..."
            className="flex-1 bg-transparent border-none text-white placeholder:text-indigo-200 px-4 focus:outline-none"
            onKeyDown={(e) => {
               if (e.key === 'Enter') handleGenerate();
            }}
          />
          <button 
            disabled={isGenerating || !prompt.trim()}
            onClick={handleGenerate}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Gerar Completo
          </button>
        </div>
        {error && <p className="text-red-300 mt-3 font-semibold">{error}</p>}
      </div>

      <div className="flex-1 min-h-0 bg-slate-50 relative">
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-3xl border border-slate-200">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-lg font-bold text-slate-700">A IA está criando seu vídeo...</p>
            <p className="text-slate-500">Escrevendo roteiro, gerando voz em pt-BR e sincronizando cenas.</p>
          </div>
        )}

        {aiResult && (
          <div className="h-full flex gap-8">
            {/* Visual Studio Simulator */}
            <div className="w-[300px] bg-slate-100 rounded-3xl overflow-hidden relative shadow-lg border border-slate-200 group shrink-0 self-center">
              <img src={MOCK_BACKGROUNDS[0].imageUrl} className="w-full h-full object-cover transition-transform duration-1000" style={{ transform: isPlaying ? 'scale(1.05)' : 'scale(1)' }} />
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-8">
                 <img src={activeCharacter.imageUrl} className={`w-48 h-48 object-contain mix-blend-screen transition-transform duration-500 ${isPlaying ? 'scale-110' : 'scale-100'}`} />
              </div>

              {aiResult.audioBase64 && <audio ref={audioRef} src={`data:audio/mp3;base64,${aiResult.audioBase64}`} />}

              {aiResult.scenes && (
                <div className="absolute bottom-6 inset-x-4 max-h-24 overflow-hidden pointer-events-none text-center">
                  <span className="bg-black/60 text-white font-bold px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm block shadow-sm border border-white/10" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
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

            {/* Script & Scenes Details */}
             <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-8 overflow-y-auto shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-slate-800">{aiResult.title || 'Vídeo Gerado'}</h2>
                   <p className="text-slate-500 font-medium">Exportar para Instagram ou TikTok.</p>
                 </div>
               </div>

               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 mt-8">
                 <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                 Timeline da Cena (Estrutura do Vídeo)
               </h3>
               <div className="space-y-4">
                 {aiResult.scenes?.map((scene: any, idx: number) => (
                   <div key={idx} className={`p-4 border rounded-xl transition-all ${idx === currentSceneIdx && isPlaying ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-slate-50'}`}>
                     <div className="flex justify-between mb-2">
                       <p className="text-xs font-bold text-slate-400">CENA {scene.id}</p>
                       <p className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                          Movimento: {scene.behavior}
                       </p>
                     </div>
                     <p className="text-slate-800 font-semibold">"{scene.textFragment}"</p>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
