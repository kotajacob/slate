import { Vector2 } from "./modules/area_tools";
import { Piece, Stack } from "./modules/pieces";
import { ws } from "./modules/ws_tools";

let canvas = document.getElementById("table-main") as HTMLCanvasElement;
let context = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tableContents: (Piece|Stack)[] = [];

async function populateTable() {
	tableContents = await ws.get();
	console.log(tableContents);
}

populateTable();

let handle: any = {
	radius: 20,
	x: canvas.width / 2,
	y: canvas.height / 2,
	boundary: null,
	grabbed: false,
};

handle.boundary = new Path2D();
handle.boundary.rect(
	handle.x - handle.radius,
	handle.y - handle.radius,
	handle.radius * 2,
	handle.radius * 2
);

let offset = new Vector2(0, 0);

main();

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#448866";
	context.fillRect(0, 0, canvas.width, canvas.height);

	for (let tableItem of tableContents) {
		context.drawImage(tableItem.image, tableItem.x, tableItem.y);
	}
	context.fillStyle = "#333333";
	context.beginPath();
	context.arc(handle.x, handle.y, handle.radius, 0, Math.PI * 2, false);
	context.fill();

	if (handle.grabbed) {
		context.strokeStyle = "#cccc44";
		context.stroke(handle.boundary);
	}
}

canvas.addEventListener("mousedown", function (event) {
	if (context.isPointInPath(handle.boundary, event.offsetX, event.offsetY)) {
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("mouseup", onMouseUp);
		offset.x = event.clientX - handle.x;
		offset.y = event.clientY - handle.y;
		handle.boundary = new Path2D();
		handle.boundary.rect(
			handle.x - handle.radius,
			handle.y - handle.radius,
			handle.radius * 2,
			handle.radius * 2
		);
		handle.grabbed = true;
	}
});

function onMouseMove(event: MouseEvent) {
	handle.x = event.clientX - offset.x;
	handle.y = event.clientY - offset.y;
	handle.boundary = new Path2D();
	handle.boundary.rect(
		handle.x - handle.radius,
		handle.y - handle.radius,
		handle.radius * 2,
		handle.radius * 2
	);
}

function onMouseUp(event: MouseEvent) {
	canvas.removeEventListener("mousemove", onMouseMove);
	canvas.removeEventListener("mouseup", onMouseUp);
	handle.grabbed = false;
}

function main() {
	render();
	requestAnimationFrame(main);
}
