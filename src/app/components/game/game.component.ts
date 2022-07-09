import { Component, HostListener, OnInit } from '@angular/core';
import { EndOfGameService } from 'src/app/services/end-of-game.service';

interface Coordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'sna-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  snakeboard: any;
  snakeboard_ctx: any;

  board_border = 'black';
  board_background = 'rgb(234, 234, 234)';
  snake_body = 'green';
  snake_border = 'brown';

  foodRandomColours = [
    'rgb(255, 0, 0)',
    'rgb(216, 24, 226)',
    'rgb(56, 81, 224)',
    'rgb(56, 224, 182)',
    'rgb(224, 207, 56)',
    'rgb(224, 140, 56)',
  ];

  snake: Array<Coordinates> = [
    { x: 280, y: 240 },
    { x: 260, y: 240 },
    { x: 240, y: 240 },
    { x: 220, y: 240 },
    { x: 200, y: 240 },
  ];

  // Horizontal velocity
  dx = 20;
  // Vertical velocity
  dy = 0;
  /**
   * time in ms between each move of the snake
   * this way we can decrease the time later in the game
   * in order to move the snake faster
   */
  gameVelocity = 400;
  changing_direction = false;
  showNewGameButton = false;
  food_x: number | undefined;
  food_y: number | undefined;
  score = 0;
  informPlayerThatGameVelocityIncreases = false;
  foodColor: string | undefined;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (this.changing_direction) return;
    this.changing_direction = true;

    const keyPressed = event.keyCode;
    const goingUp = this.dy === -20;
    const goingDown = this.dy === 20;
    const goingRight = this.dx === 20;
    const goingLeft = this.dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight) {
      this.dx = -20;
      this.dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
      this.dx = 0;
      this.dy = -20;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
      this.dx = 20;
      this.dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
      this.dx = 0;
      this.dy = 20;
    }
  }

  constructor(private endOfGameService: EndOfGameService) {}

  ngOnInit(): void {
    this.snakeboard = document.getElementById('gameCanvas');
    this.snakeboard_ctx = this.snakeboard?.getContext('2d');
    this.foodColor = this.foodRandomColours[Math.floor(Math.random() * 6)];
    // Start game
    this.main();
    this.gen_food();
  }

  // main function called repeatedly to keep the game running
  main(params: { triggerNewGame: boolean } = { triggerNewGame: false }) {
    if (this.has_game_ended() && !params.triggerNewGame) {
      this.showNewGameButton = true;
      return;
    }

    this.changing_direction = false;
    setTimeout(() => {
      this.clearCanvas();
      this.drawFood();
      this.moveSnake();
      this.drawSnake();
      // Call main again
      this.main();
    }, this.gameVelocity);
  }

  // draw a border around the canvas
  clearCanvas() {
    //  Select the colour to fill the drawing
    this.snakeboard_ctx.fillStyle = this.board_background;
    //  Select the colour for the border of the canvas
    this.snakeboard_ctx.strokestyle = this.board_border;
    // Draw a "filled" rectangle to cover the entire canvas
    this.snakeboard_ctx.fillRect(
      0,
      0,
      this.snakeboard.width,
      this.snakeboard.height
    );
    // Draw a "border" around the entire canvas
    this.snakeboard_ctx.strokeRect(
      0,
      0,
      this.snakeboard.width,
      this.snakeboard.height
    );
  }

  // Draw the snake on the canvas
  drawSnake() {
    // Draw each part
    this.snake.forEach((part) => this.drawSnakePart(part));
  }

  // Draw one snake part
  drawSnakePart(snakePart: Coordinates) {
    // Set the color of the snake part
    this.snakeboard_ctx.fillStyle = this.snake_body;
    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    this.snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
    // Set the border color of the snake part
    this.snakeboard_ctx.strokestyle = this.snake_border;
    // Draw a border around the snake part
    this.snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
  }

  moveSnake() {
    // Create the new Snake's head
    const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
    // Add the new head to the beginning of snake body
    this.snake.unshift(head);
    const has_eaten_food =
      this.snake[0].x == this.food_x && this.snake[0].y == this.food_y;
    if (has_eaten_food) {
      this.score += 10;
      this.foodColor = this.foodRandomColours[Math.floor(Math.random() * 6)];
      // Generate new food location
      this.gen_food();
    } else {
      // Remove the last part of snake body
      this.snake.pop();
    }
  }

  has_game_ended() {
    for (let i = 4; i < this.snake.length; i++) {
      const has_collided =
        this.snake[i].x === this.snake[0].x &&
        this.snake[i].y === this.snake[0].y;
      if (has_collided) {
        this.endOfGameService.endOfGame.next({
          open: true,
          reasonOfEnd: 'hasCollided',
        });
        return true;
      }
    }
    const hitLeftWall = this.snake[0].x < 0;
    const hitRightWall = this.snake[0].x + 20 > this.snakeboard.width;
    const hitToptWall = this.snake[0].y < 0;
    const hitBottomWall = this.snake[0].y + 20 > this.snakeboard.height;

    if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) {
      this.endOfGameService.endOfGame.next({
        open: true,
        reasonOfEnd: 'borderTouched',
      });
    }

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
  }

  newGame() {
    this.showNewGameButton = false;
    this.endOfGameService.endOfGame.next({ open: false });

    this.gameVelocity = 400;
    this.score = 0;
    this.snake = [
      { x: 280, y: 240 },
      { x: 260, y: 240 },
      { x: 240, y: 240 },
      { x: 220, y: 240 },
      { x: 200, y: 240 },
    ];
    this.main({ triggerNewGame: true });
  }

  random_food(min: number, max: number) {
    return Math.round((Math.random() * (max - min) + min) / 20) * 20;
  }

  gen_food() {
    if (this.score % 30 === 0) {
      this.informPlayerThatGameVelocityIncreases = true;
      setTimeout(() => {
        this.informPlayerThatGameVelocityIncreases = false;
      }, 3000);
      this.gameVelocity -= 50;
    }
    this.food_x = this.random_food(0, this.snakeboard.width - 20);
    this.food_y = this.random_food(0, this.snakeboard.height - 20);
    this.snake.forEach((part) => {
      const has_eaten = part.x == this.food_x && part.y == this.food_y;
      if (has_eaten) this.gen_food();
    });
  }

  drawFood() {
    this.snakeboard_ctx.fillStyle = this.foodColor;
    this.snakeboard_ctx.strokestyle = 'rgb(80, 29, 198)';
    this.snakeboard_ctx.fillRect(this.food_x, this.food_y, 10, 10);
    this.snakeboard_ctx.strokeRect(this.food_x, this.food_y, 10, 10);
  }
}
