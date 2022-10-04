import './style.css'
import { Engine, Scene, HemisphericLight, MeshBuilder, Vector3, StandardMaterial, Color3, ArcRotateCamera, Mesh, KeyboardEventTypes } from "@babylonjs/core";
import { snakeStore } from './store';
import { Coordinates2d, Direction, Snake } from './types';

const HALF_CUBE_SIZE = 0.5;

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine  = new Engine(canvas, true);

function getCoordinates2d(x: number, y: number) {
  return new Vector3(x - HALF_CUBE_SIZE, 0, y - HALF_CUBE_SIZE);
}

function createLines(x: number, y: number) {
  const lines: Vector3[][] = [];
  for (let i = 1; i < x; i++) {
    lines.push([
      getCoordinates2d(i, 0),
      getCoordinates2d(i, 10),
    ]);
  }

  for (let j = 1; j < y; j++) {
    lines.push([
      getCoordinates2d(0, j),
      getCoordinates2d(10, j),
    ]);
  }
  return lines;
}

const snakeMeshCollection: Mesh[] = [];
function renderSnake(scene: Scene, body: Snake["body"]): Mesh {
  const snakeBodyMaterial = new StandardMaterial("snakeBodyMaterial", scene);
  snakeBodyMaterial.diffuseColor = new Color3(0, 1, 0);

  snakeMeshCollection.forEach(x => x.dispose());
  snakeMeshCollection.splice(0, snakeMeshCollection.length);

  body.forEach((segment, index) => {
    const box = MeshBuilder.CreateBox(`snakeBox${index}`, {
        size: 1,
    }, scene);
    box.position = new Vector3(segment.x, HALF_CUBE_SIZE, segment.y)
    box.material = snakeBodyMaterial;
    box.checkCollisions = true;
    snakeMeshCollection.push(box);
  });

  const head = snakeMeshCollection[0];
  head.computeWorldMatrix(true);
  return head;
}

let edible: Mesh | undefined;
function renderEdible(scene: Scene, edibleLocation: Coordinates2d): Mesh {
  const edibleMaterial = new StandardMaterial("edibleMaterial", scene);
  edibleMaterial.diffuseColor = Color3.Red();

  edible = undefined;
  // const edible = MeshBuilder.CreateSphere("edible", { diameter: 1 }, scene);
  edible = MeshBuilder.CreateSphere("edible", { diameter: 0.99 }, scene);
  edible.position = new Vector3(edibleLocation.x, HALF_CUBE_SIZE, edibleLocation.y);
  edible.material = edibleMaterial;
  edible.checkCollisions = true;
  edible.computeWorldMatrix(true);

  return edible;
}

const store = snakeStore;

function createScene() {
  const scene = new Scene(engine);

  const centerPosition = new Vector3(5 - HALF_CUBE_SIZE, 0, 5 - HALF_CUBE_SIZE);

  const ground = MeshBuilder.CreateGround(
      "ground",
      {
        height: 10,
        width: 10,
        subdivisionsX: 10,
        subdivisionsY: 10,
      }
  );
  ground.position = centerPosition;
  const groundMaterial = new StandardMaterial("Ground Material", scene);
  groundMaterial.diffuseColor = Color3.White();
  ground.material = groundMaterial;

	//Array of lines to construct linesystem
	const myLines = createLines(10, 10);

	//Create linesystem
	const linesystem = MeshBuilder.CreateLineSystem("linesystem", {lines: myLines}, scene);
	linesystem.color = Color3.Gray();

  // const ground = MeshBuilder.CreateGround("ground", { subdivisions: 10, width: 10, height: 0 }, scene);
  const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 6, 15, centerPosition);

  // const camera = new FreeCamera("camera", new Vector3(0, 0, -10), scene);
  camera.attachControl(canvas, true);

  new HemisphericLight("light", new Vector3(0, 1, 0), scene);


  let snakeHead = renderSnake(scene, store.getState().snake.body);
  renderEdible(scene, store.getState().edible!);
  store.subscribe((state) => {
    snakeHead = renderSnake(scene, state.snake.body);
    // edible = renderEdible(scene, state.edible);
  });

  scene.registerBeforeRender(function () {
    if (edible && snakeHead.intersectsMesh(edible, false)) {
      store.getState().eat();
      edible.dispose();
      edible = undefined;
    }
  });

  scene.onKeyboardObservable.add((kbInfo) => {
		switch (kbInfo.type) {
			case KeyboardEventTypes.KEYDOWN:
				switch (kbInfo.event.key) {
          case "a":
          case "A":
            store.getState().changeDirection(Direction.Left);
            break;
          case "d":
          case "D":
            store.getState().changeDirection(Direction.Right);
            break;
          case "w":
          case "W":
            store.getState().changeDirection(Direction.Up);
            break;
          case "s":
          case "S":
            store.getState().changeDirection(Direction.Down);
            break;
          case " ":
            store.getState().start();
            break;
        }
			break;
		}
	});

  return scene;
}

const mainScene = createScene();

engine.runRenderLoop(() => mainScene.render());

