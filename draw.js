const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Set up canvas dimensions
canvas.width = window.innerWidth - 150; // Adjust for sidebar width
canvas.height = window.innerHeight;

let drawing = false;
let tool = "brush";
let lineWidth = 5; // Default size for brush and pencil
let fadeIntervals = [];
let textDisplayed = true; // Flag to track if the initial text is displayed

// Display initial text
function displayInitialText() {
    if (textDisplayed) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.fillText("Draw and Tinker Here", canvas.width / 2, canvas.height / 2);
    }
}
displayInitialText();

// Detect tool changes from sidebar
document.querySelectorAll('input[name="tool"]').forEach(input => {
    input.addEventListener("change", () => {
        tool = input.value;
        lineWidth = (tool === "brush") ? 10 : 2; // Adjust size based on tool
    });
});

// Start drawing
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

// Function to start drawing
function startDrawing(e) {
    if (!drawing) {
        // Clear initial text once, without affecting the rest of the canvas
        if (textDisplayed) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            textDisplayed = false;
        }
    }
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - 150, e.clientY); // Adjust for sidebar width
}

// Function to stop drawing
function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

// Drawing function
function draw(e) {
    if (!drawing) return;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = tool === "brush" ? "#ff6347" : "#000000";

    ctx.lineTo(e.clientX - 150, e.clientY);
    ctx.stroke();

    // Start fade effect with increased rate
    startFadeEffect();
}

// Function to start the fading effect
function startFadeEffect() {
    const fadeInterval = setInterval(() => {
        fadeRandomPart();
    }, 500); // Increase fade rate by triggering every 0.5 seconds
    fadeIntervals.push(fadeInterval);
}

// Function to fade random parts of the drawing
function fadeRandomPart() {
    const fadeSize = 15;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.clearRect(x, y, fadeSize, fadeSize);
}

// Clear all intervals when leaving the page
window.addEventListener("beforeunload", () => {
    fadeIntervals.forEach(clearInterval);
});
