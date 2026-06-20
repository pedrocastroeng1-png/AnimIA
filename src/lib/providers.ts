export type ProviderTier = 'rapido' | 'equilibrado' | 'premium';

export interface AIProvider {
  id: string;
  name: string;
  type: 'video' | 'image' | 'voice' | 'text';
  tier: ProviderTier;
}

export const VIDEO_PROVIDERS: AIProvider[] = [
  { id: 'veo', name: 'Google Veo', type: 'video', tier: 'premium' },
  { id: 'sora', name: 'OpenAI Sora', type: 'video', tier: 'premium' },
  { id: 'kling', name: 'Kling AI', type: 'video', tier: 'equilibrado' },
  { id: 'runway', name: 'Runway Gen-3', type: 'video', tier: 'equilibrado' },
  { id: 'pika', name: 'Pika Labs', type: 'video', tier: 'rapido' },
  { id: 'luma', name: 'Luma Dream Machine', type: 'video', tier: 'rapido' },
];

export const IMAGE_PROVIDERS: AIProvider[] = [
  { id: 'gemini', name: 'Gemini Image', type: 'image', tier: 'premium' },
  { id: 'dalle', name: 'DALL-E 3', type: 'image', tier: 'equilibrado' },
  { id: 'flux', name: 'Flux', type: 'image', tier: 'premium' },
  { id: 'ideogram', name: 'Ideogram', type: 'image', tier: 'equilibrado' },
];

export const VOICE_PROVIDERS: AIProvider[] = [
  { id: 'elevenlabs', name: 'ElevenLabs', type: 'voice', tier: 'premium' },
  { id: 'google_tts', name: 'Google TTS', type: 'voice', tier: 'equilibrado' },
  { id: 'openai_voice', name: 'OpenAI Voice', type: 'voice', tier: 'equilibrado' },
  { id: 'azure', name: 'Azure Speech', type: 'voice', tier: 'rapido' },
];

export const TEXT_PROVIDERS: AIProvider[] = [
  { id: 'gemini_pro', name: 'Gemini Pro', type: 'text', tier: 'premium' },
  { id: 'gpt4', name: 'ChatGPT', type: 'text', tier: 'premium' },
  { id: 'claude', name: 'Claude', type: 'text', tier: 'premium' },
];
