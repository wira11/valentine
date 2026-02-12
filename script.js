// ========================================
// GLOBAL VARIABLES
// ========================================

const cardContainer = document.getElementById('cardContainer');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const playfulMessage = document.getElementById('playfulMessage');
const celebrationContainer = document.getElementById('celebrationContainer');
const confettiCanvas = document.getElementById('confettiCanvas');
const heartsBackground = document.getElementById('heartsBackground');

// Playful messages when user tries to click "No"
const playfulMessages = [
    "Are you sure? 🥺",
    "Think again...",
    "Please don't break my heart 💔",
    "Try clicking Yes instead 😉",
    "Give me a chance! 💕",
    "You know you want to say yes... 🌹",
    "Don't be shy! 💖",
    "Pretty please? 🙏",
    "I believe in us! ✨",
    "One more chance? 🎈"
];

let messageIndex = 0;

// ========================================
// FLOATING HEARTS BACKGROUND
// ========================================

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '❤️';
    
    // Random horizontal position
    heart.style.left = Math.random() * 100 + '%';
    
    // Random animation duration (6-12 seconds)
    heart.style.animationDuration = (6 + Math.random() * 6) + 's';
    
    // Random delay
    heart.style.animationDelay = Math.random() * 5 + 's';
    
    // Random size
    const size = 15 + Math.random() * 15;
    heart.style.fontSize = size + 'px';
    
    heartsBackground.appendChild(heart);
    
    // Remove heart after animation completes
    setTimeout(() => {
        heart.remove();
    }, (6 + Math.random() * 6) * 1000);
}

// Create initial hearts
for (let i = 0; i < 15; i++) {
    createFloatingHeart();
}

// Continuously create new hearts
setInterval(createFloatingHeart, 800);

// ========================================
// NO BUTTON ESCAPE BEHAVIOR
// ========================================

function moveNoButton() {
    // Get ACTUAL visible viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get body padding
    const bodyStyle = window.getComputedStyle(document.body);
    const bodyPaddingLeft = parseFloat(bodyStyle.paddingLeft) || 0;
    const bodyPaddingRight = parseFloat(bodyStyle.paddingRight) || 0;
    const bodyPaddingTop = parseFloat(bodyStyle.paddingTop) || 0;
    const bodyPaddingBottom = parseFloat(bodyStyle.paddingBottom) || 0;
    
    // Get button actual dimensions
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    
    // AGGRESSIVE safety margin - 80px from all edges
    const safetyMargin = 80;
    
    // Calculate ULTRA STRICT boundaries
    const minX = bodyPaddingLeft + safetyMargin;
    const minY = bodyPaddingTop + safetyMargin;
    
    // MAX Y is the critical one - be VERY conservative
    // Use 70% of viewport height to be absolutely safe
    const safeViewportHeight = viewportHeight * 0.7;
    const maxX = viewportWidth - btnWidth - bodyPaddingRight - safetyMargin;
    const maxY = safeViewportHeight - btnHeight - safetyMargin;
    
    console.log('=== BUTTON MOVE DEBUG ===');
    console.log('Viewport:', viewportWidth, 'x', viewportHeight);
    console.log('Button size:', btnWidth, 'x', btnHeight);
    console.log('Safe viewport height:', safeViewportHeight);
    console.log('Y Range:', minY, 'to', maxY);
    console.log('Max bottom edge allowed:', maxY + btnHeight);
    
    // If boundaries are too tight, just center it
    if (maxX <= minX || maxY <= minY) {
        noBtn.classList.add('escaped');
        noBtn.style.position = 'fixed';
        noBtn.style.left = '50%';
        noBtn.style.top = '40%'; // Keep in upper half
        noBtn.style.transform = 'translate(-50%, -50%)';
        updatePlayfulMessage();
        return;
    }
    
    // Get current position
    const currentRect = noBtn.getBoundingClientRect();
    const currentCenterX = currentRect.left + btnWidth / 2;
    const currentCenterY = currentRect.top + btnHeight / 2;
    
    // Minimum distance
    const minDistance = 100;
    
    // Find valid position
    let randomX, randomY;
    let attempts = 0;
    let validPosition = false;
    
    while (attempts < 50 && !validPosition) {
        // Generate position in SAFE zone only
        randomX = minX + Math.random() * (maxX - minX);
        randomY = minY + Math.random() * (maxY - minY);
        
        // Calculate distance
        const newCenterX = randomX + btnWidth / 2;
        const newCenterY = randomY + btnHeight / 2;
        const distance = Math.sqrt(
            Math.pow(newCenterX - currentCenterX, 2) + 
            Math.pow(newCenterY - currentCenterY, 2)
        );
        
        // CRITICAL: Check bottom edge won't exceed safe zone
        const bottomEdge = randomY + btnHeight;
        const isFullyVisible = 
            randomX >= minX &&
            randomY >= minY &&
            randomX + btnWidth <= maxX + btnWidth &&
            bottomEdge <= safeViewportHeight - safetyMargin;
        
        if (distance >= minDistance && isFullyVisible) {
            validPosition = true;
        }
        
        attempts++;
    }
    
    // Fallback: use ultra-safe center position
    if (!validPosition) {
        randomX = viewportWidth / 2 - btnWidth / 2;
        randomY = viewportHeight / 3 - btnHeight / 2; // Upper third only
    }
    
    // TRIPLE CHECK: Force clamp to safe zone
    randomX = Math.max(minX, Math.min(randomX, maxX));
    randomY = Math.max(minY, Math.min(randomY, maxY));
    
    // FINAL VERIFICATION: Check bottom edge
    if (randomY + btnHeight > safeViewportHeight - safetyMargin) {
        randomY = safeViewportHeight - btnHeight - safetyMargin;
    }
    
    // Ensure Y never exceeds 60% of viewport
    const maxAllowedY = viewportHeight * 0.6;
    if (randomY > maxAllowedY) {
        randomY = maxAllowedY;
    }
    
    console.log('Final X:', randomX);
    console.log('Final Y:', randomY);
    console.log('Final bottom edge:', randomY + btnHeight);
    console.log('========================');
    
    // Apply position
    noBtn.classList.add('escaped');
    noBtn.style.position = 'fixed';
    noBtn.style.left = Math.round(randomX) + 'px';
    noBtn.style.top = Math.round(randomY) + 'px';
    noBtn.style.transform = 'none'; // NO transform to avoid any overflow
    
    updatePlayfulMessage();
}

function updatePlayfulMessage() {
    playfulMessage.textContent = playfulMessages[messageIndex % playfulMessages.length];
    playfulMessage.style.animation = 'none';
    setTimeout(() => {
        playfulMessage.style.animation = 'bounce 0.5s ease';
    }, 10);
    messageIndex++;
}

// Event listeners for NO button
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Prevent clicking No button (it will move before click completes)
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

// CRITICAL: Handle window resize - reposition button if it's outside viewport
window.addEventListener('resize', () => {
    // Only adjust if button has already escaped
    if (noBtn.classList.contains('escaped')) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        
        const currentLeft = parseInt(noBtn.style.left) || 0;
        const currentTop = parseInt(noBtn.style.top) || 0;
        
        const safetyMargin = 80;
        const maxAllowedX = viewportWidth - btnWidth - safetyMargin;
        const maxAllowedY = viewportHeight * 0.6; // Max 60% viewport height
        
        let needsReposition = false;
        let newLeft = currentLeft;
        let newTop = currentTop;
        
        // Check if button is outside safe zone
        if (currentLeft < safetyMargin) {
            newLeft = safetyMargin;
            needsReposition = true;
        }
        if (currentLeft > maxAllowedX) {
            newLeft = maxAllowedX;
            needsReposition = true;
        }
        if (currentTop < safetyMargin) {
            newTop = safetyMargin;
            needsReposition = true;
        }
        if (currentTop > maxAllowedY || (currentTop + btnHeight) > viewportHeight - safetyMargin) {
            newTop = Math.min(maxAllowedY, viewportHeight - btnHeight - safetyMargin);
            needsReposition = true;
        }
        
        // Reposition if needed
        if (needsReposition) {
            noBtn.style.left = Math.round(newLeft) + 'px';
            noBtn.style.top = Math.round(newTop) + 'px';
            console.log('🔄 Button repositioned due to resize:', newLeft, newTop);
        }
    }
});

// Prevent clicking No button (it will move before click completes)
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

// ========================================
// YES BUTTON CELEBRATION
// ========================================

yesBtn.addEventListener('click', () => {
    // Fade out the card
    cardContainer.classList.add('fade-out');
    
    // Wait for card to fade out, then show celebration
    setTimeout(() => {
        cardContainer.style.display = 'none';
        celebrationContainer.classList.add('active');
        
        // Start confetti after flower blooms (4 seconds)
        setTimeout(() => {
            startConfetti();
        }, 4000);
        
        // Create continuous floating hearts
        setInterval(() => {
            createCelebrationHeart();
        }, 300);
    }, 800);
});

// ========================================
// CELEBRATION HEARTS
// ========================================

function createCelebrationHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)];
    
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (4 + Math.random() * 4) + 's';
    heart.style.fontSize = (20 + Math.random() * 20) + 'px';
    
    celebrationContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// ========================================
// CONFETTI ANIMATION
// ========================================

function startConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 150;
    const colors = ['#ff4d6d', '#ff8fa3', '#ffc2d1', '#ffe5ec', '#ffd700', '#b5179e'];
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * confettiCanvas.height;
        }
        
        reset() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = -10;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            this.opacity = 1;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            
            // Fade out near bottom
            if (this.y > confettiCanvas.height - 100) {
                this.opacity -= 0.02;
            }
            
            // Reset when off screen
            if (this.y > confettiCanvas.height || this.opacity <= 0) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Draw confetti as rectangle or circle
            if (Math.random() > 0.5) {
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ========================================
// FIREWORKS (ALTERNATIVE TO CONFETTI)
// ========================================

// Uncomment this section and comment out confetti if you prefer fireworks

/*
function startFireworks() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    const fireworks = [];
    const particles = [];
    const colors = ['#ff4d6d', '#ff8fa3', '#ffc2d1', '#ffe5ec', '#ffd700', '#b5179e'];
    
    class Firework {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = confettiCanvas.height;
            this.targetY = Math.random() * (confettiCanvas.height / 2);
            this.speed = 5;
            this.angle = -Math.PI / 2;
            this.exploded = false;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            if (!this.exploded) {
                this.y -= this.speed;
                if (this.y <= this.targetY) {
                    this.explode();
                    this.exploded = true;
                }
            }
        }
        
        draw() {
            if (!this.exploded) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
        
        explode() {
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(this.x, this.y, this.color));
            }
        }
    }
    
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 5 + 2;
            this.friction = 0.95;
            this.gravity = 0.3;
            this.opacity = 1;
            this.decay = Math.random() * 0.03 + 0.01;
        }
        
        update() {
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.opacity -= this.decay;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        if (Math.random() < 0.05) {
            fireworks.push(new Firework());
        }
        
        fireworks.forEach((firework, index) => {
            firework.update();
            firework.draw();
            if (firework.exploded) {
                fireworks.splice(index, 1);
            }
        });
        
        particles.forEach((particle, index) => {
            particle.update();
            particle.draw();
            if (particle.opacity <= 0) {
                particles.splice(index, 1);
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
*/

// ========================================
// RESPONSIVE ADJUSTMENTS
// ========================================

window.addEventListener('resize', () => {
    if (confettiCanvas.width > 0) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});

// ========================================
// PREVENT SCROLLING
// ========================================

document.body.style.overflow = 'hidden';

// ========================================
// PAGE LOAD ANIMATION
// ========================================

window.addEventListener('load', () => {
    // Ensure card fades in smoothly
    cardContainer.style.opacity = '1';
    
    // Display screen size info
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    console.log('%c📐 SCREEN INFO 📐', 'color: #ff4d6d; font-size: 16px; font-weight: bold;');
    console.log(`Viewport: ${screenWidth} x ${screenHeight} pixels`);
    console.log(`Screen: ${window.screen.width} x ${window.screen.height} pixels`);
    console.log(`Device Pixel Ratio: ${window.devicePixelRatio}`);
    
    // Show on screen temporarily
    const sizeDisplay = document.createElement('div');
    sizeDisplay.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        font-family: monospace;
    `;
    sizeDisplay.innerHTML = `Viewport: ${screenWidth} x ${screenHeight}`;
    document.body.appendChild(sizeDisplay);
    
    // Remove after 5 seconds
    setTimeout(() => {
        sizeDisplay.remove();
    }, 5000);
});

// ========================================
// CONSOLE MESSAGE (EASTER EGG)
// ========================================

console.log('%c💖 Happy Valentine\'s Day! 💖', 'color: #ff4d6d; font-size: 24px; font-weight: bold;');
console.log('%cMade with love ❤️', 'color: #b5179e; font-size: 14px;');
