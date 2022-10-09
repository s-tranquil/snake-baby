export interface Coordinates2d {
    x: number;
    y: number;
}

export enum Direction {
    Up,
    Down,
    Left,
    Right
}

export interface Snake {
    body: Coordinates2d[],
    currentDirection: Direction,
    nextDirection: Direction,
}
