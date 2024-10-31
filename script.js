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
        // For 'all' category, calculate average of all scores
        if (selectedCategories.has('all')) {
            const scores = Object.values(this.scores);
            return scores.length > 0 ? 
                scores.reduce((sum, score) => sum + score, 0) / scores.length 
                : 1;
        }
        
        // Original logic for specific categories
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
        this.scale = 1;
        this.lastTouchDistance = 0;
        this.lastClickTime = 0;
        this.lastClickedModule = null;
        this.clickDelay = 300; // milliseconds between clicks
        
        this.GOOGLE_API_KEY = 'YOUR_API_KEY'; // You'll need to get a Google API key
        
        this.initializeCanvas();
        this.setupEventListeners();

        // Initialize with empty arrays
        this.modules = [];
        this.defaultModules = [];
        
        if (typeof defaultModules !== 'undefined') {
            console.log('Found modules file, attempting to load...');
            try {
                // Ensure we're getting all entries
                const moduleCount = defaultModules.length;
                console.log(`Total modules in file: ${moduleCount}`);
                
                this.modules = defaultModules.map((m, index) => {
                    if (!m.name || !m.categories || !m.url || !m.scores) {
                        console.warn(`Module at index ${index} is missing required fields:`, m);
                        return null;
                    }
                    const module = new AIModule(m.name, m.categories, m.url, m.scores);
                    this.positionModuleInCloud(module);
                    return module;
                }).filter(m => m !== null); // Remove any null entries
                
                console.log(`Successfully loaded ${this.modules.length} modules`);
                this.defaultModules = [...this.modules];
                this.initialized = true;
            } catch (error) {
                console.error('Error during module loading:', error);
            }
        }

        this.animate();

        // Add touch event listeners
        this.setupTouchEvents();

        this.activeModule = null;  // Track active (selected) module
        this.pinnedTooltip = false;  // Track if tooltip is pinned
        this.moduleDescriptions = new Map();
        this.tooltipDebounceTimer = null;
        this.lastHoveredModule = null;
        this.tooltipDebounceDelay = 300; // Increased to 300ms for more stability
    }

    initializeFromModules(modules) {
        try {
            this.modules = modules.map(m => {
                const module = new AIModule(m.name, m.categories, m.url, m.scores);
                this.positionModuleInCloud(module);
                return module;
            });
            this.defaultModules = [...this.modules];
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing modules:', error);
            this.showError('Error loading modules');
        }
    }

    showError(message) {
        // Create or update error display
        const errorElement = document.getElementById('errorMessage') || document.createElement('div');
        errorElement.id = 'errorMessage';
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!document.body.contains(errorElement)) {
            document.body.appendChild(errorElement);
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }

    positionModuleInCloud(module) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = this.cloudSpread + (Math.random() * (this.cloudSpread * 0.2));

        module.targetX = radius * Math.sin(phi) * Math.cos(theta);
        module.targetY = radius * Math.sin(phi) * Math.sin(theta);
        module.targetZ = radius * Math.cos(phi);
    }

    initializeCanvas() {
        const updateSize = () => {
            // Make canvas fill the screen while maintaining aspect ratio
            const devicePixelRatio = window.devicePixelRatio || 1;
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Set display size
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            
            // Set actual size in memory
            this.canvas.width = width * devicePixelRatio;
            this.canvas.height = height * devicePixelRatio;
            
            // Scale all drawing operations
            this.ctx.scale(devicePixelRatio, devicePixelRatio);

            // Adjust cloud spread based on screen size
            this.cloudSpread = Math.min(width, height) * 0.3; // Adjust cloud size relative to screen
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
            fileInput.setAttribute('accept', '.txt,.js,text/plain,text/javascript');
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

        // Fix Add Module dropdown
        const addModuleBtn = document.getElementById('addModule');
        const dropdownContent = document.querySelector('.dropdown-content');
        if (addModuleBtn && dropdownContent) {
            addModuleBtn.onclick = (e) => {
                e.stopPropagation();
                dropdownContent.classList.toggle('show');
            };
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#addModule') && 
                    !e.target.closest('.dropdown-content')) {
                    dropdownContent.classList.remove('show');
                }
            });
        }

        // Category filtering with multi-select
        const categoryButtons = document.querySelectorAll('.sidebar button');
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = button.dataset.category;
                
                if (category === 'all') {
                    // 'All' button always clears other selections
                    categoryButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    this.modules = [...this.defaultModules];
                } else if (e.shiftKey) {
                    // Shift+click for multi-select
                    if (button.classList.contains('active')) {
                        // Remove this category if already selected
                        button.classList.remove('active');
                    } else {
                        // Add this category
                        button.classList.add('active');
                        // Remove 'all' selection if it was active
                        document.querySelector('.sidebar button[data-category="all"]')
                            ?.classList.remove('active');
                    }
                    
                    // Get all active categories
                    const activeCategories = Array.from(document.querySelectorAll('.sidebar button.active'))
                        .map(btn => btn.dataset.category);
                    
                    // Filter modules that match ANY of the selected categories
                    this.modules = this.defaultModules.filter(module => 
                        module.categories.some(cat => activeCategories.includes(cat))
                    );
                    
                    // If no categories selected, show all
                    if (activeCategories.length === 0) {
                        document.querySelector('.sidebar button[data-category="all"]')
                            ?.classList.add('active');
                        this.modules = [...this.defaultModules];
                    }
                } else {
                    // Normal click - single category
                    categoryButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    this.modules = this.defaultModules.filter(module => 
                        module.categories.includes(category)
                    );
                }

                // Reposition visible modules
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

        this.canvas.onmousemove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Handle dragging
            if (this.isDragging) {
                const deltaX = mouseX - this.lastMouseX;
                const deltaY = mouseY - this.lastMouseY;
                
                this.momentumX = deltaY * 0.001;
                this.momentumY = deltaX * 0.001;
                
                this.rotationX += this.momentumX;
                this.rotationY += this.momentumY;
            } else if (!this.pinnedTooltip) { // Only process hover if tooltip isn't pinned
                clearTimeout(this.tooltipDebounceTimer);
                this.tooltipDebounceTimer = setTimeout(() => {
                    const hoveredModule = this.getHoveredModule(mouseX, mouseY);
                    if (hoveredModule && !this.pinnedTooltip) {
                        if (this.lastHoveredModule !== hoveredModule) {
                            this.lastHoveredModule = hoveredModule;
                            this.showTooltip(hoveredModule, e.clientX, e.clientY, false);
                        }
                        this.canvas.style.cursor = 'pointer';
                    } else if (!hoveredModule && !this.pinnedTooltip) {
                        this.hideTooltip();
                        this.lastHoveredModule = null;
                        this.canvas.style.cursor = 'default';
                    }
                }, this.tooltipDebounceDelay);
            }

            this.lastMouseX = mouseX;
            this.lastMouseY = mouseY;
        };

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

        // Update canvas click handler
        this.canvas.onclick = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const clickedModule = this.getHoveredModule(mouseX, mouseY);
            const editModuleBtn = document.getElementById('editModule');
            
            if (clickedModule) {
                if (this.activeModule === clickedModule) {
                    // Second click - open URL
                    if (clickedModule.url) {
                        window.open(clickedModule.url, '_blank');
                    }
                } else {
                    // First click - select module and pin tooltip
                    this.activeModule = clickedModule;
                    this.pinnedTooltip = true;
                    editModuleBtn.disabled = false;
                    this.showTooltip(clickedModule, e.clientX, e.clientY);
                }
            } else {
                // Click on empty space - unpin tooltip and deselect module
                this.activeModule = null;
                this.pinnedTooltip = false;
                this.hideTooltip();
                editModuleBtn.disabled = true;
            }
        };

        // Add touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.isDragging = true;
            this.lastMouseX = touch.clientX - this.canvas.getBoundingClientRect().left;
            this.lastMouseY = touch.clientY - this.canvas.getBoundingClientRect().top;
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isDragging) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = touch.clientX - rect.left;
                const mouseY = touch.clientY - rect.top;

                const deltaX = mouseX - this.lastMouseX;
                const deltaY = mouseY - this.lastMouseY;
                
                // Adjust sensitivity for touch
                this.momentumX = deltaY * 0.0015;
                this.momentumY = deltaX * 0.0015;
                
                this.rotationX += this.momentumX;
                this.rotationY += this.momentumY;

                // Handle tooltip for touch
                const hoveredModule = this.getHoveredModule(mouseX, mouseY);
                if (hoveredModule) {
                    this.showTooltip(hoveredModule, touch.clientX, touch.clientY);
                } else {
                    this.hideTooltip();
                }

                this.lastMouseX = mouseX;
                this.lastMouseY = mouseY;
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => {
            this.isDragging = false;
            this.lastInteractionTime = Date.now();
            this.hideTooltip();
        });

        // Prevent default touch behaviors
        document.addEventListener('touchmove', (e) => {
            if (e.target === this.canvas) {
                e.preventDefault();
            }
        }, { passive: false });

        // Handle device orientation if available
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                if (!this.isDragging) {
                    const tiltSpeed = 0.0002;
                    this.momentumX = e.beta * tiltSpeed;
                    this.momentumY = e.gamma * tiltSpeed;
                }
            });
        }

        // Delete module button
        const deleteModuleBtn = document.getElementById('deleteModule');
        if (deleteModuleBtn) {
            deleteModuleBtn.onclick = () => {
                if (this.activeModule) {
                    if (confirm(`Are you sure you want to delete "${this.activeModule.name}"?`)) {
                        this.deleteModule(this.activeModule.name);
                        this.activeModule = null;
                        this.pinnedTooltip = false;
                        this.hideTooltip();
                        document.getElementById('editModule').disabled = true;
                    }
                }
            };
        }

        // Add mouse wheel zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // Get zoom direction and calculate delta
            const delta = -e.deltaY * 0.001; // Adjust sensitivity here
            
            // Apply zoom with the same limits as pinch
            this.scale *= (1 + delta);
            this.scale = Math.max(0.5, Math.min(2, this.scale));
            
        }, { passive: false });

        // Fix Edit Module dropdown functionality
        const editModuleBtn = document.getElementById('editModule');
        const editDropdown = document.getElementById('editModuleDropdown');

        if (editModuleBtn) {
            editModuleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (!this.activeModule) return; // Don't do anything if no module is selected
                
                // Toggle dropdown visibility
                if (editDropdown) {
                    editDropdown.classList.toggle('show');
                    
                    // Populate form with active module data
                    document.getElementById('editModuleName').value = this.activeModule.name;
                    document.getElementById('editModuleUrl').value = this.activeModule.url;
                    
                    // Format categories and scores
                    const categoriesScores = this.activeModule.categories
                        .map(category => 
                            `${category}:${Math.round(this.activeModule.scores[category] * 100)}`)
                        .join(', ');
                    document.getElementById('editModuleCategories').value = categoriesScores;
                }
            });

            // Handle click outside to close dropdown
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#editModule') && 
                    !e.target.closest('#editModuleDropdown')) {
                    editDropdown?.classList.remove('show');
                }
            });
        }

        // Add form submission handler
        const editModuleForm = document.getElementById('editModuleForm');
        if (editModuleForm) {
            editModuleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (!this.activeModule) return;
                
                const newUrl = document.getElementById('editModuleUrl').value;
                const newCategories = document.getElementById('editModuleCategories').value;
                
                try {
                    const { categories, scores } = this.parseCategoriesAndScores(newCategories);
                    
                    // Update module
                    this.activeModule.url = newUrl;
                    this.activeModule.categories = categories;
                    this.activeModule.scores = scores;
                    
                    // Update both arrays
                    const moduleIndex = this.modules.findIndex(m => m.name === this.activeModule.name);
                    const defaultIndex = this.defaultModules.findIndex(m => m.name === this.activeModule.name);
                    
                    if (moduleIndex !== -1) this.modules[moduleIndex] = this.activeModule;
                    if (defaultIndex !== -1) this.defaultModules[defaultIndex] = this.activeModule;
                    
                    // Close dropdown and reset form
                    editDropdown.classList.remove('show');
                    editModuleForm.reset();
                    
                    console.log('Module updated successfully');
                } catch (error) {
                    console.error('Error updating module:', error);
                    this.showError(error.message);
                }
            });
        }
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

        // Handle dragging
        if (this.isDragging) {
            const deltaX = mouseX - this.lastMouseX;
            const deltaY = mouseY - this.lastMouseY;
            
            this.momentumX = deltaY * 0.001;
            this.momentumY = deltaX * 0.001;
            
            this.rotationX += this.momentumX;
            this.rotationY += this.momentumY;
        }

        // Handle hover - only show tooltip if not pinned
        if (!this.pinnedTooltip) {
            const hoveredModule = this.getHoveredModule(mouseX, mouseY);
            if (hoveredModule) {
                this.showTooltip(hoveredModule, event.clientX, event.clientY);
                this.canvas.style.cursor = 'pointer';
            } else {
                this.hideTooltip();
                this.canvas.style.cursor = 'default';
            }
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

    async showTooltip(module, x, y) {
        if (!this.tooltip) return;
        
        try {
            const description = await this.fetchModuleDescription(module);
            const faviconUrl = module.url ? 
                `https://www.google.com/s2/favicons?domain=${new URL(module.url).hostname}&sz=128` : 
                'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>';
            
            const tooltipContent = `
                <div class="tooltip-header">
                    <img src="${faviconUrl}" 
                         alt="${module.name} logo" 
                         class="tooltip-logo"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>'">
                    <strong>${module.name}</strong>
                </div>
                <div class="tooltip-body">
                    <p>${description}</p>
                    <small>
                        Categories: ${module.categories.join(', ')}<br>
                        ${Object.entries(module.scores)
                            .map(([category, score]) => 
                                `${category}: ${Math.round(score * 100)}%`)
                            .join('<br>')}
                    </small>
                </div>
            `;
            
            this.tooltip.innerHTML = tooltipContent;
            this.tooltip.style.display = 'block';
            this.tooltip.style.left = `${x + 10}px`;
            this.tooltip.style.top = `${y + 10}px`;
            
        } catch (error) {
            console.error('Error showing tooltip:', error);
        }
    }

    hideTooltip() {
        if (this.tooltip && !this.pinnedTooltip) {
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
            const screenX = (this.canvas.width / 2 / window.devicePixelRatio) + (rotated.x * this.scale);
            const screenY = (this.canvas.height / 2 / window.devicePixelRatio) + (rotated.y * this.scale);
            
            // Reduce hit area for more precise detection
            const hitRadius = 15; // Reduced from 25 to 15 for more precise clicks
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
        
        if (this.activeModule && this.pinnedTooltip) {
            this.updateTooltipPosition(this.activeModule);
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
        // Create file content
        const modulesLines = this.modules.map((module, index) => {
            const categoriesStr = module.categories.map(cat => `"${cat}"`).join(', ');
            const scoresStr = Object.entries(module.scores)
                .map(([cat, score]) => `"${cat}": ${score}`)
                .join(', ');
            
            // Add comma only if it's not the last item
            const comma = index === this.modules.length - 1 ? '' : ',';
            
            return `\t{ name: "${module.name}", categories: [${categoriesStr}], url: "${module.url}", scores: { ${scoresStr} } }${comma}`;
        });

        const fileContent = '[\n' + modulesLines.join('\n') + '\n]';
        
        // Prompt for filename
        let filename = prompt('Enter a name for your file:', 'my_modules');
        if (!filename) return; // User cancelled
        
        // Add .js extension if not present
        if (!filename.toLowerCase().endsWith('.js')) {
            filename += '.js';
        }
        
        const blob = new Blob([fileContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    addNewModule(name, url, categoriesString) {
        try {
            const { categories, scores } = this.parseCategoriesAndScores(categoriesString);
            
            // Simple validation - just check if fields are not empty
            if (!name?.trim()) {
                throw new Error('Module name is required');
            }
            if (!url?.trim()) {
                throw new Error('Module URL is required');
            }
            if (categories.length === 0) {
                throw new Error('At least one category is required');
            }

            const module = new AIModule(
                name.trim(),
                categories,
                url.trim(),
                scores
            );

            // Add to arrays
            this.modules.push(module);
            this.defaultModules.push(module);
            this.positionModuleInCloud(module);
            
            console.log('Added module:', {
                name: module.name,
                categories: module.categories,
                scores: module.scores
            });

            return true;
        } catch (error) {
            console.error('Error adding module:', error);
            this.showError(error.message);
            return false;
        }
    }

    parseCategoriesAndScores(categoriesString) {
        const categories = [];
        const scores = {};
        
        if (!categoriesString?.trim()) {
            throw new Error('Categories string is required');
        }

        categoriesString.split(',').forEach((item, index) => {
            const [category, score] = item.trim().split(':');
            
            if (!category) {
                throw new Error(`Invalid format at item ${index + 1}. Expected "Category:Score"`);
            }

            const cleanCategory = category.trim();
            const numScore = score ? parseFloat(score) : 100; // Default to 100 if no score provided

            if (isNaN(numScore) || numScore < 0 || numScore > 100) {
                throw new Error(`Invalid score for ${cleanCategory}: ${score}. Score must be between 0 and 100`);
            }

            categories.push(cleanCategory);
            scores[cleanCategory] = numScore / 100;
        });

        return { categories, scores };
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                // Extract array content between brackets
                const match = content.match(/\[([\s\S]*)\]/);
                if (!match) {
                    throw new Error('Invalid file format');
                }

                // Evaluate the array content
                const modules = eval(`[${match[1]}]`);
                this.initializeFromModules(modules);
                
                console.log('Successfully loaded', this.modules.length, 'modules');
            } catch (error) {
                console.error('Error loading file:', error);
                this.showError('Error loading file. Please check the format.');
            }
        };

        reader.readAsText(file);
    }

    drawModule(module) {
        const rotated = this.rotatePoint(module.x, module.y, module.z);
        
        // Calculate font size first
        const activeCategories = new Set(
            Array.from(document.querySelectorAll('.sidebar button.active'))
                .map(btn => btn.dataset.category)
        );
        
        // Default size
        let fontSize = 18;
        
        if (activeCategories.size > 0) {
            const score = module.getAverageScore(activeCategories);
            fontSize = 14 + ((score - 0.8) * 110);
        }
        
        // Rest of the drawing code...
        const centerX = this.canvas.width / (2 * window.devicePixelRatio);
        const centerY = this.canvas.height / (2 * window.devicePixelRatio);
        
        this.ctx.save();
        this.ctx.translate(
            centerX + (rotated.x * this.scale),
            centerY + (rotated.y * this.scale)
        );
        
        this.ctx.fillStyle = document.body.classList.contains('light-mode') ? '#000000' : '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = `${fontSize}px Heebo`;
        this.ctx.fillText(module.name, 0, 0);
        
        this.ctx.restore();
    }

    getHoveredModule(mouseX, mouseY) {
        const hoveredModule = this.modules.find(module => {
            const rotated = this.rotatePoint(module.x, module.y, module.z);
            const screenX = (this.canvas.width / 2 / window.devicePixelRatio) + (rotated.x * this.scale);
            const screenY = (this.canvas.height / 2 / window.devicePixelRatio) + (rotated.y * this.scale);
            
            // Reduce hit area for more precise detection
            const hitRadius = 15; // Reduced from 25 to 15 for more precise clicks
            const dx = mouseX - screenX;
            const dy = mouseY - screenY;
            
            return (dx * dx + dy * dy) < (hitRadius * hitRadius);
        });
        
        return hoveredModule;
    }

    setupTouchEvents() {
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                // Single touch - handle as potential tap
                const touch = e.touches[0];
                this.isDragging = true;
                this.lastMouseX = touch.clientX - this.canvas.getBoundingClientRect().left;
                this.lastMouseY = touch.clientY - this.canvas.getBoundingClientRect().top;
                
                // Store touch start time and position for tap detection
                this.touchStartTime = Date.now();
                this.touchStartPos = { x: touch.clientX, y: touch.clientY };
            } else if (e.touches.length === 2) {
                // Two fingers - initialize pinch-to-zoom
                this.lastTouchDistance = this.getTouchDistance(e.touches);
            }
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && this.isDragging) {
                // Handle rotation
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = touch.clientX - rect.left;
                const mouseY = touch.clientY - rect.top;

                const deltaX = mouseX - this.lastMouseX;
                const deltaY = mouseY - this.lastMouseY;
                
                this.momentumX = deltaY * 0.0015;
                this.momentumY = deltaX * 0.0015;
                
                this.rotationX += this.momentumX;
                this.rotationY += this.momentumY;

                this.lastMouseX = mouseX;
                this.lastMouseY = mouseY;
            } else if (e.touches.length === 2) {
                // Handle pinch-to-zoom
                const currentDistance = this.getTouchDistance(e.touches);
                const delta = currentDistance - this.lastTouchDistance;
                
                // Adjust zoom sensitivity
                this.scale *= (1 + delta * 0.01);
                
                // Limit zoom range
                this.scale = Math.max(0.5, Math.min(2, this.scale));
                
                this.lastTouchDistance = currentDistance;
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                // Check if this was a tap (quick touch without much movement)
                if (this.touchStartTime && Date.now() - this.touchStartTime < 300) {
                    const touch = e.changedTouches[0];
                    const rect = this.canvas.getBoundingClientRect();
                    const mouseX = touch.clientX - rect.left;
                    const mouseY = touch.clientY - rect.top;
                    
                    const hoveredModule = this.getHoveredModule(mouseX, mouseY);
                    if (hoveredModule && hoveredModule.url) {
                        window.open(hoveredModule.url, '_blank');
                    }
                }
                
                this.isDragging = false;
                this.lastInteractionTime = Date.now();
            }
            this.hideTooltip();
        });
    }

    getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    deleteModule(moduleName) {
        const initialLength = this.modules.length;
        
        // Remove from both arrays
        this.modules = this.modules.filter(m => m.name !== moduleName);
        this.defaultModules = this.defaultModules.filter(m => m.name !== moduleName);
        
        if (this.modules.length < initialLength) {
            console.log(`Deleted module: ${moduleName}`);
        } else {
            this.showError(`Module "${moduleName}" not found`);
        }
    }

    updateTooltipPosition(module) {
        if (!this.tooltip || !module) return;
        
        const rotated = this.rotatePoint(module.x, module.y, module.z);
        const screenX = (this.canvas.width / 2 / window.devicePixelRatio) + (rotated.x * this.scale);
        const screenY = (this.canvas.height / 2 / window.devicePixelRatio) + (rotated.y * this.scale);
        
        // Convert canvas coordinates to screen coordinates
        const rect = this.canvas.getBoundingClientRect();
        const worldX = rect.left + screenX;
        const worldY = rect.top + screenY;

        this.tooltip.style.left = `${worldX + 20}px`;  // Offset from module
        this.tooltip.style.top = `${worldY - 10}px`;   // Offset from module
    }

    async fetchModuleDescription(module) {
        if (!module.url) return 'Advanced AI model';
        
        try {
            // Check cache first
            if (this.moduleDescriptions.has(module.url)) {
                return this.moduleDescriptions.get(module.url);
            }

            const response = await fetch(module.url);
            const text = await response.text();
            
            // Parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            // Try different meta tags in order of preference
            const description = 
                doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
                
            if (description) {
                // Clean and cache the description
                const cleanDescription = description
                    .replace(/\s+/g, ' ')
                    .trim();
                
                this.moduleDescriptions.set(module.url, cleanDescription);
                return cleanDescription;
            }
            
            // If no description found, return the module name only
            return module.name;
            
        } catch (error) {
            console.error('Error fetching description:', error);
            return module.name;
        }
    }

    updateTooltipPosition(x, y) {
        if (this.tooltip && this.tooltip.style.display === 'block') {
            this.tooltip.style.left = `${x + 10}px`;
            this.tooltip.style.top = `${y + 10}px`;
        }
    }
}

new ModuleCloud();
