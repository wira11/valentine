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
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get body padding/margin
    const bodyStyle = window.getComputedStyle(document.body);
    const bodyPaddingLeft = parseFloat(bodyStyle.paddingLeft) || 0;
    const bodyPaddingRight = parseFloat(bodyStyle.paddingRight) || 0;
    const bodyPaddingTop = parseFloat(bodyStyle.paddingTop) || 0;
    const bodyPaddingBottom = parseFloat(bodyStyle.paddingBottom) || 0;
    
    // Get button dimensions
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    
    // Calculate safe boundaries (respecting body padding)
    const minX = bodyPaddingLeft;
    const minY = bodyPaddingTop;
    const maxX = viewportWidth - btnWidth - bodyPaddingRight;
    const maxY = viewportHeight - btnHeight - bodyPaddingBottom;
    
    // Ensure we have valid boundaries
    if (maxX < minX || maxY < minY) {
        // Viewport too small, just center it
        noBtn.style.position = 'fixed';
        noBtn.style.left = '50%';
        noBtn.style.top = '50%';
        noBtn.style.transform = 'translate(-50%, -50%)';
        return;
    }
    
    // Generate random position within safe boundaries
    let randomX = minX + Math.random() * (maxX - minX);
    let randomY = minY + Math.random() * (maxY - minY);
    
    // Ensure minimum distance from current position
    const currentRect = noBtn.getBoundingClientRect();
    const minDistance = Math.min(150, viewportWidth * 0.25); // Adaptive minimum distance
    
    let attempts = 0;
    while (attempts < 10) {
        const distance = Math.sqrt(
            Math.pow(randomX - currentRect.left, 2) + 
            Math.pow(randomY - currentRect.top, 2)
        );
        
        if (distance > minDistance) {
            break;
        }
        
        randomX = minX + Math.random() * (maxX - minX);
        randomY = minY + Math.random() * (maxY - minY);
        attempts++;
    }
    
    // Clamp values to ensure they're within bounds
    randomX = Math.max(minX, Math.min(randomX, maxX));
    randomY = Math.max(minY, Math.min(randomY, maxY));
    
    // Apply position and add escaped class
    noBtn.classList.add('escaped');
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Add random rotation for fun (smaller on mobile)
    const isMobile = viewportWidth < 600;
    const maxRotation = isMobile ? 15 : 30;
    const randomRotation = (Math.random() - 0.5) * maxRotation;
    noBtn.style.transform = `rotate(${randomRotation}deg) scale(${0.95 + Math.random() * 0.1})`;
    
    // Update playful message
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
});

// ========================================
// CONSOLE MESSAGE (EASTER EGG)
// ========================================

console.log('%c💖 Happy Valentine\'s Day! 💖', 'color: #ff4d6d; font-size: 24px; font-weight: bold;');
console.log('%cMade with love ❤️', 'color: #b5179e; font-size: 14px;');
