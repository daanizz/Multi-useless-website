// script.js

const gameContainer = document.getElementById('game-container');
const platforms = Array.from(document.getElementsByClassName('platform'));
const character = document.getElementById('character');
const scoreDisplay = document.getElementById('score-display');
const scoreSound = document.getElementById('score-sound');

let gameSpeed = 1.5; // Reduced speed for easier play
let score = 0;
let gameInterval;
let characterPosition = { left: 45 };

// Start the game loop
function startGame() {
    score = 0;
    gameSpeed = 1.5;
    updateScore();
    gameInterval = setInterval(() => {
        movePlatforms();
        handleDodging();
    }, 20);
}

// Move platforms towards the character
function movePlatforms() {
    platforms.forEach((platform) => {
        let currentTop = parseFloat(platform.style.top);

        if (currentTop >= 100) {
            // Reset platform to top with a new position
            platform.style.top = "-10%";
            platform.style.left = `${Math.random() * 80}%`;
        } else {
            platform.style.top = `${currentTop + gameSpeed}%`;
        }
    });
}

// Smoothly dodge character when it approaches a platform
function handleDodging() {
    platforms.forEach(platform => {
        const platformRect = platform.getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();
        
        // Define a larger proximity zone for dodging
        const buffer = 20; // Adjust this buffer value to control dodging distance

        // Check if the platform is within the proximity zone
        if (
            platformRect.bottom > characterRect.top - buffer &&
            platformRect.top < characterRect.bottom + buffer &&
            platformRect.left < characterRect.right + buffer &&
            platformRect.right > characterRect.left - buffer
        ) {
            // Move the platform horizontally to avoid collision
            const platformLeft = parseFloat(platform.style.left);
            if (characterRect.left < platformRect.left) {
                platform.style.left = `${Math.min(90, platformLeft + 5)}%`; // Shift platform to the right
            } else {
                platform.style.left = `${Math.max(0, platformLeft - 5)}%`; // Shift platform to the left
            }
        }
    });
}




// Check if character directly hits platform (for scoring)
function checkIfHit(platformRect, characterRect) {
    return (
        platformRect.top < characterRect.bottom &&
        platformRect.bottom > characterRect.top &&
        platformRect.left < characterRect.right &&
        platformRect.right > characterRect.left
    );
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Control character movement
function controlCharacter(event) {
    if (event.key === 'ArrowLeft') {
        characterPosition.left = Math.max(5, characterPosition.left - 5); // Move left
    } else if (event.key === 'ArrowRight') {
        characterPosition.left = Math.min(85, characterPosition.left + 5); // Move right
    }
    character.style.left = `${characterPosition.left}%`;
}

// Play sound effect
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}




// Event listener for character control
document.addEventListener('keydown', controlCharacter);

// Start the game on load
startGame();
