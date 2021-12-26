import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  FOOD_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants";
import "./App.css";

const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [food, setFood] = useState(FOOD_START);
  const [speed, setSpeed] = useState(600);
  const [gameOver, setGameOver] = useState(false);
  const [dir, setDir] = useState([0, -1]);
  const [score, setScore] = useState(0);

  useInterval(() => gameLoop(), speed);

  const startGame = () => {
    setSnake(SNAKE_START);
    setFood(FOOD_START);
    setSpeed(SPEED);
    setGameOver(false);
    setDir([0, -1]);
    setScore(0);
  };

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };

  const generateFood = () =>
    food.map((_food, i) =>
      Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE))
    );

  const moveSnake = ({ keyCode }) => {
    if (keyCode >= 37 && keyCode <= 40) {
      setDir(DIRECTIONS[keyCode]);
    }
  };

  const checkCollisions = (head, snk = snake) => {
    if (
      head[0] * SCALE >= CANVAS_SIZE[0] ||
      head[0] < 0 ||
      head[1] * SCALE >= CANVAS_SIZE[1] ||
      head[1] < 0
    ) {
      return true;
    }
    for (const segment of snk) {
      if (head[0] === segment[0] && head[1] === segment[1]) {
        return true;
      }
    }
    return false;
  };

  const checkAppleCollisions = (snake) => {
    if (snake[0][0] === food[0] && snake[0][1] === food[1]) {
      let newScore = score + 1;
      let newSpeed = speed - Math.floor((13 * speed) / 100);
      setSpeed(newSpeed);
      setScore(newScore);
      let newFood = generateFood();
      console.log(newFood);
      while (checkCollisions(newFood, snake)) {
        newScore += 1;
        newSpeed = newSpeed - Math.floor((13 * newSpeed) / 100);
        setSpeed(newSpeed);
        setScore(newScore);
        newFood = generateFood();
      }
      setFood(newFood);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollisions(newSnakeHead, snake)) endGame();
    if (!checkAppleCollisions(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    context.fillStyle = "pink";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "lightblue";
    context.fillRect(food[0], food[1], 1, 1);
  }, [snake, food, gameOver]);

  return (
    <div
      role="button"
      tabIndex="0"
      className="container"
      onKeyDown={(e) => moveSnake(e)}
    >
      <div className="flex-container">
        <canvas
          ref={canvasRef}
          className="game"
          style={{ border: "1px solid white" }}
          height={`${CANVAS_SIZE[1]}px`}
          width={`${CANVAS_SIZE[0]}px`}
        />
        <div className="instructions">
          Use arrow keys to move snake <br />
          Note: If snake does not move with arrow keys then click within the
          game area to focus.
        </div>
      </div>
      {!gameOver && <div className="score">Score: {score}</div>}
      {gameOver && <h1 className="over">Game Over!</h1>}
      {gameOver && (
        <button className="btn" onClick={startGame}>
          Play Again
        </button>
      )}
    </div>
  );
};

export default App;
