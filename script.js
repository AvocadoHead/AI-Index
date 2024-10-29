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
        this.rotationX = 0;
        this.rotationY = 0;
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
        this.canvas = document.querySelector('#moduleCloud');
        this.ctx = this.canvas.getContext('2d');
        this.modules = [];
        this.cloudSpread = 300;
        this.initialized = false;
        this.rotationX = 0;
        this.rotationY = 0;
        this.momentumX = 0;
        this.momentumY = 0;
        this.baseRotationX = 0.0003; // Base auto-rotation speed X
        this.baseRotationY = 0.0005; // Base auto-rotation speed Y
        this.friction = 0.98;        // How quickly momentum slows down
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.isDragging = false;
        this.tooltip = document.getElementById('tooltip');
        this.autoRotationSpeedX = 0.0005; // Slower X rotation
        this.autoRotationSpeedY = 0.001;  // Slightly faster Y rotation
        this.lastInteractionTime = 0;
        this.interactionTimeout = 3000; // Time in ms before auto-rotation resumes
        this.isAutoRotating = true;

        this.initializeCanvas();
        this.setupEventListeners();

        if (typeof defaultModules !== 'undefined') {
            console.log('Loading default modules:', defaultModules.length);
            this.modules = defaultModules.map(m => {
                const module = new AIModule(m.name, m.categories, m.url, m.scores);
                this.positionModuleInCloud(module);
                return module;
            });
            this.defaultModules = [...this.modules];
            this.initialized = true;
        }

        this.animate();
    }

    positionModuleInCloud(module) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = this.cloudSpread + (Math.random() * 100);

        module.targetX = radius * Math.sin(phi) * Math.cos(theta);
        module.targetY = radius * Math.sin(phi) * Math.sin(theta);
        module.targetZ = radius * Math.cos(phi);
    }

    initializeCanvas() {
        const updateSize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', updateSize);
        updateSize();
    }

    setupEventListeners() {
        // Toggle mode button
        const toggleMode = document.getElementById('toggleMode');
        if (toggleMode) {
            toggleMode.onclick = () => {
                document.body.classList.toggle('light-mode');
                this.canvas.style.backgroundColor = document.body.classList.contains('light-mode') ? '#ffffff' : '#1a1a1a';
            };
        }

        // Save and load file buttons
        const saveFile = document.getElementById('saveFile');
        if (saveFile) {
            saveFile.onclick = () => this.saveModules();
        }

        const loadFile = document.getElementById('loadFile');
        const fileInput = document.getElementById('fileInput');
        if (loadFile && fileInput) {
            fileInput.setAttribute('accept', '.js,.json');
            loadFile.onclick = () => fileInput.click();
            fileInput.onchange = (event) => this.handleFileUpload(event);
        }

        // Module form handling
        const moduleForm = document.getElementById('moduleForm');
        if (moduleForm) {
            moduleForm.onsubmit = (e) => {
                e.preventDefault();
                const name = document.getElementById('moduleName').value;
                const url = document.getElementById('moduleUrl').value;
                const categories = document.getElementById('moduleCategories').value;
                
                if (this.addNewModule(name, url, categories)) {
                    moduleForm.reset();
                    document.querySelector('.dropdown-content').classList.remove('show');
                }
            };
        }

        // Add module dropdown
        const addModuleBtn = document.getElementById('addModule');
        const dropdownContent = document.querySelector('.dropdown-content');
        if (addModuleBtn && dropdownContent) {
            addModuleBtn.onclick = () => dropdownContent.classList.toggle('show');
            
            // Close dropdown when clicking outside, but not when clicking inside the form
            window.onclick = (event) => {
                if (!event.target.matches('#addModule') && 
                    !event.target.closest('.dropdown-content')) {
                    dropdownContent.classList.remove('show');
                }
            };
        }

        // Category filtering
        const categoryButtons = document.querySelectorAll('.sidebar button');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.dataset.category;
                if (category === 'all') {
                    this.modules = [...this.defaultModules];
                } else {
                    this.modules = this.defaultModules.filter(module => 
                        module.categories.includes(category)
                    );
                }

                this.modules.forEach(module => this.positionModuleInCloud(module));
            });
        });

        // Mouse events for canvas
        this.canvas.onmousedown = (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX - this.canvas.getBoundingClientRect().left;
            this.lastMouseY = e.clientY - this.canvas.getBoundingClientRect().top;
        };

        this.canvas.onmouseup = () => {
            this.isDragging = false;
            this.lastInteractionTime = Date.now();
        };

        this.canvas.onmousemove = (e) => this.handleMouseMove(e);
        this.canvas.onmouseleave = () => {
            this.isDragging = false;
            this.hideTooltip();
        };

        // Resume auto-rotation when mouse is still
        let mouseTimeout;
        this.canvas.onmousemove = (e) => {
            this.handleMouseMove(e);
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.isAutoRotating = true;
            }, this.interactionTimeout);
        };

        // Background color control
        const bgColorPicker = document.getElementById('bgColor');
        if (bgColorPicker) {
            bgColorPicker.onchange = (e) => {
                this.canvas.style.backgroundColor = e.target.value;
                document.body.style.backgroundColor = e.target.value;
            };
            
            // Set initial background color
            this.canvas.style.backgroundColor = bgColorPicker.value;
            document.body.style.backgroundColor = bgColorPicker.value;
        }

        // Add click handler for opening URLs
        this.canvas.onclick = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const hoveredModule = this.getHoveredModule(mouseX, mouseY);
            if (hoveredModule && hoveredModule.url) {
                window.open(hoveredModule.url, '_blank');
            }
        };
    }

    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.isDragging) {
            const deltaX = mouseX - this.lastMouseX;
            const deltaY = mouseY - this.lastMouseY;
            
            this.momentumX = deltaY * 0.001;
            this.momentumY = deltaX * 0.001;
            
            this.rotationX += this.momentumX;
            this.rotationY += this.momentumY;
        }

        const hoveredModule = this.getHoveredModule(mouseX, mouseY);
        if (hoveredModule) {
            this.showTooltip(hoveredModule, event.clientX, event.clientY);
            this.canvas.style.cursor = 'pointer';
        } else {
            this.hideTooltip();
            this.canvas.style.cursor = 'default';
        }

        this.lastMouseX = mouseX;
        this.lastMouseY = mouseY;
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

    showTooltip(module, x, y) {
        if (this.tooltip) {
            // Format scores to show as points out of 100
            const scoresList = Object.entries(module.scores)
                .map(([category, score]) => `${category}: ${Math.round(score * 100)}pts`)
                .join('<br>');

            const tooltipContent = `
                <strong>${module.name}</strong><br>
                <small>Categories: ${module.categories.join(', ')}</small><br>
                <small>${scoresList}</small>
            `;
            
            this.tooltip.innerHTML = tooltipContent;
            this.tooltip.style.display = 'block';
            this.tooltip.style.left = `${x + 10}px`;
            this.tooltip.style.top = `${y + 10}px`;
        }
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.style.display = 'none';
        }
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
        // Only rotate if the point exists
        if (x === undefined || y === undefined || z === undefined) {
            return { x: 0, y: 0, z: 0 };
        }

        // Rotate around Y axis
        const cosY = Math.cos(this.rotationY);
        const sinY = Math.sin(this.rotationY);
        const tempX = x * cosY - z * sinY;
        const tempZ = z * cosY + x * sinY;

        // Rotate around X axis
        const cosX = Math.cos(this.rotationX);
        const sinX = Math.sin(this.rotationX);
        const tempY = y * cosX - tempZ * sinX;
        z = tempZ * cosX + y * sinX;

        return { x: tempX, y: tempY, z };
    }

    getHoveredModule(mouseX, mouseY) {
        const hoveredModule = this.modules.find(module => {
            const rotated = this.rotatePoint(module.x, module.y, module.z);
            const screenX = this.canvas.width / 2 + rotated.x;
            const screenY = this.canvas.height / 2 + rotated.y;
            
            // Reduce hit area for more precise detection
            const hitRadius = 25; // Reduced from 40 to 25
            const dx = mouseX - screenX;
            const dy = mouseY - screenY;
            
            return (dx * dx + dy * dy) < (hitRadius * hitRadius);
        });
        
        return hoveredModule;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply momentum and base rotation
        if (!this.isDragging) {
            // Apply momentum with friction
            this.momentumX *= this.friction;
            this.momentumY *= this.friction;
            
            // Add base rotation
            this.rotationX += this.baseRotationX + this.momentumX;
            this.rotationY += this.baseRotationY + this.momentumY;
        }
        
        if (this.initialized && this.modules.length > 0) {
            const sortedModules = [...this.modules].sort((a, b) => {
                const pointA = this.rotatePoint(a.x, a.y, a.z);
                const pointB = this.rotatePoint(b.x, b.y, b.z);
                return pointB.z - pointA.z;
            });

            sortedModules.forEach(module => {
                if (module) {
                    module.update();
                    this.drawModule(module);
                }
            });
        }
        
        requestAnimationFrame(() => this.animate());
    }

    drawModuleShadow(module) {
        const rotated = this.rotatePoint(module.x, module.y, module.z);
        const scale = Math.max(0.2, (rotated.z + 400) / 600);
        const shadowOffset = 50; // Distance of shadow from text
        const shadowBlur = 20;   // Blur amount for shadow
        
        // Calculate shadow position
        const shadowX = this.canvas.width / 2 + rotated.x;
        const shadowY = this.canvas.height / 2 + rotated.y + shadowOffset;
        
        this.ctx.save();
        
        // Draw shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Very subtle shadow
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = shadowBlur * scale;
        this.ctx.shadowOffsetY = 5 * scale;
        
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = '16px Heebo';
        this.ctx.fillText(module.name, shadowX, shadowY);
        
        this.ctx.restore();
    }

    saveModules() {
        const modulesLines = this.modules.map(module => {
            const categoriesStr = module.categories.map(cat => `"${cat}"`).join(', ');
            const scoresStr = Object.entries(module.scores)
                .map(([cat, score]) => `"${cat}": ${score}`)
                .join(', ');
            
            return `\t{ name: "${module.name}", categories: [${categoriesStr}], url: "${module.url}", scores: { ${scoresStr} } }`;
        });

        const fileContent = modulesLines.join(',\n') + ',\n';
        
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modules.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    addNewModule(name, url, categoriesString) {
        try {
            // Parse categories string (e.g., "LLM:95, USE:75, T2I:88")
            const categories = [];
            const scores = {};
            
            // Split by comma and handle each category:score pair
            categoriesString.split(',').forEach(item => {
                const [category, score] = item.trim().split(':');
                if (category && score) {
                    const cleanCategory = category.trim();
                    categories.push(cleanCategory);
                    scores[cleanCategory] = parseFloat(score) / 100; // Convert 95 to 0.95
                }
            });

            const module = new AIModule(
                name.trim(),
                categories,
                url.trim(),
                scores
            );

            if (!this.modules) this.modules = [];
            if (!this.defaultModules) this.defaultModules = [];
            
            this.modules.push(module);
            this.defaultModules.push(module);
            this.positionModuleInCloud(module);
            this.initialized = true;
            
            console.log('Added module:', {
                name: module.name,
                categories: module.categories,
                scores: module.scores
            });

            return true;
        } catch (error) {
            console.error('Error adding module:', error);
            return false;
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    let data;

                    // Handle the JS format with individual module entries
                    if (content.includes('{')) {
                        // Convert the content to valid JSON array
                        const cleanContent = '[' + 
                            content.trim()
                                .replace(/,\s*$/, '')  // Remove trailing comma
                                .replace(/\t/g, '')    // Remove tabs
                                .replace(/'/g, '"')    // Replace single quotes with double quotes
                                .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes to property names
                        + ']';

                        try {
                            data = JSON.parse(cleanContent);
                        } catch (e) {
                            console.error('Parse error:', e);
                            console.log('Attempted to parse:', cleanContent);
                            return;
                        }
                    }

                    if (data && Array.isArray(data)) {
                        this.modules = data.map(m => {
                            const module = new AIModule(m.name, m.categories, m.url, m.scores);
                            this.positionModuleInCloud(module);
                            return module;
                        });
                        
                        this.defaultModules = [...this.modules];
                        this.initialized = true;
                        console.log('Successfully loaded', this.modules.length, 'modules');
                    }
                } catch (error) {
                    console.error('Error loading file:', error);
                }
            };
            reader.readAsText(file);
        }
    }

    drawModule(module) {
        const rotated = this.rotatePoint(module.x, module.y, module.z);
        // Adjust scale range to be more subtle
        const scale = Math.max(0.8, (rotated.z + 400) / 600); // Minimum 0.8, less variation
        
        this.ctx.save();
        this.ctx.translate(
            this.canvas.width / 2 + rotated.x,
            this.canvas.height / 2 + rotated.y
        );
        
        // Increase base font size to 20px
        this.ctx.fillStyle = document.body.classList.contains('light-mode') ? '#000000' : '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = `${20 * scale}px Heebo`; // Base size 20px
        this.ctx.fillText(module.name, 0, 0);
        
        this.ctx.restore();
    }
}

new ModuleCloud();
