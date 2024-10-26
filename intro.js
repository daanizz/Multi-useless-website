// Function to start the game by hiding the intro screen and showing the game container
function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-container').classList.remove('hidden');
    // Additional game-start logic goes here, such as initializing score and starting the character animation.
}

// Function to restart the game, used for the restart button in the popup
function restartGame() {
    document.getElementById('popup').classList.add('hidden');
    document.getElementById('score-display').innerText = "Score: 0";
    // Reset game elements, such as score and character position, for a new game
}
