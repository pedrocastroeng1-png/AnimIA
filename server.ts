import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/generate-video", async (req, res) => {
    try {
      const { prompt, characterId, characterData, backgroundId, backgroundData } = req.body;

      // 1. Generate the Video Script and Scene Structure
      const generationResponse = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Crie um roteiro publicitário engajador, direto e persuasivo de 15 a 30 segundos baseado nesta ideia: "${prompt}".
        
        O personagem usado é: "${characterData?.name || 'Mascote Genérico'}" (Personalidade: ${characterData?.personality || 'Comercial/Vendedor'})
        O cenário usado é: "${backgroundData?.name || 'Loja'}"
        
        Siga estas regras restritas:
        - O roteiro DEVE SER em Português do Brasil (pt-BR).
        - A linguagem deve ser voltada para vendas, redes sociais (TikTok, Reels, Shorts).
        - Divida em no máximo 4 cenas curtas.
        - Sem placeholders, crie um conteúdo completo e realista.
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Um título curto e chamativo para o vídeo." },
              fullScript: { type: Type.STRING, description: "O texto completo da narração, fluído, sem quebras para as cenas, 100% texto que será falado." },
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    textFragment: { type: Type.STRING, description: "A parte específica do roteiro falada nesta cena. O tempo total deve ser rápido." },
                    behavior: { type: Type.STRING, description: "O comportamento ideal do avatar nesta cena. (Ex: 'Acenar', 'Apontar para o lado', 'Mostrar produto', 'Comemorar')" },
                    durationMs: { type: Type.INTEGER, description: "Duração aproximada em milissegundos desta cena." }
                  },
                  required: ["id", "textFragment", "behavior", "durationMs"]
                }
              }
            },
            required: ["title", "fullScript", "scenes"]
          }
        }
      });

      const videoDataStr = generationResponse.text;
      let videoData;
      if (videoDataStr) {
         videoData = JSON.parse(videoDataStr);
      } else {
         throw new Error("Failed to generate structure.");
      }

      // 2. Generate Audio (TTS) for the full script
      let base64Audio = null;
      try {
        const audioResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: videoData.fullScript }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Zephyr' }, // Zephyr usually sounds energetic/friendly
                },
            },
          },
        });
        
        base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (audioErr) {
        console.error("Audio generation error:", audioErr);
        // We will continue even if audio fails, the frontend can fallback to browser TTS
      }

      res.json({
        success: true,
        data: {
          ...videoData,
          audioBase64: base64Audio
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to generate video data" });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
