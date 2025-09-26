let dino = document.getElementById("dino");
let tree = document.getElementById("tree");
let game = document.getElementById("game");

let isJumping = false;
let gravity = 0.9;
let position = 0;
let runFrame = 1;
let runSpeed = 5;
let runIntervalId = null;
let verticalVelocity = 0;
let groundOffset = 0;
let gameOver = false;
let score = 0;
let scoreIntervalId = null;
let isNightMode = false;
let lastCycleScore = 0;

// Handle jump
document.addEventListener("keydown", function(event) {
  if ((event.code === "Space" || event.code === "ArrowUp") && !gameOver) {
    jump();
  }
});

function jump() {
  if (isJumping || gameOver) return;
  isJumping = true;
  verticalVelocity = 13; // initial jump impulse

  const jumpInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(jumpInterval);
      return;
    }
    
    position += verticalVelocity;
    verticalVelocity -= gravity;

    if (position <= 0) {
      position = 0;
      isJumping = false;
      clearInterval(jumpInterval);
    }

    dino.style.bottom = position + "px";
  }, 20);
}

// Move tree
function moveTree() {
  let treePosition = 600;

  setInterval(() => {
    if (gameOver) return;
    
    treePosition -= runSpeed;
    if (treePosition < -40) {
      treePosition = 600; // reset to right side
    }
    tree.style.left = treePosition + "px";
  }, 20);
}

moveTree();

// Toggle dino run frames
function startRunAnimation() {
  if (runIntervalId !== null) return;
  runIntervalId = setInterval(() => {
    if (gameOver) return;
    
    runFrame = runFrame === 1 ? 2 : 1;
    if (runFrame === 1) {
      dino.classList.add('run1');
      dino.classList.remove('run2');
    } else {
      dino.classList.add('run2');
      dino.classList.remove('run1');
    }
  }, 120);
}

// Stops dino run frames
function stopRunAnimation() {
  if (runIntervalId !== null) {
    clearInterval(runIntervalId);
    runIntervalId = null;
  }
}

// Start animating on load
startRunAnimation();

// Scroll ground background continuously based on runSpeed
function scrollGround() {
  setInterval(() => {
    if (gameOver) return;
    
    groundOffset -= runSpeed;
    game.style.backgroundPosition = groundOffset + "px bottom";
  }, 20);
}

scrollGround();

// Collision detection
function checkCollision() {
  setInterval(() => {
    if (gameOver) return;
    
    const dinoRect = dino.getBoundingClientRect();
    const treeRect = tree.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    
    // Convert to game coordinates
    const dinoLeft = dinoRect.left - gameRect.left;
    const dinoRight = dinoRect.right - gameRect.left;
    const dinoTop = dinoRect.top - gameRect.top;
    const dinoBottom = dinoRect.bottom - gameRect.top;
    
    const treeLeft = treeRect.left - gameRect.left;
    const treeRight = treeRect.right - gameRect.left;
    const treeTop = treeRect.top - gameRect.top;
    const treeBottom = treeRect.bottom - gameRect.top;
    
    // Check if dino and tree overlap
    if (treeRight-dinoLeft > 5 && dinoRight-treeLeft > 5 && 
        treeBottom-dinoTop > 5 && dinoBottom-treeTop > 5) {
      endGame();
    }
  }, 20);
}

function endGame() {
  gameOver = true;
  stopRunAnimation();
  stopScore();
  runSpeed = 5;
  
  // Show game over text
  const gameOverText = document.createElement("div");
  gameOverText.textContent = "GAME OVER!";
  gameOverText.style.position = "absolute";
  gameOverText.style.top = "50%";
  gameOverText.style.left = "50%";
  gameOverText.style.transform = "translate(-50%, -50%)";
  gameOverText.style.zIndex = "1000";
  game.appendChild(gameOverText);
}

// Score system
function startScore() {
  if (scoreIntervalId !== null) return;
  scoreIntervalId = setInterval(() => {
    if (gameOver) return;
    
    score += 1;
    updateScoreDisplay();
  }, 100); // 0.1 seconds = 100ms
}

function stopScore() {
  if (scoreIntervalId !== null) {
    clearInterval(scoreIntervalId);
    scoreIntervalId = null;
  }
}

function updateScoreDisplay() {
  let scoreElement = document.getElementById("score");
  if (!scoreElement) {
    scoreElement = document.createElement("div");
    scoreElement.id = "score";
    scoreElement.style.position = "absolute";
    scoreElement.style.top = "10px";
    scoreElement.style.right = "10px";
    scoreElement.style.fontSize = "12px";
    scoreElement.style.zIndex = "1000";
    game.appendChild(scoreElement);
  }
  scoreElement.textContent = "Score: " + score;
  
  // Set speed based on score (5 + 1 for every 100 points)
  runSpeed = 5 + Math.floor(score / 100);

  checkDayNightCycle();
}


function toggleDayNightCycle() {
  isNightMode = !isNightMode;
  lastCycleScore = score;

  // Apply smooth transition
  const gameElement = document.getElementById("game");

  if (isNightMode) {
    // Transition to night mode (negative colors)
    gameElement.style.filter = "invert(1) hue-rotate(180deg)";
    gameElement.style.transition = "filter 1s ease-in-out";
  } else {
    // Transition to day mode (normal colors)
    gameElement.style.filter = "none";
    gameElement.style.transition = "filter 1s ease-in-out";
  }
}

function checkDayNightCycle() {
  // To solve problem-1: Check if we've reached a new 300-point milestone
  // Hint: You need to call toggleDayNightCycle() function with appropriate condition
  if(score%10==0){
    toggleDayNightCycle()
  }
}

checkCollision();
startScore();