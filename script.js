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
	{ name: "Claude", categories: ["LLM", "USE"], url: "https://claude.ai", scores: { "LLM": 0.95, "USE": 0.90 } },
	{ name: "Perplexity", categories: ["LLM", "USE", "SEA"], url: "https://perplexity.ai", scores: { "LLM": 0.97, "USE": 0.80, "SEA": 0.95 } },
	{ name: "Groq", categories: ["LLM", "USE"], url: "https://groq.com/", scores: { "LLM": 0.98, "USE": 0.90 } },
	{ name: "Bard", categories: ["LLM", "USE"], url: "https://bard.google.com", scores: { "LLM": 0.85, "USE": 0.75 } },
	{ name: "Jasper", categories: ["LLM", "USE", "CON"], url: "https://www.jasper.ai/", scores: { "LLM": 0.80, "USE": 0.79, "CON": 0.85 } },

// AI Tools (USE)
	{ name: "Grammarly", categories: ["USE", "WRI"], url: "https://www.grammarly.com/", scores: { "USE": 0.90, "WRI": 0.95 } },
	{ name: "Gamma", categories: ["USE", "PRE"], url: "https://gamma.app/", scores: { "USE": 0.92, "PRE": 0.88 } },

// Text to Image (T2I)
	{ name: "DALL-E 3", categories: ["T2I", "I2I", "DES"], url: "https://openai.com/dall-e-3", scores: { "T2I": 0.85, "I2I": 0.80, "DES": 0.85 } },
	{ name: "Midjourney", categories: ["T2I", "I2I", "DES"], url: "https://www.midjourney.com", scores: { "T2I": 0.92, "I2I": 0.88, "DES": 0.90 } },
	{ name: "Stable Diffusion", categories: ["T2I", "I2I", "ANI"], url: "https://huggingface.co/spaces/stabilityai/stable-diffusion", scores: { "T2I": 0.88, "I2I": 0.85, "ANI": 0.80 } },
	{ name:	"Fooocus", categories: ["T2I", "I2I", "UPS"], url: "https://colab.research.google.com/github/lllyasviel/Fooocus/blob/main/fooocus_colab.ipynb", scores: { "T2I": 0.88, "I2I": 0.92, "UPS": 0.95 } },
	{ name:	"Artflow", categories: ["T2I", "FCE"], url: "https://app.artflow.ai/", scores: { "T2I": 0.78, "FCE": 0.94 } },
	{ name: "Leonardo.ai", categories: ["T2I", "I2I", "ANI"], url: "https://leonardo.ai", scores: { "T2I": 0.86, "I2I": 0.84, "ANI": 0.78 } },
	{ name: "Ideogram", categories: ["T2I", "DES"], url: "https://ideogram.ai", scores: { "T2I": 0.83, "DES": 0.85 } },
	{ name: "Adobe Firefly", categories: ["T2I", "I2I", "DES"], url: "https://www.adobe.com/products/firefly", scores: { "T2I": 0.87, "I2I": 0.85, "DES": 0.89 } },
	{ name: "Canva", categories: ["T2I", "DES", "ANI"], url: "https://www.canva.com/your-apps/text-to-image", scores: { "T2I": 0.80, "DES": 0.88, "ANI": 0.75 } },
	{ name: "PhotoMaker", categories: ["T2I", "I2I", "FCE"], url: "https://huggingface.co/spaces/TencentARC/PhotoMaker", scores: { "T2I": 0.82, "I2I": 0.84, "FCE": 0.86 } },
	{ name: "Astria", categories: ["T2I", "I2I", "UPS"], url: "https://www.astria.ai", scores: { "T2I": 0.81, "I2I": 0.79, "UPS": 0.85 } },
	{ name: "Sana", categories: ["T2I"], url: "https://sana-gen.mit.edu/", scores: { "T2I": 0.78 } },

// Text to Video (T2V)
	{ name: "HaliuoAI", categories: ["T2V", "I2V"], url: "https://hailuoai.com/video", scores: { "T2V": 0.82, "I2V": 0.80 } },
	{ name: "Kling.ai", categories: ["T2V", "I2V"], url: "https://klingai.com", scores: { "T2V": 0.79, "I2V": 0.77 } },
	{ name: "RunwayML", categories: ["T2I", "I2I", "T2V", "FCE", "I2V", "V2V", "ANI", "VID", "AUD", "3D"], url: "https://runwayml.com", scores: { "T2I": 0.86, "I2I": 0.84, "T2V": 0.88, "FCE": 0.85, "I2V": 0.87, "V2V": 0.86, "ANI": 0.83, "VID": 0.85, "AUD": 0.80, "3D": 0.79 } },
	{ name: "Pika Labs", categories: ["T2V", "I2V", "ANI"], url: "https://pika.art", scores: { "T2V": 0.85, "I2V": 0.83, "ANI": 0.81 } },
	{ name: "Kaiber", categories: ["T2V", "I2V", "ANI", "MUS"], url: "https://kaiber.ai", scores: { "T2V": 0.84, "I2V": 0.82, "ANI": 0.80, "MUS": 0.78 } },
	{ name: "Meta's Make-A-Video", categories: ["T2V", "I2V"], url: "https://makeavideo.studio", scores: { "T2V": 0.83, "I2V": 0.81 } },
	{ name: "Synthesia", categories: ["T2V", "ANI", "FCE"], url: "https://www.synthesia.io", scores: { "T2V": 0.86, "ANI": 0.84, "FCE": 0.87 } },
	{ name: "Stable Video", categories: ["T2V", "I2V"], url: "https://www.stablevideo.com/", scores: { "T2V": 0.89, "I2V": 0.89 } },
	{ name: "Veed.io", categories: ["T2V", "I2V", "VID", "V2V", "DES"], url: "https://www.veed.io", scores: { "T2V": 0.82, "I2V": 0.81, "VID": 0.83, "V2V": 0.84, "DES": 0.83 } },
	{ name: "Fliki", categories: ["T2V", "T2S"], url: "https://fliki.ai/", scores: { "T2V": 0.89, "T2S": 0.87 } },
	{ name: "Vidu", categories: ["T2V", "V2V", "ANI", "I2V"], url: "https://vidu.ai", scores: { "T2V": 0.81, "V2V": 0.79, "I2V": 0.94, "ANI": 0.80 } },
	{ name: "Kaps", categories: ["T2V", "I2V", "ANI", "FCE"], url: "https://kaps.co.il", scores: { "T2V": 0.79, "I2V": 0.77, "ANI": 0.78, "FCE": 0.80 } },
	{ name: "Sora", categories: ["T2V", "I2V", "ANI"], url: "https://openai.com/sora", scores: { "T2V": 0.90, "I2V": 0.88, "ANI": 0.89 } },

// Image to Video (I2V)
	{ name: "Hedra", categories: ["FCE", "I2V"], url: "https://www.hedra.com/", scores: { "FCE": 0.95, "I2V": 0.92 } },
	{ name: "Pixverse", categories: ["T2V", "I2V", "ANI"], url: "https://pixverse.ai", scores: { "T2V": 0.81, "I2V": 0.88, "ANI": 0.89 } },
	{ name: "D-ID", categories: ["I2V", "FCE"], url: "https://studio.d-id.com", scores: { "I2V": 0.85, "FCE": 0.87 } },
	{ name: "Luma Labs", categories: ["T2V", "I2V", "ANI"], url: "https://lumalabs.ai", scores: { "T2V": 0.92, "I2V": 0.84, "ANI": 0.82 } },
	{ name: "Deep Dream Generator", categories: ["I2V", "T2I", "I2I"], url: "https://deepdreamgenerator.com", scores: { "I2V": 0.79, "T2I": 0.81, "I2I": 0.80 } },

// Video Repaint (V2V)
	{ name: "Domo", categories: ["T2V", "ANI", "V2V", "FCE"], url: "https://domo.com", scores: { "T2V": 0.80, "ANI": 0.78, "V2V": 0.92, "FCE": 0.82 } },
	{ name: "CapCut", categories: ["V2V", "DES", "ANI"], url: "https://www.capcut.com", scores: { "V2V": 0.85, "DES": 0.83, "ANI": 0.81 } },
	{ name: "Stable Video Diffusion", categories: ["V2V", "I2V", "ANI"], url: "https://huggingface.co/stabilityai/stable-video-diffusion-img2vid", scores: { "V2V": 0.87, "I2V": 0.86, "ANI": 0.84 } },
	{ name: "DaVinci Resolve", categories: ["V2V", "DES", "AUD"], url: "https://www.blackmagicdesign.com/products/davinciresolve", scores: { "V2V": 0.89, "DES": 0.88, "AUD": 0.87 } },
	{ name: "Adobe Premiere", categories: ["VID", "V2V"], url: "https://www.adobe.com/products/premiere", scores: { "VID": 0.94, "V2V": 0.80 } },
	{ name: "Videoleap", categories: ["VID", "V2V", "ANI", "T2V", "I2V", "DES"], url: "https://www.videoleapapp.com", scores: { "VID": 0.88, "V2V": 0.86, "ANI": 0.85, "T2V": 0.82, "I2V": 0.83, "DES": 0.84 } },

// 3D Tools (3D)
	{ name: "Point-E", categories: ["3D", "T2I"], url: "https://huggingface.co/spaces/openai/point-e", scores: { "3D": 0.82, "T2I": 0.80 } },
	{ name: "GET3D", categories: ["3D", "T2I", "ANI"], url: "https://github.com/nvidia/GET3D", scores: { "3D": 0.85, "T2I": 0.83, "ANI": 0.81 } },
	{ name: "CSM", categories: ["3D", "I23"], url: "http://3d.csm.ai", scores: { "3D": 0.84, "I23": 0.86 } },
	{ name: "Meshy", categories: ["3D", "I23"], url: "http://www.meshy.ai", scores: { "3D": 0.83, "I23": 0.85 } },
	{ name: "Vizcom", categories: ["3D", "I23"], url: "https://www.vizcom.ai/", scores: { "3D": 0.85, "I23": 0.87 } },
	{ name: "Blender", categories: ["3D", "ANI", "DES"], url: "https://www.blender.org", scores: { "3D": 0.92, "ANI": 0.90, "DES": 0.88 } },
	{ name: "Cinema 4D", categories: ["3D", "ANI", "DES"], url: "https://www.maxon.net/cinema-4d", scores: { "3D": 0.91, "ANI": 0.89, "DES": 0.87 } },
	{ name: "ZoeDepth", categories: ["3D", "I2I"], url: "https://huggingface.co/spaces/shariqfarooq/ZoeDepth", scores: { "3D": 0.83, "I2I": 0.81 } },

// Design (DES)
	{ name: "Figma", categories: ["DES", "UI/UX"], url: "https://www.figma.com", scores: { "DES": 0.93, "UI/UX": 0.95 } },
	{ name: "Framer", categories: ["DES", "UI/UX"], url: "https://www.framer.com", scores: { "DES": 0.89, "UI/UX": 0.91 } },
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
