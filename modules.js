// Define default modules as a global variable
window.defaultModules = [
  // List Degraded on 291024

  // Large Language Models (LLM)
  { name: "ChatGPT", categories: ["LLM", "USE", "T2I", "I2I", "DES"], url: "https://chat.openai.com", scores: { "LLM": 0.90, "USE": 0.85 } },
  { name: "Claude", categories: ["LLM", "USE"], url: "https://claude.ai", scores: { "LLM": 0.95, "USE": 0.90 } },
  { name: "Groq", categories: ["LLM", "USE", "T2I", "I2I", "DES"], url: "https://groq.com/", scores: { "LLM": 0.98, "USE": 0.90 } },
  { name: "Bard", categories: ["LLM", "USE"], url: "https://bard.google.com", scores: { "LLM": 0.85, "USE": 0.75 } },
  { name: "LLaMA 2", categories: ["LLM", "USE"], url: "https://ai.meta.com/llama/", scores: { "LLM": 0.91, "USE": 0.87 } },
  { name: "Mistral", categories: ["LLM", "USE"], url: "https://www.mistral.ai", scores: { "LLM": 0.92, "USE": 0.88 } },

  // AI Tools (USE)
  { name: "Grammarly", categories: ["LLM", "USE"], url: "https://www.grammarly.com/", scores: { "LLM": 0.95, "USE": 0.90 } },
  { name: "DeepL Write", categories: ["LLM", "USE"], url: "https://www.deepl.com/write", scores: { "LLM": 0.89, "USE": 0.87 } },
  { name: "Character.AI", categories: ["LLM", "USE"], url: "https://beta.character.ai", scores: { "LLM": 0.88, "USE": 0.86 } },
  { name: "GitHub Copilot", categories: ["LLM", "USE"], url: "https://copilot.github.com", scores: { "LLM": 0.90, "USE": 0.88 } },
  { name: "Notion AI", categories: ["LLM", "USE"], url: "https://www.notion.so/product/ai", scores: { "LLM": 0.87, "USE": 0.86 } },
  { name: "Dify", categories: ["LLM", "USE", "SEA"], url: "https://dify.ai", scores: { "LLM": 0.87, "USE": 0.85, "SEA": 0.84 } },
  { name: "Replika", categories: ["LLM", "USE"], url: "https://replika.ai", scores: { "LLM": 0.86, "USE": 0.84 } },

  // Text to Image (T2I)
  { name: "DALL-E 3", categories: ["T2I", "I2I", "DES"], url: "https://openai.com/dall-e-3", scores: { "T2I": 0.85, "I2I": 0.80, "DES": 0.85 } },
  { name: "Midjourney", categories: ["T2I", "I2I", "DES"], url: "https://www.midjourney.com", scores: { "T2I": 0.92, "I2I": 0.88, "DES": 0.90 } },
  { name: "Fooocus", categories: ["T2I", "I2I", "UPS"], url: "https://colab.research.google.com/github/lllyasviel/Fooocus/blob/main/fooocus_colab.ipynb", scores: { "T2I": 0.88, "I2I": 0.92, "UPS": 0.95 } },
  { name: "Artflow", categories: ["T2I", "FCE"], url: "https://app.artflow.ai/", scores: { "T2I": 0.78, "FCE": 0.94 } },
  { name: "Leonardo.ai", categories: ["T2I", "I2I", "ANI"], url: "https://leonardo.ai", scores: { "T2I": 0.86, "I2I": 0.84, "ANI": 0.78 } },
  { name: "Ideogram", categories: ["T2I", "DES"], url: "https://ideogram.ai", scores: { "T2I": 0.83, "DES": 0.85 } },
  { name: "Adobe Firefly", categories: ["T2I", "I2I", "DES"], url: "https://www.adobe.com/products/firefly", scores: { "T2I": 0.87, "I2I": 0.85, "DES": 0.89 } },
  { name: "Canva", categories: ["T2I", "DES", "ANI"], url: "https://www.canva.com/your-apps/text-to-image", scores: { "T2I": 0.80, "DES": 0.88, "ANI": 0.75 } },
  { name: "PhotoMaker", categories: ["T2I", "I2I", "FCE"], url: "https://huggingface.co/spaces/TencentARC/PhotoMaker", scores: { "T2I": 0.82, "I2I": 0.84, "FCE": 0.86 } },
  { name: "Astria", categories: ["T2I", "I2I", "UPS"], url: "https://www.astria.ai", scores: { "T2I": 0.81, "I2I": 0.79, "UPS": 0.85 } },
  { name: "Sana", categories: ["T2I"], url: "https://sana-gen.mit.edu/", scores: { "T2I": 0.78 } },
  { name: "Gemini 2.0 Flash", categories: ["T2I"], url: "https://gemini.google.com/flash", scores: { "T2I": 0.88 } },
  { name: "ControlNet", categories: ["T2I", "I2I"], url: "https://github.com/lllyasviel/ControlNet", scores: { "T2I": 0.89, "I2I": 0.91 } },
  { name: "InstructPix2Pix", categories: ["T2I", "I2I"], url: "https://github.com/instruct-pix2pix/instruct-pix2pix", scores: { "T2I": 0.87, "I2I": 0.86 } },
  { name: "Segment Anything", categories: ["I2I", "DES"], url: "https://segment-anything.com", scores: { "I2I": 0.90, "DES": 0.85 } },

  // Image to Image (I2I)
  { name: "Krea.ai", categories: ["T2I", "I2I", "T2V", "FCE", "I2V", "V2V", "ANI", "UPS"], url: "https://www.krea.ai/", scores: { "T2I": 0.88, "I2I": 0.92, "T2V": 0.90, "FCE": 0.91, "I2V": 0.90, "V2V": 0.91, "ANI": 0.91, "UPS": 0.91 } },
  { name: "Vizcom", categories: ["I2I"], url: "https://www.vizcom.ai/", scores: { "I2I": 0.92 } },
  { name: "newarc", categories: ["I2I"], url: "https://www.newarc.ai/", scores: { "I2I": 0.94 } },
  { name: "Reve", categories: ["T2I"], url: "https://preview.reve.art/app", scores: { "T2I": 0.97 } },

  // Text to Video (T2V)
  { name: "HaliuoAI", categories: ["T2V", "I2V"], url: "https://hailuoai.com/video", scores: { "T2V": 0.82, "I2V": 0.80 } },
  { name: "Kling.ai", categories: ["T2V", "I2V"], url: "https://klingai.com", scores: { "T2V": 0.79, "I2V": 0.77 } },
  { name: "RunwayML", categories: ["T2I", "I2I", "T2V", "FCE", "I2V", "V2V", "ANI"], url: "https://runwayml.com", scores: { "T2I": 0.86, "I2I": 0.84, "T2V": 0.88, "FCE": 0.85, "I2V": 0.87, "V2V": 0.86, "ANI": 0.83 } },
  { name: "Pika Labs", categories: ["T2V", "I2V", "ANI"], url: "https://pika.art", scores: { "T2V": 0.85, "I2V": 0.83, "ANI": 0.81 } },
  { name: "Kaiber", categories: ["T2V", "I2V", "ANI", "MUS"], url: "https://kaiber.ai", scores: { "T2V": 0.84, "I2V": 0.82, "ANI": 0.80, "MUS": 0.78 } },
  { name: "Synthesia", categories: ["T2V", "ANI", "FCE"], url: "https://www.synthesia.io", scores: { "T2V": 0.86, "ANI": 0.84, "FCE": 0.87 } },
  { name: "Stable Video", categories: ["T2V", "I2V"], url: "https://www.stablevideo.com/", scores: { "T2V": 0.89, "I2V": 0.89 } },
  { name: "Veed.io", categories: ["T2V", "I2V", "VID", "V2V", "DES"], url: "https://www.veed.io", scores: { "T2V": 0.82, "I2V": 0.81, "VID": 0.83, "V2V": 0.84, "DES": 0.83 } },
  { name: "Kaps", categories: ["USE"], url: "https://kaps.co.il", scores: { "T2V": 0.79, "I2V": 0.77, "ANI": 0.78, "Face Swap": 0.80 } },

  // Image to Video (I2V)
  { name: "Hedra", categories: ["FCE"], url: "https://www.hedra.com/", scores: { "FCE": 0.95 } },
  { name: "Pixverse", categories: ["T2V", "I2V", "ANI"], url: "https://pixverse.ai", scores: { "T2V": 0.81, "I2V": 0.88, "ANI": 0.89 } },
  { name: "D-ID", categories: ["I2V", "FCE"], url: "https://studio.d-id.com", scores: { "I2V": 0.85, "FCE": 0.87 } },
  { name: "Luma Labs", categories: ["T2V", "I2V", "ANI"], url: "https://lumalabs.ai", scores: { "T2V": 0.92, "I2V": 0.84, "ANI": 0.82 } },

  // Video Repaint (V2V)
  { name: "Domo", categories: ["T2V", "ANI", "V2V", "FCE"], url: "https://domo.com", scores: { "T2V": 0.80, "ANI": 0.78, "V2V": 0.92, "FCE": 0.82 } },
  { name: "CapCut", categories: ["VID", "V2V", "DES", "ANI"], url: "https://www.capcut.com", scores: { "VID": 0.94, "V2V": 0.85, "DES": 0.83, "ANI": 0.81 } },
  { name: "Stable Video Diffusion", categories: ["V2V", "I2V", "ANI"], url: "https://huggingface.co/stabilityai/stable-video-diffusion-img2vid", scores: { "V2V": 0.87, "I2V": 0.86, "ANI": 0.84 } },

  // 3D Tools (3D)
  { name: "Blender", categories: ["3D", "ANI", "DES"], url: "https://www.blender.org", scores: { "3D": 0.92, "ANI": 0.90, "DES": 0.88 } },
  { name: "Cinema 4D", categories: ["3D", "ANI", "DES"], url: "https://www.maxon.net/cinema-4d", scores: { "3D": 0.91, "ANI": 0.89, "DES": 0.87 } },

  // Design (DES)
  { name: "Figma", categories: ["DES", "UI/UX"], url: "https://www.figma.com", scores: { "DES": 0.93, "UI/UX": 0.95 } },
  { name: "Sketch", categories: ["DES", "UI/UX"], url: "https://www.sketch.com", scores: { "DES": 0.88, "UI/UX": 0.90 } },
  { name: "InteriorAI", categories: ["DES", "I2I"], url: "https://interiorai.com/", scores: { "DES": 0.91, "I2I": 0.90 } },
  // Add missing original module for UX/UI
  { name: "Mobirise", categories: ["LLM", "USE", "UI/UX"], url: "https://mobirise.com/", scores: { "LLM": 0.95, "USE": 0.90, "UI/UX": 0.90 } },

  // Upscale/Enhance (UPS)
  { name: "Magnific.ai", categories: ["I2I", "UPS"], url: "https://magnific.ai/", scores: { "I2I": 0.99, "UPS": 0.97 } },
  { name: "Upscayl", categories: ["UPS"], url: "https://upscayl.org/", scores: { "UPS": 0.88 } },

  // Audio (AUD)
  { name: "Descript", categories: ["AUD", "V2V", "Voice Clone"], url: "https://www.descript.com", scores: { "AUD": 0.87, "V2V": 0.85, "VCL": 0.86 } },
  { name: "Adobe Podcast", categories: ["AUD"], url: "https://podcast.adobe.com/", scores: { "AUD": 0.92 } },
  { name: "Fadr", categories: ["AUD", "MUS"], url: "https://fadr.com/", scores: { "AUD": 0.93, "MUS": 0.75 } },

  // Music Generation (MUS)
  { name: "Suno.ai", categories: ["AUD", "MUS"], url: "https://www.suno.ai", scores: { "AUD": 0.86, "MUS": 0.88 } },
  { name: "Udio.ai", categories: ["AUD", "MUS"], url: "https://udio.com", scores: { "AUD": 0.83, "MUS": 0.85 } },
  { name: "Stable Audio", categories: ["AUD", "MUS"], url: "https://www.stableaudio.com", scores: { "AUD": 0.85, "MUS": 0.87 } },
  { name: "Soundful", categories: ["AUD", "MUS"], url: "https://soundful.com", scores: { "AUD": 0.85, "MUS": 0.84 } },
  { name: "Beatoven", categories: ["AUD", "MUS"], url: "https://www.beatoven.ai", scores: { "AUD": 0.84, "MUS": 0.83 } },

  // New Modules & Additional Content (based on TAAFT insights and recent trends)
  { name: "Sora.com", categories: ["VID", "T2I", "I2V", "V2V"], url: "https://sora.com", scores: { "VID": 0.93 } },
  { name: "Whisper Typing", categories: ["USE"], url: "https://whisper.typing.ai", scores: { "USE": 0.87 } },
  { name: "Veo2", categories: ["VID"], url: "https://veo2.com", scores: { "VID": 0.88 } },
  { name: "DeepAI", categories: ["LLM", "T2I", "USE"], url: "https://deepai.org", scores: { "LLM": 0.85, "T2I": 0.83, "USE": 0.82 } },
  { name: "Artbreeder", categories: ["T2I", "DES"], url: "https://www.artbreeder.com", scores: { "T2I": 0.79, "DES": 0.81 } },
  { name: "Copy.ai", categories: ["CON", "LLM", "USE"], url: "https://www.copy.ai", scores: { "CON": 0.83, "LLM": 0.80, "USE": 0.82 } },
  { name: "INK", categories: ["CON", "LLM", "USE"], url: "https://inkforall.com", scores: { "CON": 0.81, "LLM": 0.79, "USE": 0.80 } },
  { name: "ChatSonic", categories: ["LLM", "USE"], url: "https://writesonic.com/chat", scores: { "LLM": 0.86, "USE": 0.85 } },
  { name: "Deep Nostalgia", categories: ["T2I", "VID"], url: "https://www.myheritage.com/deep-nostalgia", scores: { "T2I": 0.82, "VID": 0.80 } },
  { name: "Riffusion", categories: ["AUD", "MUS"], url: "https://riffusion.com", scores: { "AUD": 0.83, "MUS": 0.82 } },
  { name: "Point-E", categories: ["3D", "DES"], url: "https://github.com/openai/point-e", scores: { "3D": 0.80, "DES": 0.78 } },
  { name: "Deep Dream Generator", categories: ["T2I", "DES"], url: "https://deepdreamgenerator.com", scores: { "T2I": 0.80, "DES": 0.82 } },
  { name: "FaceApp", categories: ["FCE"], url: "https://www.faceapp.com", scores: { "FCE": 0.85 } },
  { name: "DeepArt", categories: ["T2I", "DES"], url: "https://deepart.io", scores: { "T2I": 0.78, "DES": 0.80 } },
  { name: "Zyro AI Content Generator", categories: ["CON", "USE"], url: "https://zyro.com/tools/ai-content-generator", scores: { "CON": 0.80, "USE": 0.78 } },
  { name: "Playform", categories: ["T2I", "DES", "ANI"], url: "https://www.playform.io", scores: { "T2I": 0.84, "DES": 0.86, "ANI": 0.83 } },
  { name: "AIVA", categories: ["AUD", "MUS"], url: "https://www.aiva.ai", scores: { "AUD": 0.87, "MUS": 0.86 } },
  { name: "Cleanvoice AI", categories: ["AUD", "USE"], url: "https://cleanvoice.ai", scores: { "AUD": 0.86, "USE": 0.85 } },
  { name: "Sloyd", categories: ["3D", "DES"], url: "https://sloyd.ai", scores: { "3D": 0.84, "DES": 0.83 } },
  { name: "Kaedim", categories: ["3D", "DES"], url: "https://kaedim3d.com", scores: { "3D": 0.85, "DES": 0.84 } },

  // Face Editing (FCE)
  { name: "Advanced Live Portrait", categories: ["ANI", "FCE"], url: "https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait", scores: { "FCE": 0.96 } },
  { name: "FacePoke", categories: ["FCE"], url: "https://facepoke.org/", scores: { "FCE": 0.96 } },

  // Developer Tools (DEV) - new coding AIs
  { name: "Manus", categories: ["DEV"], url: "https://manus.ai", scores: { "DEV": 0.85 } },
  { name: "Base44", categories: ["DEV"], url: "https://base44.com/", scores: { "DEV": 0.80 } },
  { name: "Cursor", categories: ["DEV"], url: "https://cursor.ai", scores: { "DEV": 0.90 } },
  { name: "Lovable", categories: ["DEV"], url: "https://lovable.dev", scores: { "DEV": 0.88 } },
  { name: "Bolt", categories: ["DEV"], url: "https://bolt.new", scores: { "DEV": 0.87 } },
  { name: "Replit", categories: ["DEV"], url: "https://replit.com", scores: { "DEV": 0.89 } }
];
