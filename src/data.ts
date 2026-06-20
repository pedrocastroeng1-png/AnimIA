import { Background, Character, VideoHistory, Behavior, Scene, Template } from './types';

export const MOCK_BEHAVIORS: Behavior[] = [
  { id: 'b_1', name: 'Falar para câmera', icon: 'User', category: 'Comunicação' },
  { id: 'b_2', name: 'Acenar', icon: 'Hand', category: 'Interação' },
  { id: 'b_3', name: 'Caminhar', icon: 'Footprints', category: 'Movimento' },
  { id: 'b_4', name: 'Mostrar produto', icon: 'Package', category: 'Vendas' },
  { id: 'b_5', name: 'Apontar para o lado', icon: 'Navigation', category: 'Gestos' },
  { id: 'b_6', name: 'Comemorar', icon: 'PartyPopper', category: 'Emoções' },
  { id: 'b_7', name: 'Entrar na cena', icon: 'LogIn', category: 'Movimento' },
];

export const MOCK_SCENES: Scene[] = [
  { id: 's_1', name: 'Loja Promoção', backgroundId: 'bg_1', description: 'Cenário de loja preparado para promoções.' },
  { id: 's_2', name: 'Chegada de Material', backgroundId: 'bg_1', description: 'Para loja de construção ou depósitos.' },
  { id: 's_3', name: 'Mensagem Corporativa', backgroundId: 'bg_2', description: 'Para comunicados da empresa ou RH.' },
];

export const MOCK_TEMPLATES: Template[] = [
  { id: 't_1', name: 'Queima de Estoque', category: 'Varejo', description: 'Vídeo rápido anunciando desconto exclusivo.' },
  { id: 't_2', name: 'Novidade no WhatsApp', category: 'Redes Sociais', description: 'Convite para o cliente chamar no zap.' },
  { id: 't_3', name: 'Campanha de Aniversário', category: 'Comemoração', description: 'Agradecimento e brinde de aniversário da loja.' },
];

export const MOCK_CHARACTERS: Character[] = [];

export const MOCK_BACKGROUNDS: Background[] = [
  {
    id: 'bg_1',
    name: 'Loja de Varejo',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: 'bg_2',
    name: 'Escritório Moderno',
    category: 'Escritório',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: 'bg_3',
    name: 'Fundo Neutro (Chrome)',
    category: 'Fundo transparente',
    imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=600&h=400',
  },
];

export const MOCK_HISTORY: VideoHistory[] = [];
