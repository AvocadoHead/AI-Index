// Updated script.js
class AIModule {
    constructor(name, categories, url) {
        this.name = name;
        this.categories = categories;
        this.url = url;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.visible = true;
    }
}

class ModuleCloud {
    constructor() {
        this.canvas = document.getElementById('moduleCloud');
        this.ctx = this.canvas.getContext('2d');
        this.modules = [];
        this.rotation = { x: 0.005, y: 0.005 }; // Slow automatic rotation for a gentle spin
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        this.selectedCategories = new Set(['all']);
        this.hoveredModule = null;
        this.isLightMode = false;

        this.initializeCanvas();
        this.loadModules();
        this.setupEventListeners();
        this.updateMode();
        this.animate();
    }

    initializeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.updateMode();
        });
    }
    loadModules() {const moduleData = [
    // Large Language Models (LLM)
    { name: "ChatGPT", categories: ["LLM", "AI"], url: "https://chat.openai.com" },
    { name: "Claude", categories: ["LLM", "AI"], url: "https://claude.ai" },
    { name: "Perplexity", categories: ["LLM", "AI"], url: "https://perplexity.ai" },
    { name: "Anthropic", categories: ["LLM", "AI"], url: "https://anthropic.com" },
    { name: "Bard", categories: ["LLM", "AI"], url: "https://bard.google.com" },

    // Text to Image (T2I)
    { name: "DALL-E 3", categories: ["T2I", "I2I", "DES"], url: "https://openai.com/dall-e-3" },
    { name: "Midjourney", categories: ["T2I", "I2I", "DES"], url: "https://www.midjourney.com" },
    { name: "Stable Diffusion", categories: ["T2I", "I2I", "Animation"], url: "https://huggingface.co/spaces/stabilityai/stable-diffusion" },
    { name: "Leonardo.ai", categories: ["T2I", "I2I", "Animation"], url: "https://leonardo.ai" },
    { name: "Ideogram", categories: ["T2I", "DES"], url: "https://ideogram.ai" },
    { name: "Adobe Firefly", categories: ["T2I", "I2I", "DES"], url: "https://www.adobe.com/products/firefly" },
    { name: "Canva", categories: ["T2I", "DES", "Animation"], url: "https://www.canva.com/your-apps/text-to-image" },
    { name: "PhotoMaker", categories: ["T2I", "I2I", "Face Swap", "Portrait"], url: "https://huggingface.co/spaces/TencentARC/PhotoMaker" },
    { name: "Astria", categories: ["T2I", "I2I", "Fine-tuning"], url: "https://www.astria.ai" },
    { name: "Sana", categories: ["T2I"], url: "https://sana-gen.mit.edu/" },

    // Text to Video (T2V)
    { name: "HaliuoAI", categories: ["T2V", "I2V",], url: "https://hailuoai.com/video" },
    { name: "Kling.ai", categories: ["T2V", "I2V"], url: "https://klingai.com" },
    { name: "RunwayML", categories: ["T2I", "I2I", "T2V", "LipSync & Face Swap", "I2V", "V2V", "Animation"], url: "https://runwayml.com" },
    { name: "Pika Labs", categories: ["T2V", "I2V", "Animation"], url: "https://pika.art" },
    { name: "Kaiber", categories: ["T2V", "I2V", "Animation", "Music Generation"], url: "https://kaiber.ai" },
    { name: "Meta's Make-A-Video", categories: ["T2V", "I2V"], url: "https://makeavideo.studio" },
    { name: "Synthesia", categories: ["T2V", "Animation", "LipSync & Face Swap"], url: "https://www.synthesia.io" },
    { name: "Veed.io", categories: ["T2V", "V2V", "DES"], url: "https://www.veed.io" },
    { name: "Domo", categories: ["T2V", "Animation", "LipSync & Face Swap"], url: "https://domo.com" },
    { name: "Vidu", categories: ["T2V", "V2V", "Animation"], url: "https://vidu.ai" },
    { name: "Kaps", categories: ["T2V", "I2V", "Animation", "Face Swap"], url: "https://kaps.co.il" },
    { name: "Sora", categories: ["T2V", "I2V", "Animation"], url: "https://openai.com/sora" },

    // Image to Video (I2V)
    { name: "Pixverse", categories: ["T2V", "I2V", "Animation", "3D"], url: "https://pixverse.ai" },
    { name: "D-ID", categories: ["I2V", "LipSync & Face Swap"], url: "https://studio.d-id.com" },
    { name: "Luma Labs", categories: ["I2V", "3D", "Animation"], url: "https://lumalabs.ai" },
    { name: "Deep Dream Generator", categories: ["I2V", "T2I", "I2I"], url: "https://deepdreamgenerator.com" },

    // Video to Video (V2V)
    { name: "CapCut", categories: ["V2V", "DES", "Animation"], url: "https://www.capcut.com" },
    { name: "Stable Video Diffusion", categories: ["V2V", "I2V", "Animation"], url: "https://huggingface.co/stabilityai/stable-video-diffusion-img2vid" },
    { name: "DaVinci Resolve", categories: ["V2V", "DES", "AUD"], url: "https://www.blackmagicdesign.com/products/davinciresolve" },
    { name: "Adobe Premiere", categories: ["V2V", "DES", "AUD"], url: "https://www.adobe.com/products/premiere" },

    // 3D Oriented (3D)
    { name: "Point-E", categories: ["3D", "T2I"], url: "https://huggingface.co/spaces/openai/point-e" },
    { name: "GET3D", categories: ["3D", "T2I", "Animation"], url: "https://github.com/nvidia/GET3D" },
    { name: "CSM", categories:["3D","Image to 3D"], url:'http://3d.csm.ai' },
    { name: "Blender", categories: ["3D", "Animation", "DES"], url: "https://www.blender.org" },
    { name: "Cinema 4D", categories: ["3D", "Animation", "DES"], url: "https://www.maxon.net/cinema-4d" },
    { name: "ZoeDepth", categories: ["3D", "I2I"], url: "https://huggingface.co/spaces/shariqfarooq/ZoeDepth" },

    // Design Oriented (DES)
    { name: "Figma", categories: ["DES", "UI/UX"], url: "https://www.figma.com" },
    { name: "Framer", categories: ["DES", "UI/UX"], url: "https://www.framer.com" },
    { name: "Sketch", categories: ["DES", "UI/UX"], url: "https://www.sketch.com" },
    { name: "InVision", categories: ["DES", "UI/UX"], url: "https://www.invisionapp.com" },
    { name: "Adobe XD", categories: ["DES", "UI/UX"], url: "https://www.adobe.com/products/xd" },

    // Audio (AUD)
    { name: "ElevenLabs", categories: ["AUD", "T2S", "Voice Clone"], url: "https://elevenlabs.io" },
    { name: "Play.ht", categories: ["AUD", "T2S", "Voice Clone"], url: "https://play.ht" },
    { name: "OpenAI Whisper", categories: ["AUD", "S2T"], url: "https://github.com/openai/whisper" },
    { name: "Descript", categories: ["AUD", "V2V", "Voice Clone"], url: "https://www.descript.com" },
    { name: "Lalal.ai", categories: ["AUD", "Music", "Voice Separation"], url: "https://www.lalal.ai" },
    { name: "AIVA", categories: ["AUD", "Music Generation"], url: "https://www.aiva.ai" },
    { name: "Mubert", categories: ["AUD", "Music Generation"], url: "https://mubert.com" },
    { name: "Suno.ai", categories: ["AUD", "Music Generation"], url: "https://www.suno.ai" },
    { name: "Udio.ai", categories: ["AUD", "Music Generation"], url: "https://udio.com" },
    { name: "Stable Audio", categories: ["AUD", "Music Generation"], url: "https://www.stableaudio.com" },
    { name: "AudioCraft", categories: ["AUD", "Music Generation", "Sound Generation"], url: "https://audiocraft.metademolab.com" },
    { name: "Bark", categories: ["AUD", "T2S", "Sound Generation"], url: "https://github.com/suno-ai/bark" },

    // Animation Oriented (Animation)
    { name: "AnimateDiff", categories: ["Animation", "I2I", "T2I", "Fine-tuning"], url: "https://huggingface.co/spaces/guoyww/AnimateDiff" },    { name: "Character.ai", categories: ["Animation", "Face Swap", "Lip Sync"], url: "https://beta.character.ai" },
    { name: "Animaker", categories: ["Animation", "T2V"], url: "https://www.animaker.com" },
    { name: "Toon Boom Harmony", categories: ["Animation", "DES"], url: "https://www.toonboom.com/products/harmony" },
    { name: "Vyond", categories: ["Animation", "T2V"], url: "https://www.vyond.com" },

    // LipSync & Face Swap
    { name: "Live Portrait", categories: ["Animation", "LipSync & Face Swap", "Portrait"], url: "https://www.liveportrait.com" },
    { name: "Live Portrait Advanced", categories: ["Animation", "LipSync & Face Swap", "Portrait", "Body Motion"], url: "https://www.liveportrait.com/advanced" },
    { name: "DeepFaceLab", categories: ["LipSync & Face Swap", "I2I"], url: "https://github.com/iperov/DeepFaceLab" },
    { name: "InsightFaceSwap", categories: ["LipSync & Face Swap", "I2I"], url: "https://huggingface.co/spaces/InsightFace/insightface" },
    { name: "Reface", categories: ["LipSync & Face Swap", "Animation"], url: "https://hey.reface.ai" },
    { name: "FaceFusion", categories: ["LipSync & Face Swap", "I2I"], url: "https://github.com/facefusion/facefusion" },
    { name: "Hedra", categories: ["LipSync & Face Swap", "T2I", "3D", "Animation"], url: "https://www.hedra.ai" }


];





        moduleData.forEach(data => {
            const module = new AIModule(data.name, data.categories, data.url);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const radius = 200;

            module.x = radius * Math.sin(phi) * Math.cos(theta);
            module.y = radius * Math.sin(phi) * Math.sin(theta);
            module.z = radius * Math.cos(phi);

            this.modules.push(module);
        });
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));

        document.querySelectorAll('.category-controls button').forEach(button => {
            button.addEventListener('click', (e) => {
                if (e.shiftKey) {
                    if (this.selectedCategories.has(button.dataset.category)) {
                        this.selectedCategories.delete(button.dataset.category);
                    } else {
                        this.selectedCategories.add(button.dataset.category);
                    }
                } else {
                    this.selectedCategories.clear();
                    this.selectedCategories.add(button.dataset.category);
                }
                this.updateActiveButtons();
                this.filterModules();
            });
        });

        const toggleModeButton = document.getElementById('toggleMode');
        if (toggleModeButton) {
            toggleModeButton.addEventListener('click', () => {
                this.isLightMode = !this.isLightMode;
                this.updateMode();
            });
        }
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.lastMousePos = { x: e.clientX, y: e.clientY };
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            const deltaX = e.clientX - this.lastMousePos.x;
            const deltaY = e.clientY - this.lastMousePos.y;
            this.rotation.x += deltaY * 0.005;
            this.rotation.y += deltaX * 0.005;
            this.lastMousePos = { x: e.clientX, y: e.clientY };
        } else {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.hoveredModule = this.getHoveredModule(mouseX, mouseY);
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleDoubleClick(e) {
        if (this.hoveredModule) {
            window.open(this.hoveredModule.url, '_blank');
        }
    }

    filterModules() {
        this.modules.forEach(module => {
            module.visible = this.selectedCategories.has('all') || [...this.selectedCategories].some(cat => module.categories.includes(cat));
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.rotation.x += 0.001; // Slow automatic rotation along x-axis
        this.rotation.y += 0.001; // Slow automatic rotation along y-axis

        this.ctx.font = "16px Heebo";
        this.ctx.fillStyle = this.isLightMode ? "#000000" : "#ffffff";
        this.ctx.shadowColor = this.isLightMode ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)";
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;

        this.modules.forEach(module => {
            if (!module.visible) return;

            const rotatedPos = this.rotatePoint(module.x, module.y, module.z, this.rotation.x, this.rotation.y);
            const scale = 1000 / (1000 + rotatedPos.z);
            const x2d = rotatedPos.x * scale + this.canvas.width / 2;
            const y2d = rotatedPos.y * scale + this.canvas.height / 2;

            if (rotatedPos.z > -1000) {
                if (this.hoveredModule === module) {
                    this.ctx.font = "16px Heebo";
                    this.ctx.save();
                    this.ctx.translate(x2d, y2d);
                    this.ctx.scale(1.1, 1.1); // Smooth scaling for hovered module
                    this.ctx.fillText(module.name, 0, 0);
                    this.ctx.restore();
                } else {
                    this.ctx.fillText(module.name, x2d, y2d);
                }
            }
        });

        requestAnimationFrame(this.animate.bind(this));
    }

    getHoveredModule(mouseX, mouseY) {
        for (const module of this.modules) {
            const rotatedPos = this.rotatePoint(module.x, module.y, module.z, this.rotation.x, this.rotation.y);
            const scale = 1000 / (1000 + rotatedPos.z);
            const x2d = rotatedPos.x * scale + this.canvas.width / 2;
            const y2d = rotatedPos.y * scale + this.canvas.height / 2;
            const textWidth = this.ctx.measureText(module.name).width;

            if (
                mouseX >= x2d - textWidth / 2 && mouseX <= x2d + textWidth / 2 &&
                mouseY >= y2d - 10 && mouseY <= y2d + 10
            ) {
                return module;
            }
        }
        return null;
    }

    rotatePoint(x, y, z, rotX, rotY) {
        let tempX = x * Math.cos(rotY) - z * Math.sin(rotY);
        let tempZ = x * Math.sin(rotY) + z * Math.cos(rotY);
        let tempY = y * Math.cos(rotX) - tempZ * Math.sin(rotX);
        z = y * Math.sin(rotX) + tempZ * Math.cos(rotX);

        return { x: tempX, y: tempY, z: z };
    }

    updateActiveButtons() {
        document.querySelectorAll('.category-controls button').forEach(button => {
            button.classList.toggle('active', this.selectedCategories.has(button.dataset.category));
        });
    }

    updateMode() {
        document.body.style.background = this.isLightMode ? '#f0f0f0' : '#000';
        this.ctx.fillStyle = this.isLightMode ? '#000' : '#fff';
        this.ctx.shadowColor = this.isLightMode ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)";
        document.querySelectorAll('.category-controls button').forEach(button => {
            button.style.background = this.isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
            button.style.color = this.isLightMode ? '#000' : '#fff';
        });
        this.ctx.fillStyle = this.isLightMode ? '#000' : '#fff';
        this.ctx.shadowColor = this.isLightMode ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)";
    }
}

// Initialize the application
new ModuleCloud();
