window.defaultModules = [
  // =========================================================================
  // 🌟 TIER 1: THE AGENTIC WEB & SOTA MODELS (2025)
  // =========================================================================
  { name: "Manus", categories: ["AGENT", "USE", "AUTOMATION"], url: "https://manus.ai", scores: { "AGENT": 0.99, "USE": 0.99, "AUTOMATION": 0.99 } },
  { name: "Base44", categories: ["DEV", "DATA", "AGENT"], url: "https://base44.com/", scores: { "DEV": 0.96, "DATA": 0.98, "AGENT": 0.95 } },
  { name: "Lovable", categories: ["DEV", "UI/UX", "AGENT"], url: "https://lovable.dev", scores: { "DEV": 0.98, "UI/UX": 0.99, "AGENT": 0.97 } },
  { name: "Bolt.new", categories: ["DEV", "UI/UX", "AGENT"], url: "https://bolt.new", scores: { "DEV": 0.97, "UI/UX": 0.96, "AGENT": 0.95 } },
  { name: "Reve", categories: ["T2I", "ANI", "INTERACTIVE"], url: "https://preview.reve.art/app", scores: { "T2I": 0.98, "ANI": 0.97, "INTERACTIVE": 0.99 } },
  { name: "Nano Banana Pro", categories: ["DEV", "ML", "INF"], url: "https://banana.dev/", scores: { "DEV": 0.98, "ML": 0.99, "INF": 0.99 } },
  { name: "Cursor", categories: ["DEV", "USE", "AGENT"], url: "https://cursor.com", scores: { "DEV": 0.99, "USE": 0.98, "AGENT": 0.96 } },
  { name: "Windsurf", categories: ["DEV", "AGENT"], url: "https://codeium.com/windsurf", scores: { "DEV": 0.96, "AGENT": 0.95 } },

  // =========================================================================
  // 🧠 TIER 2: FOUNDATION MODELS (LLMs & Reasoning)
  // =========================================================================
  { name: "ChatGPT (GPT-5.2)", categories: ["LLM", "USE", "VIS", "AGENT"], url: "https://chat.openai.com", scores: { "LLM": 0.99, "USE": 0.99, "VIS": 0.99, "AGENT": 0.98 } },
  { name: "DeepThink (DeepSeek R1)", categories: ["LLM", "DEV", "REASONING"], url: "https://chat.deepseek.com", scores: { "LLM": 0.99, "DEV": 0.98, "REASONING": 0.99 } },
  { name: "Anthropic Claude 3.5 Sonnet", categories: ["LLM", "DEV", "USE"], url: "https://claude.ai", scores: { "LLM": 0.98, "DEV": 0.99, "USE": 0.98 } },
  { name: "Google Gemini 2.0 Flash", categories: ["LLM", "DEV", "MULTIMODAL"], url: "https://deepmind.google/technologies/gemini/flash/", scores: { "LLM": 0.97, "DEV": 0.96, "MULTIMODAL": 0.99 } },
  { name: "Grok 3 (Beta)", categories: ["LLM", "T2I", "REASONING"], url: "https://x.ai/", scores: { "LLM": 0.97, "T2I": 0.94, "REASONING": 0.95 } },
  { name: "Perplexity Pro", categories: ["LLM", "SEA", "RESEARCH"], url: "https://perplexity.ai", scores: { "LLM": 0.97, "SEA": 0.99, "RESEARCH": 0.98 } },
  { name: "Mistral Large 2", categories: ["LLM", "DEV"], url: "https://mistral.ai", scores: { "LLM": 0.94, "DEV": 0.93 } },
  { name: "Cohere Command R+", categories: ["LLM", "USE", "RAG"], url: "https://cohere.ai/", scores: { "LLM": 0.93, "USE": 0.92, "RAG": 0.98 } },

  // =========================================================================
  // 🎬 TIER 3: NEXT-GEN VIDEO & 3D
  // =========================================================================
  { name: "Sora 2", categories: ["T2V", "I2V", "VID"], url: "https://openai.com/sora", scores: { "T2V": 0.99, "I2V": 0.99, "VID": 0.99 } },
  { name: "Veo3", categories: ["T2V", "VID", "I2V"], url: "https://deepmind.google/technologies/veo", scores: { "T2V": 0.98, "VID": 0.98, "I2V": 0.97 } },
  { name: "Wan 2.1", categories: ["T2V", "I2V"], url: "https://wanx.aliyun.com/", scores: { "T2V": 0.97, "I2V": 0.96 } },
  { name: "Runway Gen-3 Alpha", categories: ["T2V", "I2V", "VID"], url: "https://runwayml.com/", scores: { "T2V": 0.96, "I2V": 0.95, "VID": 0.95 } },
  { name: "Hailuo MiniMax", categories: ["T2V", "VID"], url: "https://hailuoai.com/video", scores: { "T2V": 0.96, "VID": 0.95 } },
  { name: "Luma Dream Machine", categories: ["T2V", "I2V", "3D"], url: "https://lumalabs.ai", scores: { "T2V": 0.95, "I2V": 0.94, "3D": 0.93 } },
  { name: "Kling AI", categories: ["T2V", "I2V"], url: "https://klingai.com", scores: { "T2V": 0.94, "I2V": 0.93 } },
  { name: "Hedra", categories: ["FCE", "T2V"], url: "https://www.hedra.com/", scores: { "FCE": 0.97, "T2V": 0.94 } },
  { name: "Rodin Gen-1", categories: ["3D", "I23"], url: "https://hyperhuman.deemos.com/rodin", scores: { "3D": 0.96, "I23": 0.97 } },

  // =========================================================================
  // 🎨 TIER 4: IMAGE, DESIGN & CREATIVE (Updated Original + New)
  // =========================================================================
  { name: "Flux.1 Pro", categories: ["T2I", "I2I", "DES"], url: "https://blackforestlabs.ai/", scores: { "T2I": 0.99, "I2I": 0.97, "DES": 0.96 } },
  { name: "Midjourney v6.1", categories: ["T2I", "I2I", "DES"], url: "https://www.midjourney.com", scores: { "T2I": 0.98, "I2I": 0.96, "DES": 0.97 } },
  { name: "Recraft.ai v3", categories: ["T2I", "DES", "UI/UX", "VEC"], url: "https://www.recraft.ai/", scores: { "T2I": 0.94, "DES": 0.96, "UI/UX": 0.94, "VEC": 0.99 } },
  { name: "Ideogram 2.0", categories: ["T2I", "DES", "TYP"], url: "https://ideogram.ai", scores: { "T2I": 0.95, "DES": 0.94, "TYP": 0.99 } },
  { name: "Magnific.ai", categories: ["I2I", "UPS"], url: "https://magnific.ai/", scores: { "I2I": 0.98, "UPS": 0.99 } },
  { name: "Krea.ai", categories: ["T2I", "I2I", "T2V", "UPS"], url: "https://www.krea.ai/", scores: { "T2I": 0.93, "I2I": 0.95, "T2V": 0.91, "UPS": 0.94 } },
  { name: "Adobe Firefly", categories: ["T2I", "I2I", "DES"], url: "https://www.adobe.com/products/firefly", scores: { "T2I": 0.90, "I2I": 0.89, "DES": 0.93 } },
  { name: "Leonardo.ai", categories: ["T2I", "I2I", "ANI"], url: "https://leonardo.ai", scores: { "T2I": 0.92, "I2I": 0.90, "ANI": 0.88 } },
  { name: "Civitai", categories: ["T2I", "I2I", "USE"], url: "https://civitai.com/", scores: { "T2I": 0.96, "I2I": 0.95, "USE": 0.97 } },
  { name: "Canva Magic Studio", categories: ["DES", "T2I", "VID"], url: "https://www.canva.com", scores: { "DES": 0.96, "T2I": 0.88 } },
  { name: "Figma AI", categories: ["DES", "UI/UX"], url: "https://www.figma.com", scores: { "DES": 0.96, "UI/UX": 0.97 } },

  // =========================================================================
  // 🎙️ TIER 5: AUDIO, MUSIC & VOICE
  // =========================================================================
  { name: "ElevenLabs v2.5", categories: ["AUD", "T2S", "VCL", "S2S"], url: "https://elevenlabs.io/", scores: { "AUD": 0.99, "T2S": 0.99, "VCL": 0.99, "S2S": 0.98 } },
  { name: "Udio v1.5", categories: ["AUD", "MUS"], url: "https://udio.com", scores: { "AUD": 0.97, "MUS": 0.98 } },
  { name: "Suno v4", categories: ["AUD", "MUS"], url: "https://www.suno.ai", scores: { "AUD": 0.96, "MUS": 0.97 } },
  { name: "NotebookLM", categories: ["DOCS", "AUD", "RESEARCH", "PODCAST"], url: "https://notebooklm.google.com/", scores: { "DOCS": 0.99, "AUD": 0.99, "RESEARCH": 0.99, "PODCAST": 0.99 } },
  { name: "AIVA", categories: ["AUD", "MUS"], url: "https://www.aiva.ai", scores: { "AUD": 0.85, "MUS": 0.87 } },
  { name: "Ace Studio", categories: ["AUD", "MUS"], url: "https://acestudio.ai/", scores: { "AUD": 0.91, "MUS": 0.90 } },
  { name: "Beatoven.ai", categories: ["MUS", "AUD"], url: "https://www.beatoven.ai/", scores: { "MUS": 0.90, "AUD": 0.88 } },
  { name: "Lalal.ai", categories: ["AUD", "MUS", "VCL"], url: "https://www.lalal.ai", scores: { "AUD": 0.92, "MUS": 0.91, "VCL": 0.93 } },
  { name: "Weights", categories: ["AUD", "VCL"], url: "https://www.weights.gg/", scores: { "AUD": 0.95, "VCL": 0.94 } },

  // =========================================================================
  // 📚 TIER 6: ORIGINAL LIST (Select & Updated Modules)
  // =========================================================================
  { name: "Google AI Studio", categories: ["DEV", "ML", "INF"], url: "https://aistudio.google.com/", scores: { "DEV": 0.98, "ML": 0.97, "INF": 0.98 } },
  { name: "Replit Agent", categories: ["DEV", "LLM", "AGENT"], url: "https://replit.com", scores: { "DEV": 0.96, "LLM": 0.93, "AGENT": 0.95 } },
  { name: "Hugging Face Spaces", categories: ["DEV", "ML", "USE"], url: "https://huggingface.co/spaces", scores: { "DEV": 0.98, "ML": 0.99, "USE": 0.96 } },
  { name: "Adobe Premiere (Firefly)", categories: ["VID", "V2V"], url: "https://www.adobe.com/products/premiere", scores: { "VID": 0.95, "V2V": 0.90 } },
  { name: "Advanced Live Portrait", categories: ["ANI", "FCE"], url: "https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait", scores: { "ANI": 0.96, "FCE": 0.97 } },
  { name: "FacePoke", categories: ["FCE", "ANI"], url: "https://facepoke.org/", scores: { "FCE": 0.96, "ANI": 0.92 } },
  { name: "Artflow", categories: ["T2I", "FCE"], url: "https://app.artflow.ai/", scores: { "T2I": 0.78, "FCE": 0.90 } },
  { name: "Astria", categories: ["T2I", "I2I", "UPS"], url: "https://www.astria.ai", scores: { "T2I": 0.81, "I2I": 0.80, "UPS": 0.85 } },
  { name: "Beautiful.ai", categories: ["PRE", "DES"], url: "https://www.beautiful.ai", scores: { "PRE": 0.92, "DES": 0.90 } },
  { name: "Blender", categories: ["3D", "ANI", "DES"], url: "https://www.blender.org", scores: { "3D": 0.94, "ANI": 0.92, "DES": 0.90 } },
  { name: "Blockade Labs", categories: ["T2I", "3D"], url: "https://www.blockadelabs.com/", scores: { "T2I": 0.88, "3D": 0.91 } },
  { name: "CapCut Desktop", categories: ["VID", "V2V", "DES"], url: "https://www.capcut.com", scores: { "VID": 0.95, "V2V": 0.88, "DES": 0.85 } },
  { name: "Cinema 4D", categories: ["3D", "ANI", "DES"], url: "https://www.maxon.net/cinema-4d", scores: { "3D": 0.91, "ANI": 0.89, "DES": 0.87 } },
  { name: "Clipdrop", categories: ["I2I", "UPS", "USE"], url: "https://clipdrop.co/", scores: { "I2I": 0.93, "UPS": 0.92, "USE": 0.91 } },
  { name: "ComfyUI", categories: ["T2I", "I2I", "DEV"], url: "https://github.com/comfyanonymous/ComfyUI", scores: { "T2I": 0.98, "I2I": 0.97, "DEV": 0.96 } },
  { name: "CSM", categories: ["3D", "I23"], url: "http://3d.csm.ai", scores: { "3D": 0.84, "I23": 0.87 } },
  { name: "D-ID", categories: ["I2V", "FCE"], url: "https://studio.d-id.com", scores: { "I2V": 0.88, "FCE": 0.90 } },
  { name: "DaVinci Resolve", categories: ["V2V", "DES", "AUD"], url: "https://www.blackmagicdesign.com/products/davinciresolve", scores: { "V2V": 0.96, "DES": 0.95, "AUD": 0.94 } },
  { name: "Descript", categories: ["AUD", "V2V", "VCL"], url: "https://www.descript.com", scores: { "AUD": 0.93, "V2V": 0.89, "VCL": 0.92 } },
  { name: "Fadr", categories: ["AUD", "MUS"], url: "https://fadr.com/", scores: { "AUD": 0.93, "MUS": 0.85 } },
  { name: "Fooocus", categories: ["T2I", "USE", "I2I"], url: "https://github.com/lllyasviel/Fooocus", scores: { "T2I": 0.91, "USE": 0.95, "I2I": 0.93 } },
  { name: "Galileo AI", categories: ["UI/UX", "DES"], url: "https://www.usegalileo.ai/", scores: { "UI/UX": 0.94, "DES": 0.92 } },
  { name: "Gamma", categories: ["PRE", "LLM", "USE"], url: "https://gamma.app/", scores: { "PRE": 0.95, "LLM": 0.90, "USE": 0.94 } },
  { name: "Glif", categories: ["T2I", "USE", "I2I"], url: "https://glif.app/", scores: { "T2I": 0.92, "USE": 0.96, "I2I": 0.94 } },
  { name: "HeyGen", categories: ["I2V", "FCE", "T2V"], url: "https://www.heygen.com", scores: { "I2V": 0.96, "FCE": 0.95, "T2V": 0.93 } },
  { name: "InVision", categories: ["DES", "UI/UX"], url: "https://www.invisionapp.com", scores: { "DES": 0.86, "UI/UX": 0.88 } },
  { name: "InteriorAI", categories: ["DES", "I2I"], url: "https://interiorai.com/", scores: { "DES": 0.92, "I2I": 0.91 } },
  { name: "Jasper", categories: ["CON", "LLM", "USE"], url: "https://www.jasper.ai/", scores: { "CON": 0.91, "LLM": 0.89, "USE": 0.90 } },
  { name: "Kaedim", categories: ["3D", "DES"], url: "https://kaedim3d.com/", scores: { "3D": 0.90, "DES": 0.88 } },
  { name: "Meshy", categories: ["3D", "I23"], url: "http://www.meshy.ai", scores: { "3D": 0.93, "I23": 0.94 } },
  { name: "Miro AI", categories: ["DES", "UI/UX"], url: "https://miro.com/miro-ai/", scores: { "DES": 0.92, "UI/UX": 0.93 } },
  { name: "Napkin.ai", categories: ["PRE", "LLM", "USE"], url: "https://www.napkin.ai/", scores: { "PRE": 0.96, "LLM": 0.89, "USE": 0.94 } },
  { name: "OpenAI Whisper", categories: ["AUD", "S2T"], url: "https://github.com/openai/whisper", scores: { "AUD": 0.95, "S2T": 0.96 } },
  { name: "Pika 1.5", categories: ["T2V", "I2V", "ANI"], url: "https://pika.art", scores: { "T2V": 0.91, "I2V": 0.89, "ANI": 0.92 } },
  { name: "Pixverse", categories: ["T2V", "I2V", "ANI"], url: "https://pixverse.ai", scores: { "T2V": 0.88, "I2V": 0.90, "ANI": 0.89 } },
  { name: "Play.ht", categories: ["AUD", "T2S", "VCL"], url: "https://play.ht", scores: { "AUD": 0.91, "T2S": 0.93, "VCL": 0.91 } },
  { name: "RenderNet", categories: ["FCE", "CONSISTENCY"], url: "https://rendernet.ai/", scores: { "FCE": 0.93, "CONSISTENCY": 0.95 } },
  { name: "Resemble AI", categories: ["AUD", "VCL", "T2S"], url: "https://www.resemble.ai/", scores: { "AUD": 0.92, "VCL": 0.93, "T2S": 0.90 } },
  { name: "Scenario.gg", categories: ["T2I", "GAM"], url: "https://scenario.gg/", scores: { "T2I": 0.93, "GAM": 0.95 } },
  { name: "Shapr3D", categories: ["3D", "DES"], url: "https://www.shapr3d.com/", scores: { "3D": 0.92, "DES": 0.91 } },
  { name: "Spline AI", categories: ["3D", "DES", "WEB"], url: "https://spline.design/ai", scores: { "3D": 0.94, "DES": 0.93, "WEB": 0.95 } },
  { name: "Stable Audio", categories: ["AUD", "MUS"], url: "https://www.stableaudio.com", scores: { "AUD": 0.88, "MUS": 0.90 } },
  { name: "Stable Video", categories: ["T2V", "I2V"], url: "https://www.stablevideo.com/", scores: { "T2V": 0.90, "I2V": 0.89 } },
  { name: "Synthesia", categories: ["T2V", "ANI", "FCE"], url: "https://www.synthesia.io", scores: { "T2V": 0.93, "ANI": 0.91, "FCE": 0.92 } },
  { name: "Topaz Video AI 5", categories: ["VID", "UPS"], url: "https://www.topazlabs.com/video-ai", scores: { "VID": 0.96, "UPS": 0.97 } },
  { name: "Tripo SR / 3D", categories: ["3D", "I23"], url: "https://www.tripo3d.ai/", scores: { "3D": 0.95, "I23": 0.95 } },
  { name: "Upscayl", categories: ["UPS"], url: "https://upscayl.org/", scores: { "UPS": 0.92 } },
  { name: "Veed.io", categories: ["T2V", "I2V", "VID", "V2V"], url: "https://www.veed.io", scores: { "T2V": 0.85, "I2V": 0.84, "VID": 0.91, "V2V": 0.87 } },
  { name: "VideoLeap", categories: ["T2I", "T2V", "I2I", "V2V"], url: "https://www.videoleapapp.com/", scores: { "T2I": 0.82, "T2V": 0.85, "I2I": 0.84, "V2V": 0.91 } },
  { name: "Vidu", categories: ["CON", "T2V", "V2V"], url: "https://vidu.ai", scores: { "CON": 0.86, "T2V": 0.88, "V2V": 0.85 } },
  { name: "Vizcom", categories: ["I2I"], url: "https://www.vizcom.ai/", scores: { "I2I": 0.94 } },
  { name: "Zapier AI", categories: ["AUTOMATION", "USE"], url: "https://zapier.com/ai", scores: { "AUTOMATION": 0.98, "USE": 0.97 } },
  { name: "Zoho Zia", categories: ["LLM", "CRM"], url: "https://www.zoho.com/zia/", scores: { "LLM": 0.88, "CRM": 0.90 } },
  
  // =========================================================================
  // 💼 TIER 7: NICHE BUSINESS & UTILITY (From Original)
  // =========================================================================
  { name: "AdCreative.ai", categories: ["DES", "CON"], url: "https://www.adcreative.ai", scores: { "DES": 0.92, "CON": 0.88 } },
  { name: "Akkio", categories: ["ML", "USE"], url: "https://www.akkio.com/", scores: { "ML": 0.90, "USE": 0.88 } },
  { name: "Anyword", categories: ["CON", "LLM"], url: "https://anyword.com/", scores: { "CON": 0.90, "LLM": 0.88 } },
  { name: "AssemblyAI", categories: ["AUD", "S2T"], url: "https://www.assemblyai.com/", scores: { "AUD": 0.88, "S2T": 0.90 } },
  { name: "Browse.ai", categories: ["USE", "AUTOMATION"], url: "https://browse.ai/", scores: { "USE": 0.92, "AUTOMATION": 0.91 } },
  { name: "Copy.ai", categories: ["CON", "LLM"], url: "https://www.copy.ai/", scores: { "CON": 0.90, "LLM": 0.89 } },
  { name: "DataRobot", categories: ["ML", "USE"], url: "https://www.datarobot.com/", scores: { "ML": 0.93, "USE": 0.88 } },
  { name: "DeepL", categories: ["LLM", "TRANS"], url: "https://www.deepl.com", scores: { "LLM": 0.89, "TRANS": 0.99 } },
  { name: "Fireflies.ai", categories: ["AUD", "S2T"], url: "https://fireflies.ai/", scores: { "AUD": 0.92, "S2T": 0.92 } },
  { name: "Gong.io", categories: ["SALES", "USE"], url: "https://www.gong.io/", scores: { "SALES": 0.96, "USE": 0.92 } },
  { name: "Grammarly", categories: ["LLM", "USE"], url: "https://www.grammarly.com", scores: { "LLM": 0.92, "USE": 0.95 } },
  { name: "Harvey AI", categories: ["LEGAL", "LLM"], url: "https://www.harvey.ai/", scores: { "LEGAL": 0.98, "LLM": 0.94 } },
  { name: "HubSpot AI", categories: ["CRM", "MARKETING"], url: "https://www.hubspot.com/ai", scores: { "CRM": 0.94, "MARKETING": 0.93 } },
  { name: "LangChain", categories: ["LLM", "DEV"], url: "https://langchain.com/", scores: { "LLM": 0.92, "DEV": 0.96 } },
  { name: "Make", categories: ["AUTOMATION", "USE"], url: "https://www.make.com/", scores: { "AUTOMATION": 0.97, "USE": 0.95 } },
  { name: "Otter.ai", categories: ["AUD", "S2T"], url: "https://otter.ai/", scores: { "AUD": 0.93, "S2T": 0.92 } },
  { name: "Pinecone", categories: ["LLM", "VDB"], url: "https://www.pinecone.io/", scores: { "LLM": 0.90, "VDB": 0.98 } },
  { name: "Salesforce Einstein", categories: ["CRM", "LLM"], url: "https://www.salesforce.com/products/einstein/", scores: { "CRM": 0.95, "LLM": 0.90 } },
  { name: "Scale AI", categories: ["DATA", "ML"], url: "https://scale.com/", scores: { "DATA": 0.98, "ML": 0.95 } },
  { name: "Surfer SEO", categories: ["CON", "SEO"], url: "https://surferseo.com/", scores: { "CON": 0.89, "SEO": 0.95 } },
  { name: "Tome", categories: ["PRE", "LLM"], url: "https://tome.app/", scores: { "PRE": 0.92, "LLM": 0.90 } },
  { name: "Weaviate", categories: ["LLM", "VDB"], url: "https://weaviate.io/", scores: { "LLM": 0.89, "VDB": 0.97 } },
  { name: "Zapier", categories: ["AUTOMATION", "USE"], url: "https://zapier.com", scores: { "AUTOMATION": 0.98, "USE": 0.97 } }
];
