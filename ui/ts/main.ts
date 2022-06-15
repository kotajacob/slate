import { Rectangle, Vector2 } from "./modules/area_tools";
import { Piece, Stack } from "./modules/pieces";
import { ws } from "./modules/ws_tools";

let canvas = document.getElementById("table-main") as HTMLCanvasElement;
let context = canvas.getContext(
	"2d",
	{alpha: false}
) as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.fillStyle = "#448866";
context.fillRect(0, 0, canvas.width, canvas.height);

let tableContents: (Piece|Stack)[] = [];
let drawnRegions: Rectangle[] = [];

let offset = new Vector2(0, 0);
let pan = new Vector2(0, 0);
let panOrigin = new Vector2(0, 0);
let zoom = 1;
let zoomOrigin = 0;

let grabbed: (null|Piece|Stack) = null;
let panning = false;
let zooming = false;

function populateTable() {
	tableContents = ws.get();
}

populateTable();
main();

let frames = 0;
setInterval(function() {
	console.log(frames);
	frames = 0;
}, 1000);

function render() {
	frames ++;
	context.beginPath();
	for (let rectangle of drawnRegions) {
		context.rect(
			rectangle.x - 5,
			rectangle.y - 5,
			rectangle.w + 10,
			rectangle.h + 10,
		);
	}
	context.fillStyle = "#448866";
	context.fill()

	drawnRegions = [];

	for (let tableItem of tableContents) {
		let drawBoundary = {
			x: Math.floor(tableItem.x - pan.x),
			y: Math.floor(tableItem.y - pan.y),
			w: Math.floor(tableItem.w * zoom),
			h: Math.floor(tableItem.h * zoom),
		}
		drawnRegions.push(drawBoundary);
		context.drawImage(
			tableItem.image,
			drawBoundary.x,
			drawBoundary.y,
			drawBoundary.w,
			drawBoundary.h,
		);
	}

	if (grabbed) {
		context.strokeStyle = "#cccc44";
		context.stroke(grabbed.boundaryPath(pan.negative()));
	}
}

canvas.addEventListener("contextmenu", function(event) {
	event.preventDefault();
	panOrigin.x = event.offsetX;
	panOrigin.y = event.offsetY;
	panning = true;
});

canvas.addEventListener("mousedown", function(event) {
	for (let tableItem of tableContents) {
		if (context.isPointInPath(tableItem.boundaryPath(pan.negative()), event.offsetX, event.offsetY)) {
			offset.x = event.offsetX - tableItem.x;
			offset.y = event.offsetY - tableItem.y;
			grabbed = tableItem;
		}
	}
});

canvas.addEventListener("mousemove", function(event: MouseEvent) {
	if (grabbed) {
		grabbed.x = event.offsetX - offset.x;
		grabbed.y = event.offsetY - offset.y;
	}
	if (panning) {
		pan.x += panOrigin.x - event.offsetX;
		pan.y += panOrigin.y - event.offsetY;
		panOrigin.x = event.offsetX;
		panOrigin.y = event.offsetY;
	}
});

canvas.addEventListener("mouseup", function(event: MouseEvent) {
	grabbed = null;
	panning = false;
});

function main() {
	render();
	setTimeout(() => requestAnimationFrame(main), 10);
}
