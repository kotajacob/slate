import { Vector2 } from "./modules/area_tools";
import { Piece, Stack } from "./modules/pieces";
import { ws } from "./modules/ws_tools";

let canvas = document.getElementById("table-main") as HTMLCanvasElement;
let context = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tableContents: (Piece|Stack)[] = [];

let offset = new Vector2(0, 0);
let grabbed: (null|Piece|Stack) = null;
let pan = new Vector2(0, 0);
let zoom = 1;


function populateTable() {
	tableContents = ws.get();
}

populateTable();
main();

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#448866";
	context.fillRect(0, 0, canvas.width, canvas.height);

	for (let tableItem of tableContents) {
		context.drawImage(
			tableItem.image,
			tableItem.x - pan.x,
			tableItem.y - pan.y,
			tableItem.w * zoom,
			tableItem.h * zoom,
		);
	}

	if (grabbed) {
		context.strokeStyle = "#cccc44";
		context.stroke(grabbed.boundaryPath);
	}
}

canvas.addEventListener("mousedown", function (event) {
	for (let tableItem of tableContents) {
		if (context.isPointInPath(tableItem.boundaryPath, event.offsetX, event.offsetY)) {
			offset.x = event.offsetX - tableItem.x;
			offset.y = event.offsetY - tableItem.y;
			grabbed = tableItem;
		}
	}
});

canvas.addEventListener("mousemove", function (event: MouseEvent) {
	if (grabbed) {
		grabbed.x = event.clientX - offset.x;
		grabbed.y = event.clientY - offset.y;
		grabbed.boundaryPathGenerate();
	}
});

canvas.addEventListener("mouseup", function (event: MouseEvent) {
	grabbed = null;
});

function main() {
	render();
	requestAnimationFrame(main);
}
