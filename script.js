class OverlayManager {
    constructor() {
        this.overlayContainer = document.querySelector('.overlay-container');
        this.activeOverlays = new Set();
        this.intervalId = null;
        
        // Track sequence state
        this.sequenceState = 'start'; // 'start', 'follow', 'filler', 'preEnd', 'end'
        this.fillerCount = 0;
        this.maxFillers = 3;
        this.minFillers = 1;
        
        // Video management
        this.videoElements = [
            document.getElementById('memeVideo1'),
            document.getElementById('memeVideo2'),
            document.getElementById('memeVideo3'),
            document.getElementById('memeVideo4'),
            document.getElementById('memeVideo5'),
            document.getElementById('memeVideo6'),
            document.getElementById('memeVideo7')
        ];
        this.currentVideoIndex = 0;
        
        this.init();
    }
    
    init() {
        // Start the categorized overlay display
        this.startCategorizedOverlays();
        
        // Set up video system
        this.setupVideoSystem();
    }
    
    setupVideoSystem() {
        // Set up all videos
        this.videoElements.forEach((video, index) => {
            // Preload all videos
            video.load();
            
            // Add ended event listener to each video
            video.addEventListener('ended', () => {
                console.log(`Video ${index + 1} ended naturally, switching to next...`);
                this.switchToNextVideo();
            });
        });
        
        // Set first video as active
        this.setActiveVideo(0);
        
        // No timer - videos will switch only when they naturally end
    }
    
    setActiveVideo(index) {
        // Hide all videos
        this.videoElements.forEach(video => {
            video.classList.remove('active');
            video.pause();
        });
        
        // Show and play the selected video
        const activeVideo = this.videoElements[index];
        activeVideo.classList.add('active');
        activeVideo.currentTime = 0; // Start from beginning
        activeVideo.play().catch(e => {
            console.log('Video play failed:', e);
        });
        
        this.currentVideoIndex = index;
        console.log(`Switching to video ${index + 1}`);
    }
    
    switchToNextVideo() {
        // Select next video (different from current one)
        let nextVideoIndex;
        if (this.videoElements.length > 1) {
            // Keep trying until we get a different video
            do {
                nextVideoIndex = Math.floor(Math.random() * this.videoElements.length);
            } while (nextVideoIndex === this.currentVideoIndex);
        } else {
            nextVideoIndex = 0;
        }
        
        console.log(`Switching from video ${this.currentVideoIndex + 1} to video ${nextVideoIndex + 1}`);
        this.setActiveVideo(nextVideoIndex);
    }
    
    startCategorizedOverlays() {
        const showNextOverlay = () => {
            // Clear any existing overlays
            this.clearAllOverlays();
            
            // Show next overlay based on sequence state
            this.showNextCategorizedOverlay();
            
            // Schedule next overlay
            const delay = this.getRandomInterval();
            this.intervalId = setTimeout(showNextOverlay, delay);
        };
        
        // Start immediately
        showNextOverlay();
    }
    
    getRandomInterval() {
        const { min, max } = overlayConfig.intervalRange;
        return Math.random() * (max - min) + min;
    }
    
    showNextCategorizedOverlay() {
        const nextOverlay = this.getNextCategorizedOverlay();
        if (nextOverlay) {
            this.createAndShowOverlay(nextOverlay);
        }
    }
    
    getNextCategorizedOverlay() {
        const overlays = overlayConfig.overlays;
        
        // Safety check - ensure overlays exist
        if (!overlays || !overlays.start || !overlays.follow || !overlays.filler || !overlays.preEnd || !overlays.end) {
            console.error('Overlay configuration is missing or incomplete');
            return null;
        }
        
        if (this.sequenceState === 'start') {
            // Show a random start overlay
            const startOverlays = overlays.start;
            if (startOverlays.length === 0) return null;
            
            const randomStart = startOverlays[Math.floor(Math.random() * startOverlays.length)];
            
            // Move to follow state
            this.sequenceState = 'follow';
            
            return randomStart;
            
        } else if (this.sequenceState === 'follow') {
            // Show a random follow overlay
            const followOverlays = overlays.follow;
            if (followOverlays.length === 0) return null;
            
            const randomFollow = followOverlays[Math.floor(Math.random() * followOverlays.length)];
            
            // Move to filler state
            this.sequenceState = 'filler';
            this.fillerCount = 0;
            
            return randomFollow;
            
        } else if (this.sequenceState === 'filler') {
            // Show a random filler overlay
            const fillerOverlays = overlays.filler;
            if (fillerOverlays.length === 0) return null;
            
            const randomFiller = fillerOverlays[Math.floor(Math.random() * fillerOverlays.length)];
            
            this.fillerCount++;
            
            // Check if we should move to preEnd state
            const shouldPreEnd = this.fillerCount >= this.minFillers && 
                                (this.fillerCount >= this.maxFillers || Math.random() < 0.4);
            
            if (shouldPreEnd) {
                this.sequenceState = 'preEnd';
            }
            
            return randomFiller;
            
        } else if (this.sequenceState === 'preEnd') {
            // Show a random preEnd overlay
            const preEndOverlays = overlays.preEnd;
            if (preEndOverlays.length === 0) return null;
            
            const randomPreEnd = preEndOverlays[Math.floor(Math.random() * preEndOverlays.length)];
            
            // Move to end state
            this.sequenceState = 'end';
            
            return randomPreEnd;
            
        } else if (this.sequenceState === 'end') {
            // Show a random end overlay
            const endOverlays = overlays.end;
            if (endOverlays.length === 0) return null;
            
            const randomEnd = endOverlays[Math.floor(Math.random() * endOverlays.length)];
            
            // Reset to start state for next sequence
            this.sequenceState = 'start';
            this.fillerCount = 0;
            
            return randomEnd;
        }
        
        return null;
    }
    
    createAndShowOverlay(overlayData) {
        const overlay = document.createElement('div');
        overlay.className = `overlay position-${overlayData.position}`;
        
        if (overlayData.type === 'text') {
            const textElement = document.createElement('div');
            textElement.className = 'overlay-text';
            
            // Add random size class for variable text sizing
            const sizes = ['size-small', 'size-medium', 'size-large', 'size-extra-large'];
            const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
            textElement.classList.add(randomSize);
            
            textElement.textContent = overlayData.content;
            overlay.appendChild(textElement);
        } else if (overlayData.type === 'image') {
            const imageElement = document.createElement('img');
            imageElement.className = 'overlay-image';
            imageElement.src = overlayData.content;
            imageElement.alt = 'Overlay image';
            overlay.appendChild(imageElement);
        }
        
        this.overlayContainer.appendChild(overlay);
        this.activeOverlays.add(overlay);
        
        // Trigger fade-in animation
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });
        
        // Auto-remove after duration
        const duration = overlayData.duration || 3000;
        setTimeout(() => {
            this.removeOverlay(overlay);
        }, duration);
    }
    
    removeOverlay(overlay) {
        overlay.classList.remove('visible');
        
        // Remove from DOM after fade-out transition
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            this.activeOverlays.delete(overlay);
        }, 500); // Match CSS transition duration
    }
    
    clearAllOverlays() {
        this.activeOverlays.forEach(overlay => {
            this.removeOverlay(overlay);
        });
        this.activeOverlays.clear();
    }
    
    // Public method to add new overlay dynamically
    addOverlay(type, content, position, duration = 3000) {
        const overlayData = {
            type,
            content,
            position,
            duration
        };
        
        this.createAndShowOverlay(overlayData);
    }
    
    // Public method to stop the overlay system
    stop() {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
        this.clearAllOverlays();
    }
    
    // Public method to restart the overlay system
    restart() {
        this.stop();
        // Reset sequence state to beginning
        this.sequenceState = 'start';
        this.fillerCount = 0;
        this.startCategorizedOverlays();
    }
    
    // Public method to switch to next video
    switchVideo() {
        this.switchToNextVideo();
    }
}

// Initialize the overlay manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.overlayManager = new OverlayManager();
    
    // Add some keyboard controls for testing
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                // Spacebar to manually trigger next categorized overlay
                window.overlayManager.showNextCategorizedOverlay();
                break;
            case 'r':
                // R to restart the system
                window.overlayManager.restart();
                break;
            case 'c':
                // C to clear all overlays
                window.overlayManager.clearAllOverlays();
                break;
            case 'v':
                // V to switch to next video
                window.overlayManager.switchVideo();
                break;
        }
    });
    
    console.log('Overlay system initialized!');
    console.log('Controls: Spacebar = show next categorized overlay, R = restart, C = clear all, V = switch video');
    console.log('Sequence: Start → Follow → 1-3 Fillers → PreEnd → End → repeat');
    console.log('Videos: Random selection between available meme videos');
});
