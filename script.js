class AIModule {
    constructor(name, categories, url, scores = {}) {
        this.name = name;
        this.categories = categories;
        this.url = url;
        this.scores = scores;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.targetZ = 0;
        this.visible = true;
        this.scale = 1;
        this.opacity = 1;
        this.velocity = { x: 0, y: 0, z: 0 };
    }

    update() {
        const easing = 0.1;
        this.x += (this.targetX - this.x) * easing;
        this.y += (this.targetY - this.y) * easing;
        this.z += (this.targetZ - this.z) * easing;
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
        this.cloudSpread = 300;
        
        this.initializeCanvas();
        this.loadDefaultModules();
        this.setupEventListeners();
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

    loadDefaultModules() {
        this.modules = defaultModules.map(data => {
            const module = new AIModule(data.name, data.categories, data.url, data.scores);
            this.positionModuleInCloud(module);
            return module;
        });
    }

    positionModuleInCloud(module) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = this.cloudSpread + (Math.random() * 100);

        module.targetX = radius * Math.sin(phi) * Math.cos(theta);
        module.targetY = radius * Math.sin(phi) * Math.sin(theta);
        module.targetZ = radius * Math.cos(phi);
        
        module.x = module.targetX;
        module.y = module.targetY;
        module.z = module.targetZ;
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

        document.getElementById('toggleMode').addEventListener('click', () => {
            this.isLightMode = !this.isLightMode;
            document.body.classList.toggle('light-mode', this.isLightMode);
            document.getElementById('toggleMode').textContent = this.isLightMode ? '🌙' : '☀️';
        });

        document.getElementById('saveFile').addEventListener('click', () => {
            const data = JSON.stringify(this.modules, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ai-modules.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        document.getElementById('loadFile').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.modules = data.map(m => {
                            const module = new AIModule(m.name, m.categories, m.url, m.scores);
                            this.positionModuleInCloud(module);
                            return module;
                        });
                    } catch (error) {
                        console.error('Error loading file:', error);
                        this.loadDefaultModules();
                    }
                };
                reader.readAsText(file);
            }
        });

        const colorPicker = document.getElementById('bgColor');
        colorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            const darkerColor = this.adjustColor(color, -20);
            document.body.style.background = `linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%)`;
        });
    }

    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
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

    handleDoubleClick() {
        if (this.hoveredModule) {
            window.open(this.hoveredModule.url, '_blank');
        }
    }

    showTooltip(x, y, module) {
        const scores = Object.entries(module.scores)
            .map(([category, score]) => `${category}: ${Math.round(score * 100)}%`)
            .join('<br>');

        this.tooltip.innerHTML = `
            <strong>${module.name}</strong><br>
            <small>${scores}</small>
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

    updateActiveButtons() {
        document.querySelectorAll('.sidebar button').forEach(button => {
            button.classList.toggle('active', 
                this.selectedCategories.has(button.dataset.category)
            );
        });
    }

    filterModules() {
        this.modules.forEach(module => {
            const score = module.getAverageScore(this.selectedCategories);
            module.visible = score > 0;
            module.scale = 0.5 + (score * 0.5);
            module.opacity = 0.3 + (score * 0.7);
        });
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

            this.ctx.font = `${16 * scale}px system-ui`;
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
                this.ctx.font = `${16 * scale}px system-ui`;
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
}

new ModuleCloud();
