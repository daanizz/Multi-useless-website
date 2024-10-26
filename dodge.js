const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Constants
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 30;
const LANE_WIDTH = canvas.width / 3;
const PLAYER_LANES = 3;
const BACKGROUND_SCROLL_SPEED = 8;
const OBSTACLE_SPAWN_TIME = 2000;

const player = {
    x: (canvas.width - PLAYER_WIDTH) / 2,
    y: canvas.height - PLAYER_HEIGHT - 20,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    lane: 1,
    draw: function () {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    moveToLane: function (lane) {
        this.lane = lane;
        this.x = lane * LANE_WIDTH + (LANE_WIDTH - this.width) / 2;
    },
};

let obstacles = [];
let score = 0;
let gameOver = false;
let backgroundOffset = 0;

function spawnObstacle() {
    const lane = Math.floor(Math.random() * PLAYER_LANES);
    const obstacle = {
        x: lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_WIDTH) / 2,
        y: canvas.height,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
        draw: function () {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        move: function () {
            this.y -= BACKGROUND_SCROLL_SPEED;
        }
    };
    obstacles.push(obstacle);
}

function drawBackground() {
    ctx.fillStyle = "#555";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    const lineSpacing = 40;
    for (let i = 1; i < PLAYER_LANES; i++) {
        const x = i * LANE_WIDTH;
        for (let y = backgroundOffset % lineSpacing; y < canvas.height + lineSpacing; y += lineSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 20);
            ctx.stroke();
        }
    }
    backgroundOffset -= BACKGROUND_SCROLL_SPEED;
    if (backgroundOffset <= -lineSpacing) {
        backgroundOffset = 0;
    }
}

function updateScoreDisplay() {
    document.getElementById("scoreDisplay").textContent = "Score: " + score;
}

function resetGame() {
    obstacles = [];
    score = 0;
    gameOver = false;
    document.getElementById("retryButton").style.display = "none";
    player.x = (canvas.width - PLAYER_WIDTH) / 2;
    player.y = canvas.height - PLAYER_HEIGHT - 20;
    updateScoreDisplay();
    gameLoop();
}

function gameLoop() {
    if (gameOver) {
        document.getElementById("retryButton").style.display = "block";
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.move();
        obstacle.draw();

        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
            alert("Game Over! Final Score: " + score);
        }

        if (obstacle.y < -OBSTACLE_HEIGHT) {
            obstacles.splice(i, 1);
            score++;
            updateScoreDisplay();
        }
    }

    player.draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.lane > 0) {
        player.moveToLane(player.lane - 1);
    } else if (event.key === "ArrowRight" && player.lane < 2) {
        player.moveToLane(player.lane + 1);
    }
});

document.getElementById("retryButton").addEventListener("click", resetGame);

document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startPage").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    setTimeout(() => {
        setInterval(() => {
            spawnObstacle();
        }, OBSTACLE_SPAWN_TIME);
    }, 2000);

    gameLoop();
});
