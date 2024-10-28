class AIModule {
    constructor(name, categories, url, scores = {}) {
        this.name = name;
        this.categories = categories;
        this.url = url;
        this.scores = scores;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.visible = true;
        this.scale = 1;
        this.opacity = 1;
    }

    getAverageScore(selectedCategories) {
        if (selectedCategories.has('all')) return 1;
        let totalScore = 0;
        let count = 0;
        selectedCategories.forEach(category => {
            if (this.scores[category]) {
                totalScore += this.scores[category];
                count++;
            }
        });
        return count > 0 ? totalScore / count : 0;
    }
}

class ModuleCloud {
    constructor() {
        this.canvas = document.getElementById('moduleCloud');
        this.ctx = this.canvas.getContext('2d');
        this.modules = [];
        this.rotation = { x: 0.001, y: 0.001 };
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        this.selectedCategories = new Set(['all']);
        this.hoveredModule = null;
        this.isLightMode = false;
        this.tooltip = document.getElementById('tooltip');
        this.cloudSpread = 300; // Increased spread for more cloud-like appearance
        
        this.initializeCanvas();
        this.loadModules();
        this.setupEventListeners();
        this.updateMode();
        this.animate();
    }

    initializeCanvas() {
        const updateSize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', updateSize);
        updateSize();
    }

    loadModules() {
        const moduleData = [

// Large Language Models (LLM)
	{ name: "ChatGPT", categories: ["LLM", "USE"], url: "https://chat.openai.com", scores: { "LLM": 0.90, "USE": 0.85 } },
	{ name: "Claude", categories: ["LLM", "USE"], url: "https://claude.ai", scores: { "LLM": 0.95, "USE": 0.9 } },
	{ name: "BERT", categories: ["LLM"], url: "https://huggingface.co/bert", scores: { "LLM": 0.85 } },
	{ name: "LaMDA", categories: ["LLM"], url: "https://ai.google/research/pubs/archive/2021/la-mda.pdf", scores: { "LLM": 0.87 } },
	{ name: "PaLM", categories: ["LLM"], url: "https://ai.google/research/pubs/archive/2022/palm.pdf", scores: { "LLM": 0.88 } },
	{ name: "Groq", categories: ["LLM", "USE"], url: "https://groq.com/", scores: { "LLM": 0.98, "USE": 0.9 } },
	{ name: "Bard", categories: ["LLM", "USE"], url: "https://bard.google.com", scores: { "LLM": 0.85, "USE": 0.75 } },
		
// AI Tools (USE)
	{ name: "Grammarly", categories: ["LLM", "USE"], url: "https://www.grammarly.com/", scores: { "LLM": 0.95, "USE": 0.9 } },
	{ name: "Copy.ai", categories: ["USE"], url: "https://www.copy.ai", scores: { "USE": 0.87 } },
	{ name: "Otter.ai", categories: ["USE", "AUD"], url: "https://otter.ai", scores: { "USE": 0.86, "AUD": 0.88 } },
	{ name: "Notion AI", categories: ["USE"], url: "https://www.notion.so/product/ai", scores: { "USE": 0.84 } },
	{ name: "Remove.bg", categories: ["USE"], url: "https://www.remove.bg/", scores: { "USE": 0.91 } },
	{ name: "IDM-Vton", categories: ["USE"], url: "https://huggingface.co/spaces/yisol/IDM-VTON", scores: { "USE": 0.94 } },

// Text to Image (T2I)
	{ name: "DALL-E 3", categories: ["T2I", "I2I", "DES"], url: "https://openai.com/dall-e-3", scores: { "T2I": 0.85, "I2I": 0.8, "DES": 0.85 } },
	{ name: "Midjourney", categories: ["T2I", "I2I", "DES"], url: "https://www.midjourney.com", scores: { "T2I": 0.92, "I2I": 0.88, "DES": 0.90 } },
	{ name: "Stable Diffusion", categories: ["T2I", "I2I", "ANI"], url: "https://huggingface.co/spaces/stabilityai/stable-diffusion", scores: { "T2I": 0.88, "I2I": 0.85, "ANI": 0.80 } },
	{ name:	"Fooocus", categories: ["T2I", "I2I", "UPS"], url: "https://colab.research.google.com/github/lllyasviel/Fooocus/blob/main/fooocus_colab.ipynb", scores: { "T2I": 0.88, "I2I": 0.92, "UPS": 0.95 } },
	{ name:	"Artflow", categories: ["T2I", "FCE"], url: "https://app.artflow.ai/", scores: { "T2I": 0.78, "FCE": 0.94 } },
	{ name: "Leonardo.ai", categories: ["T2I", "I2I", "ANI"], url: "https://leonardo.ai", scores: { "T2I": 0.86, "I2I": 0.84, "ANI": 0.78 } },
	{ name: "Ideogram", categories: ["T2I", "DES"], url: "https://ideogram.ai", scores: { "T2I": 0.83, "DES": 0.85 } },
	{ name: "Adobe Firefly", categories: ["T2I", "I2I", "DES"], url: "https://www.adobe.com/products/firefly", scores: { "T2I": 0.87, "I2I": 0.85, "DES": 0.89 } },
	{ name: "Imagen", categories: ["T2I"], url: "https://imagen.research.google/", scores: { "T2I": 0.85 } },
	{ name: "Canva", categories: ["T2I", "DES", "ANI"], url: "https://www.canva.com/your-apps/text-to-image", scores: { "T2I": 0.80, "DES": 0.88, "ANI": 0.75 } },
	{ name: "PhotoMaker", categories: ["T2I", "I2I", "FCE", ], url: "https://huggingface.co/spaces/TencentARC/PhotoMaker", scores: { "T2I": 0.82, "I2I": 0.84, "FCE": 0.86, } },
	{ name: "Astria", categories: ["T2I", "I2I", "UPS"], url: "https://www.astria.ai", scores: { "T2I": 0.81, "I2I": 0.79, "UPS": 0.85 } },
	{ name: "Sana", categories: ["T2I"], url: "https://sana-gen.mit.edu/", scores: { "T2I": 0.78 } },

// Image to Image (I2I)
	{ name: "Krea.ai", categories: ["T2I", "I2I", "T2V", "FCE", "I2V", "V2V", "ANI", "UPS"], url: "https://www.krea.ai/", scores: { "T2I": 0.88, "I2I": 0.92, "T2V": 0.90, "FCE": 0.91, "I2V": 0.90, "V2V": 0.91, "ANI": 0.91, "UPS": 0.91 } },
	{ name: "Vizcom", categories: ["I2I"], url: "https://www.vizcom.ai/", scores: { "I2I": 0.92 } },
	{ name: "newarc", categories: ["I2I"], url: "https://www.newarc.ai/", scores: { "I2I": 0.94 } },

// Text to Video (T2V)
	{ name: "HaliuoAI", categories: ["T2V", "I2V"], url: "https://hailuoai.com/video", scores: { "T2V": 0.82, "I2V": 0.80 } },
	{ name: "Kling.ai", categories: ["T2V", "I2V"], url: "https://klingai.com", scores: { "T2V": 0.79, "I2V": 0.77 } },
	{ name: "RunwayML", categories: ["T2I", "I2I", "T2V", "FCE", "I2V", "V2V", "ANI"], url: "https://runwayml.com", scores: { "T2I": 0.86, "I2I": 0.84, "T2V": 0.88, "FCE": 0.85, "I2V": 0.87, "V2V": 0.86, "ANI": 0.83 } },
	{ name: "Pika Labs", categories: ["T2V", "I2V", "ANI"], url: "https://pika.art", scores: { "T2V": 0.85, "I2V": 0.83, "ANI": 0.81 } },
	{ name: "Noisee.ai", categories: ["T2V", "USE"], url: "https://noisee.ai/", scores: { "T2V": 0.92, "USE": 0.84 } },
	{ name: "Kaiber", categories: ["T2V", "I2V", "ANI", "MUS"], url: "https://kaiber.ai", scores: { "T2V": 0.84, "I2V": 0.82, "ANI": 0.80, "MUS": 0.78 } },
	{ name: "Meta's Make-A-Video", categories: ["T2V", "I2V"], url: "https://makeavideo.studio", scores: { "T2V": 0.83, "I2V": 0.81 } },
	{ name: "Synthesia", categories: ["T2V", "ANI", "FCE"], url: "https://www.synthesia.io", scores: { "T2V": 0.86, "ANI": 0.84, "FCE": 0.87 } },
	{ name: "Stable Video", categories: ["T2V", "I2V"], url: "https://www.stablevideo.com/", scores: { "T2V": 0.89, "I2V": 0.89 } },
	{ name: "Lumen5", categories: ["T2V", "VID"], url: "https://lumen5.com/", scores: { "T2V": 0.77, "VID": 0.78 } },
	{ name: "Veed.io", categories: ["T2V", "I2V", "VID", "V2V", "DES"], url: "https://www.veed.io", scores: { "T2V": 0.82, "I2V": 0.81, "VID": 0.83,"V2V": 0.84, "DES": 0.83 } },
	{ name: "Fliki", categories: ["T2V"], url: "https://fliki.ai/", scores: { "T2V": 0.89 } },
	{ name: "Kaps", categories: ["USE"], url: "https://kaps.co.il", scores: { "T2V": 0.79, "I2V": 0.77, "ANI": 0.78, "Face Swap": 0.80 } },
	{ name: "Sora", categories: ["T2V", "I2V", "ANI"], url: "https://openai.com/sora", scores: { "T2V": 0.90, "I2V": 0.88, "ANI": 0.89 } },

// Image to Video (I2V)
	{ name: "Hedra", categories: ["FCE"], url: "https://www.hedra.com/", scores: { "FCE": 0.95 } },
	{ name: "Pixverse", categories: ["T2V", "I2V", "ANI"], url: "https://pixverse.ai", scores: { "T2V": 0.81, "I2V": 0.88, "ANI": 0.89, } },
	{ name: "D-ID", categories: ["I2V", "FCE"], url: "https://studio.d-id.com", scores: { "I2V": 0.85, "FCE": 0.87 } },
	{ name: "Luma Labs", categories: ["T2V", "I2V", "ANI"], url: "https://lumalabs.ai", scores: { "T2V": 0.92, "I2V": 0.84, "ANI": 0.82 } },
	{ name: "Deep Dream Generator", categories: ["I2V", "T2I", "I2I"], url: "https://deepdreamgenerator.com", scores: { "I2V": 0.79, "T2I": 0.81, "I2I": 0.80 } },
	{ name: "EbSynth", categories: ["V2V"], url: "https://ebsynth.com/", scores: { "V2V": 0.88 } },
		
// Video Repaint (V2V)
	{ name: "Domo", categories: ["T2V", "ANI", "V2V", "FCE"], url: "https://domo.com", scores: { "T2V": 0.80, "ANI": 0.78, "V2V": 0.92, "FCE": 0.82 } },
	{ name: "CapCut", categories: ["V2V", "DES", "ANI"], url: "https://www.capcut.com", scores: { "V2V": 0.85, "DES": 0.83, "ANI": 0.81 } },
	{ name: "Stable Video Diffusion", categories: ["V2V", "I2V", "ANI"], url: "https://huggingface.co/stabilityai/stable-video-diffusion-img2vid", scores: { "V2V": 0.87, "I2V": 0.86, "ANI": 0.84 } },
	{ name: "DaVinci Resolve", categories: ["V2V", "DES", "AUD"], url: "https://www.blackmagicdesign.com/products/davinciresolve", scores: { "V2V": 0.89, "DES": 0.88, "AUD": 0.87 } },
	{ name: "Adobe Premiere", categories: ["VID", "V2V" ], url: "https://www.adobe.com/products/premiere", scores: { "VID": 0.94, "V2V": 0.80 } },

// 3D Tools (3D)
	{ name: "Point-E", categories: ["3D", "T2I"], url: "https://huggingface.co/spaces/openai/point-e", scores: { "3D": 0.82, "T2I": 0.80 } },
	{ name: "GET3D", categories: ["3D", "T2I", "ANI"], url: "https://github.com/nvidia/GET3D", scores: { "3D": 0.85, "T2I": 0.83, "ANI": 0.81 } },
	{ name: "Blender", categories: ["3D", "ANI", "DES"], url: "https://www.blender.org", scores: { "3D": 0.92, "ANI": 0.90, "DES": 0.88 } },
	{ name: "Cinema 4D", categories: ["3D", "ANI", "DES"], url: "https://www.maxon.net/cinema-4d", scores: { "3D": 0.91, "ANI": 0.89, "DES": 0.87 } },

// Design (DES)
	{ name: "Figma", categories: ["DES", "UI/UX"], url: "https://www.figma.com", scores: { "DES": 0.93, "UI/UX": 0.95 } },
	{ name: "Framer", categories: ["DES", "UI/UX"], url: "https://www.framer.com", scores: { "DES": 0.89, "UI/UX": 0.91 } },
	{ name: "Sketch", categories: ["DES", "UI/UX"], url: "https://www.sketch.com", scores: { "DES": 0.88, "UI/UX": 0.90 } },
	{ name: "InVision", categories: ["DES", "UI/UX"], url: "https://www.invisionapp.com", scores: { "DES": 0.86, "UI/UX": 0.88 } },
	{ name: "InteriorAI", categories: ["DES", "I2I"], url: "https://interiorai.com/", scores: { "DES": 0.91, "I2I": 0.9 } },
	{ name: "Adobe XD", categories: ["DES", "UI/UX"], url: "https://www.adobe.com/products/xd", scores: { "DES": 0.87, "UI/UX": 0.89 } },

//Upscale/Enhance (UPS)
	{ name: "Magnific.ai", categories: ["I2I", "UPS"], url: "https://magnific.ai/", scores: { "I2I": 0.99, "UPS": 0.97 } },
	{ name: "DBG Upscale", categories: ["UPS"], url: "https://dgb.lol/ai-image-upscaler", scores: { "UPS": 0.78 } },
	{ name: "Upscayl", categories: ["UPS"], url: "https://upscayl.org/", scores: { "UPS": 0.88 } },
	{ name: "Topaz Gigapixel AI", categories: ["UPS"], url: "https://www.topazlabs.com/gigapixel-ai", scores: { "UPS": 0.93 } },
	{ name: "Let's Enhance", categories: ["UPS"], url: "https://letsenhance.io/", scores: { "UPS": 0.90 } },
	{ name: "Pixelmator Pro", categories: ["UPS", "DES"], url: "https://www.pixelmator.com/pro/", scores: { "UPS": 0.77, "DES": 0.81 } },
		
// Audio (AUD)
	{ name: "Descript", categories: ["AUD", "T2S", "S2T", "VCL"], url: "https://www.descript.com", scores: { "AUD": 0.87, "T2S": 0.85, "S2T": 0.86, "VCL": 0.86 } },
	{ name: "Lalal.ai", categories: ["AUD", "MUS", "VCL"], url: "https://www.lalal.ai", scores: { "AUD": 0.88, "MUS": 0.87, "VCL": 0.89 } },
	{ name: "Boomy", categories: ["AUD", "MUS"], url: "https://boomy.com/", scores: { "AUD": 0.81, "MUS": 0.80 } },
	{ name: "Adobe Podcast", categories: ["AUD" ], url: "https://podcast.adobe.com/", scores: { "AUD": 0.92 } },
	{ name: "Ace Studio", categories: ["AUD", "MUS"], url: "https://acestudio.ai/", scores: { "AUD": 0.91, "MUS": 0.90 } },
	{ name: "Fadr", categories: ["AUD", "MUS"], url: "https://fadr.com/", scores: { "AUD": 0.93, "MUS": 0.75 } },
	{ name: "AIVA", categories: ["AUD", "MUS"], url: "https://www.aiva.ai", scores: { "AUD": 0.85, "MUS": 0.87 } },
	{ name: "Mubert", categories: ["AUD", "MUS"], url: "https://mubert.com", scores: { "AUD": 0.84, "MUS": 0.86 } },

// Video Tools (VID)
	{ name: "WiseCut", categories: ["VID"], url: "https://app.wisecut.ai/", scores: { "VID": 0.88 } },
	{ name: "Kapwing", categories: ["VID"], url: "https://www.kapwing.com/", scores: { "VID": 0.82 } },
 	{ name: "DeepDreamGenerator", categories: ["VID"], url: "https://deepdreamgenerator.com/", scores: { "VID": 0.84 } },
 	{ name: "Haiper", categories: ["T2V", "I2V", "VID"], url: "https://haiper.ai/", scores: { "T2V": 0.82, "I2V": 0.9, "VID": 0.92 } },
 	{ name: "muse.ai", categories: ["VID"], url: "https://muse.ai/", scores: { "VID": 0.92 } },
 	{ name: "Magichour.ai", categories: ["T2I", "T2V", "I2I", "I2V", "VID"], url: "https://magichour.ai/", scores: { "T2I": 0.82, "T2V": 0.85, "I2I": 0.87, "I2V": 0.89,"VID": 0.90 } },
 	{ name: "VideoLeap", categories: ["T2I", "T2V", "I2I", "V2V", "I2V", "VID"], url: "https://www.videoleapapp.com/", scores: { "T2I": 0.79, "T2V": 0.80, "I2I": 0.80, "V2V": 0.9, "I2V": 0.82,"VID": 0.90 } },
	{ name: "Filmora", categories: ["VID"], url: "https://filmora.wondershare.com/", scores: { "VID": 0.87 } },
		
// User Interface/User Experience Design (UX/UI)
	{ name: "Mobirise", categories: ["LLM", "USE", "UI/UX"], url: "https://www.grammarly.com/", scores: { "LLM": 0.95, "USE": 0.9, "UI/UX": 0.9 } },
	{ name: "Axure RP", categories: ["UI/UX"], url: "https://www.axure.com/", scores: { "UI/UX": 0.89 } },
		
// Animation (ANI)
	{ name: "Live Portrait", categories: ["ANI", "FCE"], url: "https://liveportrait.app/", scores: { "ANI": 0.95, "FCE": 0.96 } },
	{ name: "Toon Boom Harmony", categories: ["ANI"], url: "https://www.toonboom.com/products/harmony", scores: { "ANI": 0.91 } },
		
// Face Editing (FCE)
	{ name: "Advanced Live Portrait", categories: ["ANI", "FCE"], url: "https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait", scores: { "FCE": 0.96 } },
	{ name: "FacePoke", categories: ["FCE"], url: "https://facepoke.org/", scores: { "FCE": 0.96 } },
	{ name: "ReShot", categories: ["FCE"], url: "https://www.reshot.ai/", scores: { "FCE": 0.95 } },
	{ name: "D-ID", categories: ["T2V"], url: "https://www.d-id.com/", scores: { "T2V": 0.87 } },
	{ name: "Reface", categories: ["FCE", "V2V"], url: "https://reface.ai/", scores: { "FCE": 0.89, "V2V": 0.87 } },
	{ name: "FaceSwap", categories: ["FCE", "V2V"], url: "https://faceswap.dev/", scores: { "FCE": 0.86, "V2V": 0.85 } },
	{ name: "FaceApp", categories: ["FCE"], url: "https://www.faceapp.com/", scores: { "FCE": 0.88 } },
	{ name: "Facetune", categories: ["FCE"], url: "https://www.facetuneapp.com/", scores: { "FCE": 0.87 } },

// AI Search (SEA)
	{ name: "Perplexity", categories: ["LLM", "USE", "SEA"], url: "https://perplexity.ai", scores: { "LLM": 0.97, "USE": 0.8, "SEA": 0.92 } },
	{ name: "You.com", categories: ["SEA"], url: "https://you.com/", scores: { "SEA": 0.88 } },
		
// Content Generation (CON)
	{ name: "Jasper", categories: ["CON", "LLM", "USE"], url: "https://www.jasper.ai/", scores: { "CON": 0.82, "LLM": 0.80, "USE": 0.79 } },
	{ name: "Vidu", categories: ["CON", "T2V", "V2V", "ANI", "I2V"], url: "https://vidu.ai", scores: { "CON": 0.86, "T2V": 0.81, "V2V": 0.79, "ANI":0.9,"I2V": 0.94 } },
	{ name: "Hour One", categories: ["T2V"], url: "https://hourone.ai/", scores: { "T2V": 0.87 } },
	{ name: "Writesonic", categories: ["CON"], url: "https://writesonic.com/", scores: { "CON": 0.88 } },
	{ name: "Rytr", categories: ["CON"], url: "https://rytr.me/", scores: { "CON": 0.87 } },
		
// Presentation Creation (PRE)
	{ name: "Gamma", categories: ["PRE", "LLM", "USE"], url: "https://gamma.app/", scores: { "PRE": 0.92, "LLM": 0.88, "USE": 0.92 } },
	{ name: "Beautiful.ai", categories: ["PRE"], url: "https://www.beautiful.ai/", scores: { "PRE": 0.89 } },
	{ name: "Slidebean", categories: ["PRE"], url: "https://slidebean.com/", scores: { "PRE": 0.88 } },
	{ name: "Pitch", categories: ["PRE"], url: "https://pitch.com/", scores: { "PRE": 0.87 } },
	{ name: "Prezi", categories: ["PRE"], url: "https://prezi.com/", scores: { "PRE": 0.86 } },
	{ name: "Napkin.ai", categories: ["PRE"], url: "https://www.napkin.ai/", scores: { "PRE": 0.92 } },
	{ name: "Flowchart.ai", categories: ["PRE"], url: "https://whimsical.com/ai/ai-text-to-flowchart", scores: { "PRE": 0.92 } },

// Image To 3D (I23)
	{ name: "Polycam", categories: ["I23"], url: "https://poly.cam/", scores: { "I23": 0.88 } },
	{ name: "CSM", categories: ["3D", "I23"], url: "http://3d.csm.ai", scores: { "3D": 0.84, "I23": 0.87 } },
	{ name: "Meshy", categories: ["3D", "I23"], url: "http://www.meshy.ai", scores: { "3D": 0.83, "I23": 0.85 } },	
	{ name: "ZoeDepth", categories: ["3D", "I23"], url: "https://huggingface.co/spaces/shariqfarooq/ZoeDepth", scores: { "3D": 0.83, "I23": 0.81 } },
		
// Text To Speech (T2S)
	{ name: "Narakeet", categories: ["T2S", "AUD"], url: "https://www.narakeet.com/", scores: { "T2S": 0.92, "AUD": 0.90 } },
        { name: "Bark", categories: ["AUD", "T2S"], url: "https://huggingface.co/spaces/suno/bark", scores: { "AUD": 0.80, "T2S": 0.92 } },

// Speech To Text (S2T)
	{ name: "OpenAI Whisper", categories: ["AUD", "S2T"], url: "https://github.com/openai/whisper", scores: { "AUD": 0.90, "S2T": 0.92 } },
	
// Voice Cloning (VCL)
	{ name: "ElevenLabs", categories: ["AUD", "T2S", "VCL"], url: "https://elevenlabs.io", scores: { "AUD": 0.89, "T2S": 0.91, "VCL": 0.90 } },
	{ name: "Play.ht", categories: ["AUD", "T2S", "VCL"], url: "https://play.ht", scores: { "AUD": 0.86, "T2S": 0.88, "VCL": 0.87 } },
	{ name: "Weights", categories: ["AUD", "VCL"], url: "https://www.weights.gg/", scores: { "AUD": 0.95, "VCL": 0.94 } },

//Music Generation (MUS)
	{ name: "Suno.ai", categories: ["AUD", "MUS"], url: "https://www.suno.ai", scores: { "AUD": 0.86, "MUS": 0.88 } },
	{ name: "Udio.ai", categories: ["AUD", "MUS"], url: "https://udio.com", scores: { "AUD": 0.83, "MUS": 0.85 } },
	{ name: "Stable Audio", categories: ["AUD", "MUS"], url: "https://www.stableaudio.com", scores: { "AUD": 0.85, "MUS": 0.87 } },
	{ name: "Amper Music", categories: ["MUS"], url: "https://www.ampermusic.com/", scores: { "MUS": 0.86 } }
	];
	    
        moduleData.forEach(data => {
            const module = new AIModule(data.name, data.categories, data.url, data.scores);
            this.positionModuleInCloud(module);
            this.modules.push(module);
        });
    }

    positionModuleInCloud(module) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = this.cloudSpread + (Math.random() * 100);

        module.x = radius * Math.sin(phi) * Math.cos(theta);
        module.y = radius * Math.sin(phi) * Math.sin(theta);
        module.z = radius * Math.cos(phi);
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));

        document.querySelectorAll('.sidebar button').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = button.dataset.category;
                if (e.shiftKey) {
                    if (this.selectedCategories.has(category)) {
                        this.selectedCategories.delete(category);
                    } else {
                        this.selectedCategories.add(category);
                    }
                } else {
                    this.selectedCategories.clear();
                    this.selectedCategories.add(category);
                }
                this.updateActiveButtons();
                this.filterModules();
            });
        });

        const toggleButton = document.getElementById('toggleMode');
        toggleButton.addEventListener('click', () => {
            this.isLightMode = !this.isLightMode;
            this.updateMode();
            toggleButton.textContent = this.isLightMode ? '🌙' : '☀️';
        });
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.isDragging = true;
        this.lastMousePos = { x: touch.clientX, y: touch.clientY };
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (this.isDragging) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - this.lastMousePos.x;
            const deltaY = touch.clientY - this.lastMousePos.y;
            this.rotation.x += deltaY * 0.005;
            this.rotation.y += deltaX * 0.005;
            this.lastMousePos = { x: touch.clientX, y: touch.clientY };
        }
    }

    handleTouchEnd() {
        this.isDragging = false;
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.lastMousePos = { x: e.clientX, y: e.clientY };
        this.canvas.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (this.isDragging) {
            const deltaX = e.clientX - this.lastMousePos.x;
            const deltaY = e.clientY - this.lastMousePos.y;
            this.rotation.x += deltaY * 0.005;
            this.rotation.y += deltaX * 0.005;
            this.lastMousePos = { x: e.clientX, y: e.clientY };
        }

        const hoveredModule = this.getHoveredModule(mouseX, mouseY);
        if (hoveredModule !== this.hoveredModule) {
            this.hoveredModule = hoveredModule;
            if (hoveredModule) {
                this.showTooltip(e.clientX, e.clientY, hoveredModule);
            } else {
                this.hideTooltip();
            }
        } else if (hoveredModule) {
            this.updateTooltipPosition(e.clientX, e.clientY);
        }
    }

    handleMouseUp() {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }

    handleDoubleClick() {
        if (this.hoveredModule) {
            window.open(this.hoveredModule.url, '_blank');
        }
    }

    showTooltip(x, y, module) {
        const scores = Object.entries(module.scores)
            .filter(([category]) => this.selectedCategories.has(category))
            .map(([category, score]) => `${category}: ${Math.round(score * 100)}%`)
            .join('<br>');

        this.tooltip.innerHTML = `
            <strong>${module.name}</strong><br>
            ${scores ? `<small>${scores}</small>` : ''}
        `;
        this.tooltip.style.opacity = '1';
        this.updateTooltipPosition(x, y);
    }

    updateTooltipPosition(x, y) {
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const padding = 10;
        
        let posX = x + padding;
        let posY = y + padding;

        if (posX + tooltipRect.width > window.innerWidth) {
            posX = x - tooltipRect.width - padding;
        }
        if (posY + tooltipRect.height > window.innerHeight) {
            posY = y - tooltipRect.height - padding;
        }

        this.tooltip.style.left = `${posX}px`;
        this.tooltip.style.top = `${posY}px`;
    }

    hideTooltip() {
        this.tooltip.style.opacity = '0';
    }

    filterModules() {
        this.modules.forEach(module => {
            const score = module.getAverageScore(this.selectedCategories);
            module.visible = score > 0;
            module.scale = 0.5 + (score * 0.5);
            module.opacity = 0.3 + (score * 0.7);
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.isDragging) {
            this.rotation.x += 0.001;
            this.rotation.y += 0.001;
        }

        const sortedModules = this.modules
            .map(module => {
                const rotated = this.rotatePoint(module.x, module.y, module.z);
                return { ...module, rotated, depth: rotated.z };
            })
            .sort((a, b) => b.depth - a.depth);

        sortedModules.forEach(module => {
            if (!module.visible) return;

            const scale = (1000 / (1000 + module.rotated.z)) * module.scale;
            const x = module.rotated.x * scale + this.canvas.width / 2;
            const y = module.rotated.y * scale + this.canvas.height / 2;

            if (module.rotated.z > -1000) {
                this.ctx.font = `${16 * scale}px Inter`;
                this.ctx.fillStyle = this.isLightMode ? 
                    `rgba(0, 0, 0, ${module.opacity})` : 
                    `rgba(255, 255, 255, ${module.opacity})`;
                
                const text = module.name;
                const metrics = this.ctx.measureText(text);
                this.ctx.fillText(text, x - metrics.width / 2, y);
            }
        });

        requestAnimationFrame(this.animate.bind(this));
    }

    rotatePoint(x, y, z) {
        let newX = x * Math.cos(this.rotation.y) - z * Math.sin(this.rotation.y);
        let newZ = x * Math.sin(this.rotation.y) + z * Math.cos(this.rotation.y);
        let newY = y * Math.cos(this.rotation.x) - newZ * Math.sin(this.rotation.x);
        newZ = y * Math.sin(this.rotation.x) + newZ * Math.cos(this.rotation.x);

        return { x: newX, y: newY, z: newZ };
    }

    getHoveredModule(mouseX, mouseY) {
        for (const module of this.modules) {
            if (!module.visible) continue;

            const rotated = this.rotatePoint(module.x, module.y, module.z);
            const scale = (1000 / (1000 + rotated.z)) * module.scale;
            const x = rotated.x * scale + this.canvas.width / 2;
            const y = rotated.y * scale + this.canvas.height / 2;

            this.ctx.font = `${16 * scale}px Inter`;
            const metrics = this.ctx.measureText(module.name);
            const width = metrics.width;
            const height = 16 * scale;

            if (
                mouseX >= x - width / 2 &&
                mouseX <= x + width / 2 &&
                mouseY >= y - height / 2 &&
                mouseY <= y + height / 2
            ) {
                return module;
            }
        }
        return null;
    }

    updateActiveButtons() {
        document.querySelectorAll('.sidebar button').forEach(button => {
            button.classList.toggle('active', 
                this.selectedCategories.has(button.dataset.category)
            );
        });
    }

    updateMode() {
        document.body.classList.toggle('light-mode', this.isLightMode);
    }
}

// Initialize the application
new ModuleCloud();
