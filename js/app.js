var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var animation;
canvas.height = 800;
canvas.width = 800;

// daw ball, paddle, bricks, score
let speed = 5;
let score = 0;

function drawScore() {
    ctx.font = "20px Open Sans";
    ctx.fillStyle = '#71797e';
    ctx.fillText("Score: " + score, 20, 30);
}

let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: speed,
    dy: -speed + 1,
    radius: 8,
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = '#71797e';
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
};

let paddle = {
    height: 10,
    width: 120,
    x: canvas.width / 2 - (76 / 2),
    y: canvas.height - 20,
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = '#71797e';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.closePath();
        ctx.fill();
    }
}

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 120;
let brickHeight = 20;
let brickPadding = 20;
let brickOffsetTop = 50;
let brickOffsetLeft = 55;

let bricks = [];

function generateBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function drawBricks() {

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#71797e';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// collisionDetection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                if (ball.x >= bricks[c][r].x &&
                    ball.x <= bricks[c][r].x + brickWidth &&
                    ball.y >= bricks[c][r].y &&
                    ball.y <= bricks[c][r].y + brickHeight) {
                    ball.dy *= -1;
                    bricks[c][r].status = 0;
                    score++;
                }
            }
        }
    }
    if (
        ball.x + ball.radius >= paddle.x &&
        ball.x - ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - paddle.height) {
        ball.dy *= -1;
        console.log("hit");
    }
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            dy *= -1;
        } else {
            alert("GAME OVER");
            cancelAnimationFrame(animation);
            document.location.reload();
        }
    }
    if (ball.y + ball.radius > canvas.height) {
        if (score > parseInt(localStorage.getItem('highScore'))) {
            localStorage.setItem('highScore', score.toString());
            scoreDisplay.innerHTML = `High Score: ${score}`;
        }
        score = 0;
    }
}
// AnimationBall
function AnimationBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// AnimationPaddle
let rightPressed = false;
let leftPressed = false;
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(key) {
    if (key.key == 'Right' || key.key == 'ArrowRight') {
        rightPressed = true;
    }
    if (key.key == 'Left' || key.key == 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(key) {
    if (key.key == 'Right' || key.key == 'ArrowRight') {
        rightPressed = false;
    }
    if (key.key == 'Left' || key.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

function movePaddle() {
    if (rightPressed) {
        paddle.x += speed;
        if (paddle.x + paddle.width >= canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    } else if (leftPressed) {
        paddle.x -= speed;
        if (paddle.x < 0) {
            paddle.x = 0;
        }
    }
}

// level up
let gameLevelUp = true;

function levelUp() {
    if (score % 15 == 0 && score != 0) {
        if (ball.y > canvas.height / 2) {
            generateBricks();
        }
        if (gameLevelUp) {
            if (ball.dy > 0) {
                speed += 1;
                gameLevelUp = false;
            } else if (ball.dy < 0) {
                speed += 1;
                gameLevelUp = false;
            }
        }
        if (score % 15 != 0) {
            gameLevelUp = true;
        }
    }
    console.log(speed);
}

// reset
const reset = document.querySelector(".reset");
reset.addEventListener('click', () => {
    localStorage.setItem("highScore", "0");
    score = 0;
    scoreDisplay.innerHTML = "High Score: 0";
    cancelAnimationFrame(animation);
    document.location.reload();
});
// high-score
const scoreDisplay = document.querySelector(".high-score");
let highScore = parseInt(localStorage.getItem("highScore"));
if (isNaN(highScore)) {
    highScore = 0;
}
scoreDisplay.innerHTML = `High Score: ${highScore}`

function play() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    paddle.draw();
    AnimationBall();
    movePaddle();
    drawBricks();
    collisionDetection();
    levelUp();
    drawScore();
    animation = requestAnimationFrame(play);
}
generateBricks();
play();