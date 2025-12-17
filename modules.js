// Define default modules as a global variable
window.defaultModules = [
  // =========================================================================
  // 🌟 TIER 1: THE AGENTIC WEB & SOTA (New Additions)
  // =========================================================================
  { name: "Manus", categories: ["AGENT", "USE", "AUTOMATION"], url: "https://manus.ai", scores: { "AGENT": 0.99, "USE": 0.99, "AUTOMATION": 0.99 } },
  { name: "Base44", categories: ["DEV", "DATA", "AGENT"], url: "https://base44.com/", scores: { "DEV": 0.98, "DATA": 0.97, "AGENT": 0.96 } },
  { name: "Lovable", categories: ["DEV", "UI/UX", "AGENT"], url: "https://lovable.dev", scores: { "DEV": 0.98, "UI/UX": 0.99, "AGENT": 0.97 } },
  { name: "Bolt.new", categories: ["DEV", "UI/UX", "AGENT"], url: "https://bolt.new", scores: { "DEV": 0.97, "UI/UX": 0.96, "AGENT": 0.95 } },
  { name: "Reve", categories: ["T2I", "ANI", "INTERACTIVE"], url: "https://preview.reve.art/app", scores: { "T2I": 0.98, "ANI": 0.97, "INTERACTIVE": 0.99 } },
  { name: "Nano Banana Pro", categories: ["DEV", "ML", "INF"], url: "https://banana.dev/", scores: { "DEV": 0.98, "ML": 0.99, "INF": 0.99 } },
  { name: "Cursor", categories: ["DEV", "USE", "AGENT"], url: "https://cursor.com", scores: { "DEV": 0.99, "USE": 0.98, "AGENT": 0.96 } },
  { name: "Replit Agent", categories: ["DEV", "LLM", "AGENT"], url: "https://replit.com", scores: { "DEV": 0.96, "LLM": 0.93, "AGENT": 0.95 } },

  // =========================================================================
  // 🧠 TIER 2: FOUNDATION MODELS (Updated)
  // =========================================================================
  { name: "ChatGPT (GPT-5.2)", categories: ["LLM", "USE", "VIS", "AGENT"], url: "https://chat.openai.com", scores: { "LLM": 0.99, "USE": 0.99, "VIS": 0.99, "AGENT": 0.98 } },
  { name: "DeepThink (DeepSeek R1)", categories: ["LLM", "DEV", "REASONING"], url: "https://chat.deepseek.com", scores: { "LLM": 0.99, "DEV": 0.98, "REASONING": 0.99 } },
  { name: "Anthropic Claude 3.5 Sonnet", categories: ["LLM", "DEV", "USE"], url: "https://claude.ai", scores: { "LLM": 0.98, "DEV": 0.99, "USE": 0.98 } },
  { name: "Google Gemini 2.0 Flash", categories: ["LLM", "DEV", "MULTIMODAL"], url: "https://deepmind.google/technologies/gemini/flash/", scores: { "LLM": 0.97, "DEV": 0.96, "MULTIMODAL": 0.99 } },
  { name: "Perplexity Pro", categories: ["LLM", "SEA", "RESEARCH"], url: "https://perplexity.ai", scores: { "LLM": 0.97, "SEA": 0.99, "RESEARCH": 0.98 } },
  { name: "Groq", categories: ["LLM", "USE", "T2I", "I2I", "DES"], url: "https://groq.com/", scores: { "LLM": 0.98, "USE": 0.92 } },
  { name: "Mistral", categories: ["LLM", "USE"], url: "https://www.mistral.ai", scores: { "LLM": 0.92, "USE": 0.88 } },
  { name: "LLaMA 3.1", categories: ["LLM", "USE"], url: "https://ai.meta.com/llama/", scores: { "LLM": 0.93, "USE": 0.89 } },

  // =========================================================================
  // 🎬 TIER 3: VIDEO GENERATION (Sora 2, Veo3 & Classics)
  // =========================================================================
  { name: "Sora 2", categories: ["T2V", "I2V", "VID"], url: "https://openai.com/sora", scores: { "T2V": 0.99, "I2V": 0.99, "VID": 0.99 } },
  { name: "Veo3", categories: ["T2V", "VID", "I2V"], url: "https://deepmind.google/technologies/veo", scores: { "T2V": 0.98, "VID": 0.98, "I2V": 0.97 } },
  { name: "Wan 2.1", categories: ["T2V", "I2V"], url: "https://wanx.aliyun.com/", scores: { "T2V": 0.97, "I2V": 0.96 } },
  { name: "Runway Gen-3 Alpha", categories: ["T2V", "I2V", "VID"], url: "https://runwayml.com", scores: { "T2V": 0.96, "I2V": 0.95, "VID": 0.95 } },
  { name: "Hailuo MiniMax", categories: ["T2V", "VID"], url: "https://hailuoai.com/video", scores: { "T2V": 0.96, "VID": 0.95 } },
  { name: "Kling AI", categories: ["T2V", "I2V"], url: "https://klingai.com", scores: { "T2V": 0.94, "I2V": 0.93 } },
  { name: "Luma Dream Machine", categories: ["T2V", "I2V", "3D"], url: "https://lumalabs.ai", scores: { "T2V": 0.95, "I2V": 0.94, "3D": 0.93 } },
  { name: "Pika Labs", categories: ["T2V", "I2V", "ANI"], url: "https://pika.art", scores: { "T2V": 0.88, "I2V": 0.86, "ANI": 0.85 } },
  { name: "Haiper", categories: ["T2V", "I2V", "VID"], url: "https://haiper.ai/", scores: { "T2V": 0.85, "I2V": 0.90, "VID": 0.92 } },
  { name: "Kaiber", categories: ["T2V", "I2V", "ANI", "MUS"], url: "https://kaiber.ai", scores: { "T2V": 0.84, "I2V": 0.82, "ANI": 0.80, "MUS": 0.78 } },
  { name: "Synthesia", categories: ["T2V", "ANI", "FCE"], url: "https://www.synthesia.io", scores: { "T2V": 0.86, "ANI": 0.84, "FCE": 0.87 } },
  { name: "Stable Video", categories: ["T2V", "I2V"], url: "https://www.stablevideo.com/", scores: { "T2V": 0.89, "I2V": 0.89 } },
  { name: "Kaps", categories: ["USE"], url: "https://kaps.co.il", scores: { "T2V": 0.79, "I2V": 0.77, "ANI": 0.78, "Face Swap": 0.80 } },
  { name: "Veed.io", categories: ["T2V", "I2V", "VID", "V2V", "DES"], url: "https://www.veed.io", scores: { "T2V": 0.82, "I2V": 0.81, "VID": 0.83, "V2V": 0.84, "DES": 0.83 } },

  // =========================================================================
  // 🎨 TIER 4: IMAGE & DESIGN
  // =========================================================================
  { name: "Flux.1 Pro", categories: ["T2I", "I2I", "DES"], url: "https://blackforestlabs.ai/", scores: { "T2I": 0.99, "I2I": 0.97, "DES": 0.96 } },
  { name: "Midjourney v6.1", categories: ["T2I", "I2I", "DES"], url: "https://www.midjourney.com", scores: { "T2I": 0.98, "I2I": 0.96, "DES": 0.97 } },
  { name: "Recraft.ai v3", categories: ["T2I", "DES", "UI/UX", "VEC"], url: "https://www.recraft.ai/", scores: { "T2I": 0.94, "DES": 0.96, "UI/UX": 0.94, "VEC": 0.99 } },
  { name: "Ideogram 2.0", categories: ["T2I", "DES", "TYP"], url: "https://ideogram.ai", scores: { "T2I": 0.95, "DES": 0.94, "TYP": 0.99 } },
  { name: "DALL-E 3", categories: ["T2I", "I2I", "DES"], url: "https://openai.com/dall-e-3", scores: { "T2I": 0.90, "I2I": 0.85, "DES": 0.88 } },
  { name: "Krea.ai", categories: ["T2I", "I2I", "T2V", "FCE", "I2V", "V2V", "ANI", "UPS"], url: "https://www.krea.ai/", scores: { "T2I": 0.93, "I2I": 0.95, "T2V": 0.91, "FCE": 0.91, "I2V": 0.90, "V2V": 0.91, "ANI": 0.91, "UPS": 0.94 } },
  { name: "Magnific.ai", categories: ["I2I", "UPS"], url: "https://magnific.ai/", scores: { "I2I": 0.99, "UPS": 0.98 } },
  { name: "Fooocus", categories: ["T2I", "I2I", "UPS"], url: "https://colab.research.google.com/github/lllyasviel/Fooocus/blob/main/fooocus_colab.ipynb", scores: { "T2I": 0.88, "I2I": 0.92, "UPS": 0.95 } },
  { name: "Leonardo.ai", categories: ["T2I", "I2I", "ANI"], url: "https://leonardo.ai", scores: { "T2I": 0.92, "I2I": 0.90, "ANI": 0.88 } },
  { name: "Adobe Firefly", categories: ["T2I", "I2I", "DES"], url: "https://www.adobe.com/products/firefly", scores: { "T2I": 0.90, "I2I": 0.89, "DES": 0.93 } },
  { name: "Vizcom", categories: ["I2I"], url: "https://www.vizcom.ai/", scores: { "I2I": 0.94 } },
  { name: "newarc", categories: ["I2I"], url: "https://www.newarc.ai/", scores: { "I2I": 0.94 } },
  { name: "Artflow", categories: ["T2I", "FCE"], url: "https://app.artflow.ai/", scores: { "T2I": 0.78, "FCE": 0.94 } },
  { name: "Canva Magic Studio", categories: ["T2I", "DES", "ANI"], url: "https://www.canva.com/your-apps/text-to-image", scores: { "T2I": 0.85, "DES": 0.96, "ANI": 0.80 } },
  { name: "PhotoMaker", categories: ["T2I", "I2I", "FCE"], url: "https://huggingface.co/spaces/TencentARC/PhotoMaker", scores: { "T2I": 0.82, "I2I": 0.84, "FCE": 0.86 } },
  { name: "Astria", categories: ["T2I", "I2I", "UPS"], url: "https://www.astria.ai", scores: { "T2I": 0.81, "I2I": 0.79, "UPS": 0.85 } },
  { name: "Sana", categories: ["T2I"], url: "https://sana-gen.mit.edu/", scores: { "T2I": 0.78 } },
  { name: "ControlNet", categories: ["T2I", "I2I"], url: "https://github.com/lllyasviel/ControlNet", scores: { "T2I": 0.89, "I2I": 0.91 } },
  { name: "InstructPix2Pix", categories: ["T2I", "I2I"], url: "https://github.com/instruct-pix2pix/instruct-pix2pix", scores: { "T2I": 0.87, "I2I": 0.86 } },
  { name: "Segment Anything", categories: ["I2I", "DES"], url: "https://segment-anything.com", scores: { "I2I": 0.90, "DES": 0.85 } },
  { name: "Artbreeder", categories: ["T2I", "DES"], url: "https://www.artbreeder.com", scores: { "T2I": 0.79, "DES": 0.81 } },
  { name: "DeepArt", categories: ["T2I", "DES"], url: "https://deepart.io", scores: { "T2I": 0.78, "DES": 0.80 } },
  { name: "Playform", categories: ["T2I", "DES", "ANI"], url: "https://www.playform.io", scores: { "T2I": 0.84, "DES": 0.86, "ANI": 0.83 } },
  { name: "Deep Dream Generator", categories: ["T2I", "DES"], url: "https://deepdreamgenerator.com", scores: { "T2I": 0.80, "DES": 0.82 } },

  // =========================================================================
  // 🗣️ TIER 5: AUDIO, MUSIC & VOICE
  // =========================================================================
  { name: "ElevenLabs v2.5", categories: ["AUD", "T2S", "VCL"], url: "https://elevenlabs.io", scores: { "AUD": 0.99, "T2S": 0.99, "VCL": 0.99 } },
  { name: "Suno v4", categories: ["AUD", "MUS"], url: "https://www.suno.ai", scores: { "AUD": 0.96, "MUS": 0.97 } },
  { name: "Udio v1.5", categories: ["AUD", "MUS"], url: "https://udio.com", scores: { "AUD": 0.97, "MUS": 0.98 } },
  { name: "NotebookLM", categories: ["DOCS", "AUD", "RESEARCH", "PODCAST"], url: "https://notebooklm.google.com/", scores: { "DOCS": 0.99, "AUD": 0.99, "RESEARCH": 0.99, "PODCAST": 0.99 } },
  { name: "Stable Audio", categories: ["AUD", "MUS"], url: "https://www.stableaudio.com", scores: { "AUD": 0.88, "MUS": 0.90 } },
  { name: "Soundful", categories: ["AUD", "MUS"], url: "https://soundful.com", scores: { "AUD": 0.85, "MUS": 0.84 } },
  { name: "Beatoven", categories: ["AUD", "MUS"], url: "https://www.beatoven.ai", scores: { "AUD": 0.84, "MUS": 0.83 } },
  { name: "AIVA", categories: ["AUD", "MUS"], url: "https://www.aiva.ai", scores: { "AUD": 0.87, "MUS": 0.86 } },
  { name: "Riffusion", categories: ["AUD", "MUS"], url: "https://riffusion.com", scores: { "AUD": 0.83, "MUS": 0.82 } },
  { name: "Cleanvoice AI", categories: ["AUD", "USE"], url: "https://cleanvoice.ai", scores: { "AUD": 0.86, "USE": 0.85 } },
  { name: "Descript", categories: ["AUD", "V2V", "Voice Clone"], url: "https://www.descript.com", scores: { "AUD": 0.93, "V2V": 0.89, "VCL": 0.90 } },
  { name: "Adobe Podcast", categories: ["AUD"], url: "https://podcast.adobe.com/", scores: { "AUD": 0.92 } },
  { name: "Fadr", categories: ["AUD", "MUS"], url: "https://fadr.com/", scores: { "AUD": 0.93, "MUS": 0.80 } },
  { name: "Narakeet", categories: ["T2S", "AUD"], url: "https://www.narakeet.com/", scores: { "T2S": 0.92, "AUD": 0.90 } },
  { name: "OpenAI Whisper", categories: ["AUD", "S2T"], url: "https://github.com/openai/whisper", scores: { "AUD": 0.95, "S2T": 0.96 } },
  { name: "Play.ht", categories: ["AUD", "T2S", "VCL"], url: "https://play.ht", scores: { "AUD": 0.91, "T2S": 0.93, "VCL": 0.91 } },

  // =========================================================================
  // 🎭 TIER 6: FACE, AVATARS & ANIMATION
  // =========================================================================
  { name: "Advanced Live Portrait", categories: ["ANI", "FCE"], url: "https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait", scores: { "FCE": 0.97, "ANI": 0.96 } },
  { name: "FacePoke", categories: ["FCE"], url: "https://facepoke.org/", scores: { "FCE": 0.96 } },
  { name: "Hedra", categories: ["FCE"], url: "https://www.hedra.com/", scores: { "FCE": 0.97 } },
  { name: "HeyGen", categories: ["I2V", "FCE", "T2V"], url: "https://www.heygen.com", scores: { "I2V": 0.96, "FCE": 0.95, "T2V": 0.93 } },
  { name: "D-ID", categories: ["I2V", "FCE"], url: "https://studio.d-id.com", scores: { "I2V": 0.88, "FCE": 0.90 } },
  { name: "Pixverse", categories: ["T2V", "I2V", "ANI"], url: "https://pixverse.ai", scores: { "T2V": 0.88, "I2V": 0.90, "ANI": 0.89 } },
  { name: "FaceApp", categories: ["FCE"], url: "https://www.faceapp.com", scores: { "FCE": 0.85 } },
  { name: "Deep Nostalgia", categories: ["T2I", "VID"], url: "https://www.myheritage.com/deep-nostalgia", scores: { "T2I": 0.82, "VID": 0.80 } },
  { name: "Domo", categories: ["T2V", "ANI", "V2V", "FCE"], url: "https://domo.com", scores: { "T2V": 0.80, "ANI": 0.78, "V2V": 0.92, "FCE": 0.82 } },
  { name: "Stable Video Diffusion", categories: ["V2V", "I2V", "ANI"], url: "https://huggingface.co/stabilityai/stable-video-diffusion-img2vid", scores: { "V2V": 0.87, "I2V": 0.86, "ANI": 0.84 } },

  // =========================================================================
  // 🛠️ TIER 7: USEFUL TOOLS & INFRASTRUCTURE
  // =========================================================================
  { name: "Google AI Studio", categories: ["DEV", "ML", "INF"], url: "https://aistudio.google.com/", scores: { "DEV": 0.98, "ML": 0.97, "INF": 0.98 } },
  { name: "Hugging Face Spaces", categories: ["DEV", "ML", "USE"], url: "https://huggingface.co/spaces", scores: { "DEV": 0.98, "ML": 0.99, "USE": 0.96 } },
  { name: "Upscayl", categories: ["UPS"], url: "https://upscayl.org/", scores: { "UPS": 0.92 } },
  { name: "Grammarly", categories: ["LLM", "USE"], url: "https://www.grammarly.com/", scores: { "LLM": 0.95, "USE": 0.94 } },
  { name: "DeepL Write", categories: ["LLM", "USE"], url: "https://www.deepl.com/write", scores: { "LLM": 0.89, "USE": 0.92 } },
  { name: "DeepL Translator", categories: ["LLM", "TRANS"], url: "https://www.deepl.com", scores: { "LLM": 0.89, "TRANS": 0.99 } },
  { name: "Notion AI", categories: ["LLM", "USE"], url: "https://www.notion.so/product/ai", scores: { "LLM": 0.91, "USE": 0.90 } },
  { name: "GitHub Copilot", categories: ["LLM", "USE"], url: "https://copilot.github.com", scores: { "LLM": 0.93, "USE": 0.92 } },
  { name: "Character.AI", categories: ["LLM", "USE"], url: "https://beta.character.ai", scores: { "LLM": 0.88, "USE": 0.86 } },
  { name: "Dify", categories: ["LLM", "USE", "SEA"], url: "https://dify.ai", scores: { "LLM": 0.87, "USE": 0.85, "SEA": 0.84 } },
  { name: "Replika", categories: ["LLM", "USE"], url: "https://replika.ai", scores: { "LLM": 0.86, "USE": 0.84 } },
  { name: "Whisper Typing", categories: ["USE"], url: "https://whisper.typing.ai", scores: { "USE": 0.87 } },
  { name: "DeepAI", categories: ["LLM", "T2I", "USE"], url: "https://deepai.org", scores: { "LLM": 0.85, "T2I": 0.83, "USE": 0.82 } },
  { name: "Copy.ai", categories: ["CON", "LLM", "USE"], url: "https://www.copy.ai", scores: { "CON": 0.83, "LLM": 0.80, "USE": 0.82 } },
  { name: "INK", categories: ["CON", "LLM", "USE"], url: "https://inkforall.com", scores: { "CON": 0.81, "LLM": 0.79, "USE": 0.80 } },
  { name: "ChatSonic", categories: ["LLM", "USE"], url: "https://writesonic.com/chat", scores: { "LLM": 0.86, "USE": 0.85 } },
  { name: "Jasper", categories: ["CON", "LLM", "USE"], url: "https://www.jasper.ai/", scores: { "CON": 0.85, "LLM": 0.84, "USE": 0.82 } },
  { name: "Gamma", categories: ["PRE", "LLM", "USE"], url: "https://gamma.app/", scores: { "PRE": 0.95, "LLM": 0.90, "USE": 0.94 } },
  { name: "Napkin.ai", categories: ["PRE", "LLM", "USE"], url: "https://www.napkin.ai/", scores: { "PRE": 0.96, "LLM": 0.89, "USE": 0.94 } },
  { name: "Beautiful.ai", categories: ["PRE", "DES"], url: "https://www.beautiful.ai", scores: { "PRE": 0.92, "DES": 0.90 } },
  { name: "Zyro", categories: ["CON", "USE"], url: "https://zyro.com/tools/ai-content-generator", scores: { "CON": 0.80, "USE": 0.78 } },
  { name: "Zapier AI", categories: ["AUTOMATION", "USE"], url: "https://zapier.com/ai", scores: { "AUTOMATION": 0.98, "USE": 0.97 } },
  { name: "Make", categories: ["AUTOMATION", "USE"], url: "https://www.make.com/", scores: { "AUTOMATION": 0.97, "USE": 0.95 } },
  { name: "Browse.ai", categories: ["USE", "AUTOMATION"], url: "https://browse.ai/", scores: { "USE": 0.92, "AUTOMATION": 0.91 } },

  // =========================================================================
  // 🏢 TIER 8: 3D, DESIGN & NICHE (Merged)
  // =========================================================================
  { name: "Blender", categories: ["3D", "ANI", "DES"], url: "https://www.blender.org", scores: { "3D": 0.94, "ANI": 0.92, "DES": 0.90 } },
  { name: "Cinema 4D", categories: ["3D", "ANI", "DES"], url: "https://www.maxon.net/cinema-4d", scores: { "3D": 0.91, "ANI": 0.89, "DES": 0.87 } },
  { name: "Spline AI", categories: ["3D", "DES", "WEB"], url: "https://spline.design/ai", scores: { "3D": 0.94, "DES": 0.93, "WEB": 0.95 } },
  { name: "Meshy", categories: ["3D", "I23"], url: "http://www.meshy.ai", scores: { "3D": 0.93, "I23": 0.94 } },
  { name: "CSM", categories: ["3D", "I23"], url: "http://3d.csm.ai", scores: { "3D": 0.84, "I23": 0.87 } },
  { name: "Sloyd", categories: ["3D", "DES"], url: "https://sloyd.ai", scores: { "3D": 0.84, "DES": 0.83 } },
  { name: "Kaedim", categories: ["3D", "DES"], url: "https://kaedim3d.com", scores: { "3D": 0.90, "DES": 0.88 } },
  { name: "Point-E", categories: ["3D", "DES"], url: "https://github.com/openai/point-e", scores: { "3D": 0.80, "DES": 0.78 } },
  { name: "Shapr3D", categories: ["3D", "DES"], url: "https://www.shapr3d.com/", scores: { "3D": 0.92, "DES": 0.91 } },
  { name: "Figma", categories: ["DES", "UI/UX"], url: "https://www.figma.com", scores: { "DES": 0.96, "UI/UX": 0.97 } },
  { name: "Sketch", categories: ["DES", "UI/UX"], url: "https://www.sketch.com", scores: { "DES": 0.88, "UI/UX": 0.90 } },
  { name: "Mobirise", categories: ["LLM", "USE", "UI/UX"], url: "https://mobirise.com/", scores: { "LLM": 0.95, "USE": 0.90, "UI/UX": 0.90 } },
  { name: "InteriorAI", categories: ["DES", "I2I"], url: "https://interiorai.com/", scores: { "DES": 0.92, "I2I": 0.91 } },
  { name: "Galileo AI", categories: ["UI/UX", "DES"], url: "https://www.usegalileo.ai/", scores: { "UI/UX": 0.94, "DES": 0.92 } },
  { name: "InVision", categories: ["DES", "UI/UX"], url: "https://www.invisionapp.com", scores: { "DES": 0.86, "UI/UX": 0.88 } },
  { name: "Miro AI", categories: ["DES", "UI/UX"], url: "https://miro.com/miro-ai/", scores: { "DES": 0.92, "UI/UX": 0.93 } }
];
