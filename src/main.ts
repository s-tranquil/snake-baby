import './style.css'
import { Engine, Scene, FreeCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

const engine  = new Engine(canvas, true);

function createScene() {
    const scene = new Scene(engine);

    const camera = new FreeCamera("camera", new Vector3(0, 0, -10), scene);
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    const box = MeshBuilder.CreateBox("box", {
        size: 1,
    }, scene);

    return scene;
}

const mainScene = createScene();

engine.runRenderLoop(() => mainScene.render());
console.log("alive");

