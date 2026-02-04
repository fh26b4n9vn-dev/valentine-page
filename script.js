// ==================== Configuration ====================
const CONFIG = {
    noButtonPhrases: [
        "Non",
        "Vraiment ?",
        "Tu es sûr(e) ?",
        "Réfléchis bien...",
        "Penses-y encore",
        "Mauvaise idée",
        "Hmm non",
        "Dernière chance !",
        "Allez...",
        "S'il te plaît 🥺"
    ],
    heartEmojis: ['❤️', '💕', '💖', '💗', '💓', '💝'],
    confettiColors: ['#ff0066', '#ff3385', '#ff99cc', '#ff6699', '#cc0052'],
    floatingHeartsCount: 15,
    confettiCount: 100,
    loadingDuration: 2500
};

// ==================== Element References ====================
const elements = {
    btnYes: document.getElementById('btnYes'),
    btnNo: document.getElementById('btnNo'),
    questionState: document.getElementById('questionState'),
    loadingState: document.getElementById('loadingState'),
    successState: document.getElementById('successState'),
    progressFill: document.getElementById('progressFill'),
    heartsBackground: document.getElementById('heartsBackground'),
    confetti: document.getElementById('confetti')
};

// ==================== Floating Hearts Background ====================
function createFloatingHearts() {
    for (let i = 0; i < CONFIG.floatingHeartsCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = CONFIG.heartEmojis[Math.floor(Math.random() * CONFIG.heartEmojis.length)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 8}s`;
        heart.style.fontSize = `${1 + Math.random() * 2}rem`;
        elements.heartsBackground.appendChild(heart);
    }
}

// ==================== No Button Behavior ====================
let noButtonClickCount = 0;
let isNoButtonMoving = false;

function positionNoButton() {
    const rect = elements.btnYes.getBoundingClientRect();
    elements.btnNo.style.position = 'relative';
    elements.btnNo.style.left = 'auto';
    elements.btnNo.style.top = 'auto';
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getButtonCenter(button) {
    const rect = button.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function moveNoButton() {
    if (isNoButtonMoving) return;
    isNoButtonMoving = true;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const btnWidth = elements.btnNo.offsetWidth;
    const btnHeight = elements.btnNo.offsetHeight;

    // Calculate safe boundaries
    const margin = 50;
    const maxX = windowWidth - btnWidth - margin;
    const maxY = windowHeight - btnHeight - margin;

    // Generate random position
    const newX = margin + Math.random() * (maxX - margin);
    const newY = margin + Math.random() * (maxY - margin);

    // Apply new position
    elements.btnNo.style.position = 'fixed';
    elements.btnNo.style.left = `${newX}px`;
    elements.btnNo.style.top = `${newY}px`;

    // Change button text
    noButtonClickCount++;
    const phraseIndex = Math.min(noButtonClickCount, CONFIG.noButtonPhrases.length - 1);
    elements.btnNo.querySelector('span').textContent = CONFIG.noButtonPhrases[phraseIndex];

    // Add a little rotation for fun
    const rotation = (Math.random() - 0.5) * 20;
    elements.btnNo.style.transform = `rotate(${rotation}deg)`;

    // Play with scale
    elements.btnNo.style.transform += ` scale(${0.9 + Math.random() * 0.2})`;

    // Reset movement flag after transition
    setTimeout(() => {
        isNoButtonMoving = false;
    }, 300);
}

function checkMouseProximity(mouseX, mouseY) {
    if (elements.questionState.classList.contains('hidden')) return;

    const buttonCenter = getButtonCenter(elements.btnNo);
    const distance = getDistance(mouseX, mouseY, buttonCenter.x, buttonCenter.y);

    // If mouse is within 150px of the button, make it flee!
    const fleeDistance = 150;
    if (distance < fleeDistance && !isNoButtonMoving) {
        moveNoButton();
    }
}

// ==================== Yes Button Behavior ====================
function handleYesClick() {
    // Hide question state and no button
    elements.questionState.classList.add('hidden');
    elements.btnNo.style.display = 'none';

    // Show loading state
    elements.loadingState.classList.remove('hidden');

    // Start progress animation
    setTimeout(() => {
        elements.progressFill.style.width = '100%';
    }, 50);

    // Show success state after loading
    setTimeout(() => {
        elements.loadingState.classList.add('hidden');
        elements.successState.classList.remove('hidden');
        createConfetti();
    }, CONFIG.loadingDuration);
}

// ==================== Confetti Animation ====================
function createConfetti() {
    for (let i = 0; i < CONFIG.confettiCount; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti-piece';

        // Random properties
        const color = CONFIG.confettiColors[Math.floor(Math.random() * CONFIG.confettiColors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random();

        confettiPiece.style.left = `${left}%`;
        confettiPiece.style.backgroundColor = color;
        confettiPiece.style.animationDelay = `${delay}s`;
        confettiPiece.style.animationDuration = `${duration}s`;

        // Random shapes
        if (Math.random() > 0.5) {
            confettiPiece.style.borderRadius = '50%';
        }

        elements.confetti.appendChild(confettiPiece);

        // Remove after animation
        setTimeout(() => {
            confettiPiece.remove();
        }, (duration + delay) * 1000);
    }
}

// ==================== Event Listeners ====================
function initEventListeners() {
    // Track mouse movement to make No button flee when mouse gets close
    document.addEventListener('mousemove', (e) => {
        checkMouseProximity(e.clientX, e.clientY);
    });
    elements.btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    // Touch support for mobile
    elements.btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    // Yes button
    elements.btnYes.addEventListener('click', handleYesClick);
}

// ==================== Initialization ====================
function init() {
    // Position no button initially
    positionNoButton();

    // Create floating hearts
    createFloatingHearts();

    // Initialize event listeners
    initEventListeners();

    // Add keyboard support for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !elements.questionState.classList.contains('hidden')) {
            handleYesClick();
        }
    });
}

// Start the magic when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
