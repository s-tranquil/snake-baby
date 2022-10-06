import create from "zustand/vanilla";
import { Coordinates2d, Direction, Snake } from "./types";
import { isOppositeDirection } from "./utils";

type SnakeStore = {
    fieldSize: Coordinates2d,
    snake: Snake,
    edible: Coordinates2d | undefined,
    eaten: boolean;
    timer: number;
    start: () => void;
    moveSnake: () => void;
    changeDirection: (direction: Direction) => void;
    eat: () => void;
}

const snakeStore = create<SnakeStore>((set, get) => ({
    fieldSize: { x: 10, y: 10 },
    snake: {
        body: [{ x: 5, y: 5 }, { x: 5, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 2 }],
        currentDirection: Direction.Up,
        nextDirection: Direction.Up,
    },
    edible: { x: 5, y: 7 },
    eaten: false,
    timer: 0,
    start() {
        const timer = setTimeout(
            () => {
                const state = get();
                state.moveSnake();
                state.start();
            },
            500
        );
        set({ timer });
    },
    moveSnake() {
        const { snake, eaten } = get();
        const direction = snake.nextDirection;
        const newSnake = {
            ...snake,
            currentDirection: direction,
            body: snake.body.slice(0, eaten ? snake.body.length : -1)
        };

        if (direction === Direction.Up) {
            newSnake.body.unshift({
                x: snake.body[0].x,
                y: snake.body[0].y + 1
            });
        }
        if (direction === Direction.Down) {
            newSnake.body.unshift({
                x: snake.body[0].x,
                y: snake.body[0].y - 1
            });
        }
        if (direction === Direction.Left) {
            newSnake.body.unshift({
                x: snake.body[0].x - 1,
                y: snake.body[0].y
            });
        }
        if (direction === Direction.Right) {
            newSnake.body.unshift({
                x: snake.body[0].x + 1,
                y: snake.body[0].y
            });
        }

        set({ snake: newSnake, eaten: false });
    },
    changeDirection(direction) {
        const { snake } = get();
        if (snake.nextDirection === direction) {
            return;
        }
        if (isOppositeDirection(snake.currentDirection, direction)) {
            return;
        }
        const newSnake = {
            ...snake,
            nextDirection: direction,
        };
        set({ snake: newSnake });
    },
    eat() {
        set({ edible: undefined, eaten: true });
    },
}));

export { snakeStore };

