import './style.css'
import { Engine, Scene, FreeCamera, HemisphericLight, MeshBuilder, Vector3, Color4, StandardMaterial, Color3, ArcRotateCamera, Mesh, KeyboardEventTypes } from "@babylonjs/core";

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

  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  const box = MeshBuilder.CreateBox("box", {
      size: 1,
  }, scene);
  box.position = new Vector3(2, HALF_CUBE_SIZE, 0)

  const snakeBodyMaterial = new StandardMaterial("snakeBodyMaterial", scene);
  snakeBodyMaterial.diffuseColor = new Color3(0, 1, 0);
  box.material = snakeBodyMaterial;

  box.checkCollisions = true;

  scene.onKeyboardObservable.add((kbInfo) => {
		switch (kbInfo.type) {
			case KeyboardEventTypes.KEYDOWN:
				switch (kbInfo.event.key) {
          case "a":
          case "A":
            box.position.x -= 1;
          break
          case "d":
          case "D":
            box.position.x += 1;
          break
          case "w":
          case "W":
            box.position.z += 1;
          break
          case "s":
          case "S":
            box.position.z -= 1;
          break
      }
			break;
		}
	});

  return scene;
}

const mainScene = createScene();

engine.runRenderLoop(() => mainScene.render());

