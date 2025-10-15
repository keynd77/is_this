class MemeMaker {
    constructor() {
        this.stage = null;
        this.layer = null;
        this.backgroundImage = null;
        this.textNodes = [];
        this.imageNodes = [];
        this.selectedNode = null;
        
        this.init();
    }
    
    init() {
        // Get container dimensions
        const container = document.getElementById('konva-container');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Create Konva stage
        this.stage = new Konva.Stage({
            container: 'konva-container',
            width: containerWidth,
            height: containerHeight,
            draggable: false
        });
        
        // Create layer
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        
        // Load background template
        this.loadBackgroundTemplate();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    loadBackgroundTemplate() {
        const imageObj = new Image();
        imageObj.onload = () => {
            // Calculate dimensions to fit full width while maintaining aspect ratio
            const containerWidth = this.stage.width();
            const containerHeight = this.stage.height();
            
            const imageAspectRatio = imageObj.width / imageObj.height;
            const containerAspectRatio = containerWidth / containerHeight;
            
            let imageWidth, imageHeight;
            
            if (imageAspectRatio > containerAspectRatio) {
                // Image is wider - fit to width
                imageWidth = containerWidth;
                imageHeight = containerWidth / imageAspectRatio;
            } else {
                // Image is taller - fit to height
                imageHeight = containerHeight;
                imageWidth = containerHeight * imageAspectRatio;
            }
            
            // Center the image
            const x = (containerWidth - imageWidth) / 2;
            const y = (containerHeight - imageHeight) / 2;
            
            this.backgroundImage = new Konva.Image({
                x: x,
                y: y,
                image: imageObj,
                width: imageWidth,
                height: imageHeight,
                draggable: false
            });
            
            this.layer.add(this.backgroundImage);
            this.layer.draw();
        };
        
        imageObj.src = 'assets/images/meme_template.png';
    }
    
    setupEventListeners() {
        // Add text button
        document.getElementById('addTextBtn').addEventListener('click', () => {
            this.addText();
        });
        
        // Add image button
        document.getElementById('addImageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });
        
        // Image input
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
        
        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadMeme();
        });
        
        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearCanvas();
        });
        
        // Stage click to deselect
        this.stage.on('click tap', (e) => {
            if (e.target === this.stage || e.target === this.backgroundImage) {
                // Clicked on stage or background - deselect all
                this.deselectAll();
            } else {
                // Clicked on a text or image element - select it
                this.selectNode(e.target);
            }
        });
        
        // Double click on text to edit
        this.stage.on('dblclick dbltap', (e) => {
            if (e.target.getClassName() === 'Text') {
                this.enableTextEditing(e.target);
            }
        });
    }
    
    addText() {
        const text = new Konva.Text({
            x: this.stage.width() / 2 - 100,
            y: this.stage.height() / 2 - 15,
            text: 'Your Text Here',
            fontSize: 24,
            fontFamily: 'Impact',
            fill: 'white',
            stroke: 'black',
            strokeWidth: 2,
            width: 200, // Enable multi-line text wrapping
            align: 'center', // Center align multi-line text
            draggable: true,
            id: 'text-' + Date.now()
        });
        
        // Center text
        text.offsetX(text.width() / 2);
        text.offsetY(text.height() / 2);
        
        this.layer.add(text);
        this.textNodes.push(text);
        this.selectNode(text);
        this.layer.draw();
        
        // Enable editing
        this.enableTextEditing(text);
    }
    
    enableTextEditing(textNode) {
        // Remove any existing textarea
        const existingTextarea = document.querySelector('.text-editor');
        if (existingTextarea) {
            existingTextarea.remove();
        }
        
        const textPosition = textNode.absolutePosition();
        const stageBox = this.stage.container().getBoundingClientRect();
        
        const areaPosition = {
            x: stageBox.left + textPosition.x - textNode.offsetX(),
            y: stageBox.top + textPosition.y - textNode.offsetY(),
        };
        
        // Create textarea for editing
        const textarea = document.createElement('textarea');
        textarea.className = 'text-editor';
        document.body.appendChild(textarea);
        
        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = areaPosition.y + 'px';
        textarea.style.left = areaPosition.x + 'px';
        textarea.style.width = Math.max(textNode.width(), 200) + 'px';
        textarea.style.height = Math.max(textNode.height(), 60) + 'px'; // Increased height for multi-line
        textarea.style.resize = 'both'; // Allow manual resizing
        textarea.style.overflow = 'auto'; // Handle overflow with scrollbars
        textarea.style.fontSize = textNode.fontSize() + 'px';
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.fontWeight = textNode.fontStyle();
        textarea.style.border = '2px solid #007bff';
        textarea.style.padding = '4px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'rgba(0, 0, 0, 0.8)';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = 'center';
        textarea.style.color = 'white';
        textarea.style.borderRadius = '4px';
        textarea.style.zIndex = '1000';
        textarea.style.textShadow = '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000';
        
        // Focus and position cursor at the end
        textarea.focus();
        // Position cursor at the end instead of selecting all
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        
        const removeTextarea = () => {
            if (textarea.parentNode) {
                textarea.remove();
            }
        };
        
        const updateText = () => {
            if (textarea.value.trim() === '') {
                // Don't allow empty text, keep previous value
                textarea.value = textNode.text();
                return;
            }
            
            textNode.text(textarea.value);
            // Recalculate text dimensions
            textNode.offsetX(textNode.width() / 2);
            textNode.offsetY(textNode.height() / 2);
            this.layer.draw();
        };
        
        // Remove real-time updates to prevent cursor issues
        // textarea.addEventListener('input', (e) => {
        //     e.stopPropagation();
        //     updateText();
        // });
        
        textarea.addEventListener('keydown', (e) => {
            // Stop event propagation to prevent interference
            e.stopPropagation();
            
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (textarea.value.trim() !== '') {
                    updateText();
                    removeTextarea();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                removeTextarea();
                this.layer.draw();
            } else if (e.key === 'Delete' && e.ctrlKey) {
                e.preventDefault();
                // Delete text node
                textNode.destroy();
                removeTextarea();
                this.deselectAll();
                this.layer.draw();
            }
            // Let all other keys (including Backspace) work normally
        });
        
        textarea.addEventListener('blur', () => {
            // Only update if text is not empty
            if (textarea.value.trim() !== '') {
                updateText();
            }
            removeTextarea();
        });
        
        // Handle window resize
        const handleResize = () => {
            const newTextPosition = textNode.absolutePosition();
            const newStageBox = this.stage.container().getBoundingClientRect();
            
            textarea.style.top = (newStageBox.top + newTextPosition.y - textNode.offsetY()) + 'px';
            textarea.style.left = (newStageBox.left + newTextPosition.x - textNode.offsetX()) + 'px';
        };
        
        window.addEventListener('resize', handleResize);
        
        // Clean up resize listener when textarea is removed
        const originalRemove = removeTextarea;
        removeTextarea = () => {
            window.removeEventListener('resize', handleResize);
            originalRemove();
        };
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageObj = new Image();
            imageObj.onload = () => {
                // Calculate original proportions and scale to fit reasonably
                const maxSize = 300; // Maximum width or height
                let width = imageObj.width;
                let height = imageObj.height;
                
                // Scale down if too large, maintaining proportions
                if (width > maxSize || height > maxSize) {
                    const scale = maxSize / Math.max(width, height);
                    width *= scale;
                    height *= scale;
                }
                
                // Create image node with original proportions
                const imageNode = new Konva.Image({
                    x: this.stage.width() / 2 - width / 2,
                    y: this.stage.height() / 2 - height / 2,
                    image: imageObj,
                    width: width,
                    height: height,
                    draggable: true,
                    id: 'image-' + Date.now()
                });
                
                this.layer.add(imageNode);
                this.imageNodes.push(imageNode);
                this.selectNode(imageNode);
                this.layer.draw();
            };
            imageObj.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    selectNode(node) {
        // Don't select background image
        if (node === this.backgroundImage) {
            return;
        }
        
        this.deselectAll();
        this.selectedNode = node;
        
        // Add selection rectangle with all transformation options
        const transformer = new Konva.Transformer({
            nodes: [node],
            enabledAnchors: [
                'top-left', 'top-center', 'top-right',
                'middle-left', 'middle-right',
                'bottom-left', 'bottom-center', 'bottom-right'
            ],
            enabledBorderAnchors: [
                'top-left', 'top-center', 'top-right',
                'middle-left', 'middle-right',
                'bottom-left', 'bottom-center', 'bottom-right'
            ],
            rotateEnabled: true, // Enable rotation
            keepRatio: false, // Allow non-proportional scaling for both text and images
            boundBoxFunc: (oldBox, newBox) => {
                // Allow negative scaling for mirroring effect
                // Only prevent extremely small sizes (but allow negative)
                if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                    return oldBox;
                }
                return newBox;
            }
        });
        
        // Allow negative scaling for mirroring effect
        // No transform event listener needed - Konva handles negative scaling naturally
        
        this.layer.add(transformer);
        
        // Add delete button
        this.addDeleteButton(node);
        
        this.layer.draw();
        
        // Add keyboard event listener for deletion
        this.addKeyboardListeners();
    }
    
    addDeleteButton(node) {
        // Remove existing delete button if any
        this.removeDeleteButton();
        
        // Get node position and size
        const nodeBox = node.getClientRect();
        const stageBox = this.stage.container().getBoundingClientRect();
        
        // Create delete button
        const deleteBtn = new Konva.Group({
            x: nodeBox.x + nodeBox.width - 10,
            y: nodeBox.y - 10,
            draggable: false
        });
        
        // Background circle
        const bg = new Konva.Circle({
            radius: 12,
            fill: '#ff4444',
            stroke: '#ffffff',
            strokeWidth: 2,
            shadowColor: 'black',
            shadowBlur: 4,
            shadowOffset: { x: 2, y: 2 },
            shadowOpacity: 0.3
        });
        
        // X symbol
        const xSymbol = new Konva.Text({
            text: '×',
            fontSize: 16,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle',
            x: -8,
            y: -8,
            width: 16,
            height: 16
        });
        
        deleteBtn.add(bg);
        deleteBtn.add(xSymbol);
        
        // Add click handler
        deleteBtn.on('click tap', () => {
            this.deleteSelectedNode();
        });
        
        // Add hover effects
        deleteBtn.on('mouseenter', () => {
            bg.fill('#ff6666');
            this.stage.container().style.cursor = 'pointer';
        });
        
        deleteBtn.on('mouseleave', () => {
            bg.fill('#ff4444');
            this.stage.container().style.cursor = 'default';
        });
        
        this.layer.add(deleteBtn);
        this.deleteButton = deleteBtn;
        
        // Update button position when node moves
        node.on('dragmove', () => {
            this.updateDeleteButtonPosition();
        });
        
        node.on('transform', () => {
            this.updateDeleteButtonPosition();
        });
    }
    
    updateDeleteButtonPosition() {
        if (this.deleteButton && this.selectedNode) {
            const nodeBox = this.selectedNode.getClientRect();
            this.deleteButton.position({
                x: nodeBox.x + nodeBox.width - 10,
                y: nodeBox.y - 10
            });
            this.layer.draw();
        }
    }
    
    removeDeleteButton() {
        if (this.deleteButton) {
            this.deleteButton.destroy();
            this.deleteButton = null;
        }
    }
    
    deleteSelectedNode() {
        if (this.selectedNode) {
            // Remove from arrays
            const textIndex = this.textNodes.indexOf(this.selectedNode);
            if (textIndex > -1) {
                this.textNodes.splice(textIndex, 1);
            }
            
            const imageIndex = this.imageNodes.indexOf(this.selectedNode);
            if (imageIndex > -1) {
                this.imageNodes.splice(imageIndex, 1);
            }
            
            // Remove from layer
            this.selectedNode.destroy();
            this.deselectAll();
            this.layer.draw();
        }
    }
    
    deselectAll() {
        this.selectedNode = null;
        const transformer = this.layer.findOne('Transformer');
        if (transformer) {
            transformer.destroy();
        }
        this.removeDeleteButton();
        this.layer.draw();
        this.removeKeyboardListeners();
    }
    
    addKeyboardListeners() {
        this.keyboardHandler = (e) => {
            // Don't interfere if text is being edited
            if (document.querySelector('.text-editor')) {
                return;
            }
            
            if (this.selectedNode) {
                if (e.key === 'Delete') {
                    // Only Delete key (not Backspace) deletes the node
                    this.deleteSelectedNode();
                } else if (e.key === 'Escape') {
                    // Deselect
                    this.deselectAll();
                } else if (e.key === 'Enter' && this.selectedNode.getClassName() === 'Text') {
                    // Edit text
                    this.enableTextEditing(this.selectedNode);
                }
            }
        };
        
        document.addEventListener('keydown', this.keyboardHandler);
    }
    
    removeKeyboardListeners() {
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
            this.keyboardHandler = null;
        }
    }
    
    clearCanvas() {
        // Remove all text and image nodes
        this.textNodes.forEach(node => node.destroy());
        this.imageNodes.forEach(node => node.destroy());
        this.textNodes = [];
        this.imageNodes = [];
        this.deselectAll();
        this.layer.draw();
    }
    
    downloadMeme() {
        const dataURL = this.stage.toDataURL({
            mimeType: 'image/png',
            quality: 1,
            pixelRatio: 2
        });
        
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    handleResize() {
        const container = document.getElementById('konva-container');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        this.stage.width(containerWidth);
        this.stage.height(containerHeight);
        
        // Recalculate background image size
        if (this.backgroundImage) {
            const imageObj = this.backgroundImage.image();
            const imageAspectRatio = imageObj.width / imageObj.height;
            const containerAspectRatio = containerWidth / containerHeight;
            
            let imageWidth, imageHeight;
            
            if (imageAspectRatio > containerAspectRatio) {
                imageWidth = containerWidth;
                imageHeight = containerWidth / imageAspectRatio;
            } else {
                imageHeight = containerHeight;
                imageWidth = containerHeight * imageAspectRatio;
            }
            
            const x = (containerWidth - imageWidth) / 2;
            const y = (containerHeight - imageHeight) / 2;
            
            this.backgroundImage.x(x);
            this.backgroundImage.y(y);
            this.backgroundImage.width(imageWidth);
            this.backgroundImage.height(imageHeight);
        }
        
        this.layer.draw();
    }
}

// Initialize meme maker when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemeMaker();
});
