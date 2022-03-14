const CELL_SIZE = 15;
const CANVAS_SIZE = 450;
const CANVAS_SCORE_SIZE = 50;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
}
var counter = 0;

var EAT_APPLE_AUDIO = new Audio('Assets/audio/eat-apple.mp3')
var LEVEL_AUDIO = new Audio(('Assets/audio/level-up.mp3'));
var GAME_OVER_AUDIO = new Audio('Assets/audio/game-over.mp3');

function initPosition() {
	return {
		x: Math.floor(Math.random() * WIDTH),
		y: Math.floor(Math.random() * HEIGHT),
	}
}

function initHeadAndBody() {
	let head = initPosition();
	let body = [{ x: head.x, y: head.y }];
	return {
		head: head,
		body: body,
	}
}

function initDirection() {
	return Math.floor(Math.random() * 4);
}

function initSnake(color, life, score, level) {
	return {
		color: color,
		...initHeadAndBody(),
		direction: initDirection(),
		score: score,
		life: life,
		level: level,
		speed: 180,
	}
}
let snake = initSnake("purple", 3, 0, 1);

let apples = [
	{
		color: "red",
		position: initPosition(),
	},
	{
		color: "blue",
		position: initPosition(),
	}
]

let lifes = [{
	color: "purple",
	position: initPosition()
}]

let thorn = [{
	direction: initDirection(),
	position: initPosition(),
	moveSpeed: 180
}];

let obstacles = [
	{
		position: {
			x1: 60,
			x2: 390,
			y1: 112.5,
			y2: 112.5
		}
	},
	{
		position: {
			x1: 60,
			x2: 390,
			y1: 232.5,
			y2: 232.5
		}
	},
	{
		position: {
			x1: 60,
			x2: 390,
			y1: 337.5,
			y2: 337.5
		}
	},
	{
		position: {
			x1: 112.5,
			x2: 112.5,
			y1: 60,
			y2: 390
		}
	},
	{
		position: {
			x1: 337.5,
			x2: 337.5,
			y1: 60,
			y2: 390
		}
	},
]

function isPrime(score) {
	if (score === 1 || score == 0) {
		return false;
	}

	for (let i = 2; i < score; i++) {
		if (score % i == 0) {
			return false;
		}
	}
	return true;
}

function drawCell(ctx, x, y, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
	let scoreCanvas;
	if (snake.color == snake.color) {
		scoreCanvas = document.getElementById("score1Board");
	}
	let scoreCtx = scoreCanvas.getContext("2d");

	scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
	scoreCtx.font = "20px Arial";
	scoreCtx.fillStyle = snake.color
	scoreCtx.fillText(snake.score, CANVAS_SCORE_SIZE / 3, CANVAS_SCORE_SIZE / 2);
}

function drawLevel(snake) {
	var gameLevel = document.getElementById("game-level");
	gameLevel.innerHTML = "Snake Game - Level: " + snake.level;
}

function drawSpeed(snake) {
	var speed = document.getElementById("speed");
	speed.innerHTML = "Speed: " + snake.speed + " ms";
}

function drawObstacle(ctx, x1, x2, y1, y2) {
	ctx.lineWidth = CELL_SIZE;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function initObsticleLevel2(ctx) {
	drawObstacle(
		ctx,
		obstacles[0].position.x1,
		obstacles[0].position.x2,
		obstacles[0].position.y1,
		obstacles[0].position.y2
	);
}

function initObsticleLevel3(ctx) {
	for (let i = 0; i < 2; i++) {
		drawObstacle(
			ctx,
			obstacles[i].position.x1,
			obstacles[i].position.x2,
			obstacles[i].position.y1,
			obstacles[i].position.y2
		);
	}
}

function initObsticleLevel4(ctx) {
	for (let i = 0; i < 3; i++) {
		drawObstacle(
			ctx,
			obstacles[i].position.x1,
			obstacles[i].position.x2,
			obstacles[i].position.y1,
			obstacles[i].position.y2
		);
	}
}

function initObsticleLevel5(ctx) {
	for (let i = 3; i < 5; i++) {
		drawObstacle(
			ctx,
			obstacles[i].position.x1,
			obstacles[i].position.x2,
			obstacles[i].position.y1,
			obstacles[i].position.y2
		);
	}
}

function draw() {
	setInterval(function () {
		thorn[0].direction = initDirection();
	}, 2000)

	setInterval(function () {
		let snakeCanvas = document.getElementById("snakeBoard");
		let ctx = snakeCanvas.getContext("2d");

		ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

		var snakeHead = document.getElementById("snake-head");
		var snakeBody = document.getElementById("snake-body");
		var heart = document.getElementById("heart");
		ctx.drawImage(snakeHead, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		for (let i = 1; i < snake.body.length; i++) {
			ctx.drawImage(snakeBody, snake.body[i].x * CELL_SIZE, snake.body[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}
		for (let i = 0; i < snake.life; i++) {
			ctx.drawImage(heart, i * CELL_SIZE, 0, CELL_SIZE, CELL_SIZE);
		}

		for (let i = 0; i < apples.length; i++) {
			let apple = apples[i];
			var img = document.getElementById("apple");
			ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}

		if (isPrime(snake.score)) {
			let status = true;
			if (counter > 175) {
				status = false;
			}
			else if (status && !(counter % 15 === 0)) {
				for (let l = 0; l < lifes.length; l++) {
					let life = lifes[l];
					var img = document.getElementById("lifes");
					ctx.drawImage(img, life.position.x * CELL_SIZE, life.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
				}
			}
			counter++;
		}
		drawScore(snake);
		drawLevel(snake);
		drawSpeed(snake);

		if (snake.level == 2) {
			snake.speed = 160;
			initObsticleLevel2(ctx)
		} else if (snake.level == 3) {
			snake.speed = 140;
			initObsticleLevel3(ctx);
		} else if (snake.level == 4) {
			snake.speed = 120;
			initObsticleLevel4(ctx);
		} else if (snake.level == 5) {
			snake.speed = 100;
			initObsticleLevel5(ctx);
		}

		if (snake.level == 1 || snake.level == 3) {
			var img = document.getElementById("thorn");
			ctx.drawImage(img, thorn[0].position.x * CELL_SIZE, thorn[0].position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}
	}, REDRAW_INTERVAL);
}

function teleport(snake) {
	if (snake.head.x < 0) {
		snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
	}
	if (snake.head.x >= WIDTH) {
		snake.head.x = 0;
	}
	if (snake.head.y < 0) {
		snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
	}
	if (snake.head.y >= HEIGHT) {
		snake.head.y = 0;
	}
}

function teleportThorn(thorn) {
	if (thorn[0].position.x < 0) {
		thorn[0].position.x = CANVAS_SIZE / CELL_SIZE - 1;
	}
	if (thorn[0].position.x >= WIDTH) {
		thorn[0].position.x = 0;
	}
	if (thorn[0].position.y < 0) {
		thorn[0].position.y = CANVAS_SIZE / CELL_SIZE - 1;
	}
	if (thorn[0].position.y >= HEIGHT) {
		thorn[0].position.y = 0;
	}
}

function eat(snake, apples, lifes) {
	for (let i = 0; i < apples.length; i++) {
		let apple = apples[i];
		if (snake.head.x === apple.position.x && snake.head.y === apple.position.y) {
			let life = lifes[0];
			apple.position = initPosition();
			life.position = initPosition();
			snake.score++;
			counter = 0;
			snake.body.push({ x: snake.head.x, y: snake.head.y });
			checkPoint(snake);
			EAT_APPLE_AUDIO.play();
		}

		if (isPrime(snake.score)) {
			let status = true;
			if (counter > 175) {
				status = false;
			} else if (status && !(counter % 15 == 0)) {
				for (let j = 0; j < lifes.length; j++) {
					let life = lifes[j];
					if (snake.head.x == life.position.x && snake.head.y == life.position.y) {
						var eat = new Audio('Assets/audio/eat-apple.mp3')
						eat.play();
						life.position = initPosition();
						snake.life++;
						snake.score++;
						counter = 0;
						checkPoint(snake);
					}
				}
			}
			counter++;
		}
	}
}


function levelUp(level) {
	alert("Level " + level + " Complete");
	LEVEL_AUDIO.play();
}

function checkPoint(snake) {
	if (snake.score != 0 && snake.score % 5 == 0) {

		if (snake.score == 5) {
			levelUp(snake.level);
			snake.level = 2;
		} else if (snake.score == 10) {
			levelUp(snake.level);
			snake.level = 3;
		} else if (snake.score == 15) {
			levelUp(snake.level);
			snake.level = 4;
		} else if (snake.score == 20) {
			levelUp(snake.level);
			snake.level = 5;
		} else if (snake.score == 25) {
			levelUp(snake.level);
		}
	}
}

function moveLeft(snake) {
	snake.head.x--;
	teleport(snake);
	eat(snake, apples, lifes);
}

function moveRight(snake) {
	snake.head.x++;
	teleport(snake);
	eat(snake, apples, lifes);
}

function moveDown(snake) {
	snake.head.y++;
	teleport(snake);
	eat(snake, apples, lifes);
}

function moveUp(snake) {
	snake.head.y--;
	teleport(snake);
	eat(snake, apples, lifes);
}

function move(snake) {
	switch (snake.direction) {
		case DIRECTION.LEFT:
			moveLeft(snake);
			break;
		case DIRECTION.RIGHT:
			moveRight(snake);
			break;
		case DIRECTION.DOWN:
			moveDown(snake);
			break;
		case DIRECTION.UP:
			moveUp(snake);
			break;
	}
	moveBody(snake);
	if (!checkCollision([snake]) && !hitObsticle()) {
		setTimeout(function () {
			move(snake);
		}, snake.speed);
	} else {
		initGame();
	}
}

function moveThorn(thorn) {
	switch (thorn[0].direction) {
		case DIRECTION.LEFT:
			thorn[0].position.x--;
			teleportThorn(thorn);
			break;
		case DIRECTION.RIGHT:
			thorn[0].position.x++;
			teleportThorn(thorn);
			break;
		case DIRECTION.UP:
			thorn[0].position.y--;
			teleportThorn(thorn);
			break;
		case DIRECTION.DOWN:
			thorn[0].position.y++;
			teleportThorn(thorn);
			break;
	}

	setTimeout(function () {
		moveThorn(thorn);
	}, thorn[0].moveSpeed);
}

function gameOver() {
	GAME_OVER_AUDIO.play();
	alert("Game Over");
	snake = initSnake("Purple", 3, 0, 1);

	thorn = [{
		direction: initDirection(),
		position: initPosition(),
		moveSpeed: 200
	}];
	initThorn();
}

function hitObsticle() {
	let isHit = false;
	let headX = (snake.head.x + 1) * CELL_SIZE;
	let headY = (snake.head.y + 1) * CELL_SIZE;

	if (snake.level == 2) {
		let obstacle = obstacles[0];
		if (headX > obstacle.position.x1 && headX <= obstacle.position.x2 &&
			headY >= obstacle.position.y1 && headY <= obstacle.position.y1 + 7.5) {
			isHit = true;
		}
	} else if (snake.level == 3) {
		for (let i = 0; i < obstacles.length - 3; i++) {
			let obstacle = obstacles[i];
			if (headX > obstacle.position.x1 && headX <= obstacle.position.x2 &&
				headY >= obstacle.position.y1 && headY <= obstacle.position.y1 + 7.5) {
				isHit = true;
			}
		}
	} else if (snake.level == 4) {
		for (let i = 0; i < obstacles.length - 2; i++) {
			let obstacle = obstacles[i];
			if (headX > obstacle.position.x1 && headX <= obstacle.position.x2 &&
				headY >= obstacle.position.y1 && headY <= obstacle.position.y1 + 7.5) {
				isHit = true;
			}
		}
	} else if (snake.level == 5) {
		for (let i = 3; i < obstacles.length; i++) {
			let obstacle = obstacles[i];
			if (headY > obstacle.position.y1 && headY <= obstacle.position.y2 &&
				headX >= obstacle.position.x1 && headX <= obstacle.position.x1 + 7.5) {
				isHit = true;
			}
		}
	}

	if (isHit) {
		var hit = new Audio('Assets/audio/hit.mp3');
		hit.play();
		snake.life--;
		snake = initSnake("Purple", snake.life, snake.score, snake.level);
		snake.body = [{ x: snake.head, y: snake.head.y }];
		if (snake.life == 0) {
			gameOver();
		}
	}

	return isHit;
}

function checkCollision(snakes) {
	let isCollide = false;
	for (let i = 0; i < snakes.length; i++) {
		for (let j = 0; j < snakes.length; j++) {
			for (let k = 1; k < snakes[j].body.length; k++) {
				let thorns = thorn[0];
				if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y || thorns.position.x == snakes[j].body[k].x && thorns.position.y == snakes[j].body[k].y) {
					isCollide = true;
				}
			}
		}
	}
	for (let k = 0; k < thorn.length; k++) {
		let thorns = thorn[k];
		if (snake.head.x == thorns.position.x && snake.head.y == thorns.position.y) {
			isCollide = true;
		}
	}
	if (isCollide) {
		var hit = new Audio('Assets/audio/hit.mp3');
		hit.play();
		snake.life--;
		snake = initSnake("Purple", snake.life, snake.score, snake.level);
		if (snake.life == 0) {
			gameOver();
		}
	}

	return isCollide;
}

function moveBody(snake) {
	snake.body.unshift({ x: snake.head.x, y: snake.head.y });
	snake.body.pop();
}

function turn(snake, direction) {
	const oppositeDirections = {
		[DIRECTION.LEFT]: DIRECTION.RIGHT,
		[DIRECTION.RIGHT]: DIRECTION.LEFT,
		[DIRECTION.DOWN]: DIRECTION.UP,
		[DIRECTION.UP]: DIRECTION.DOWN,
	}

	if (direction !== oppositeDirections[snake.direction]) {
		snake.direction = direction;
	}
}

document.addEventListener("keydown", function (event) {
	if (event.key === "ArrowLeft") {
		turn(snake, DIRECTION.LEFT);
	} else if (event.key === "ArrowRight") {
		turn(snake, DIRECTION.RIGHT);
	} else if (event.key === "ArrowUp") {
		turn(snake, DIRECTION.UP);
	} else if (event.key === "ArrowDown") {
		turn(snake, DIRECTION.DOWN);
	}
})

function initThorn() {
	moveThorn(thorn);
}

function initGame() {
	move(snake);
}

initThorn();
initGame();
