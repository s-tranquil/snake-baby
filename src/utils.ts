import { Direction } from "./types";

export function isOppositeDirection(currentDirection: Direction, newDirection: Direction) {
    switch(currentDirection) {
        case Direction.Down:
            return newDirection === Direction.Up;
        case Direction.Left:
            return newDirection === Direction.Right;
        case Direction.Up:
            return newDirection === Direction.Down;
        case Direction.Right:
            return newDirection === Direction.Left;
    }
}