import { Vector2 } from "./modules/area_tools";
import { Piece, Stack } from "./modules/pieces";
import { ws } from "./modules/ws_tools";

let canvas = document.getElementById("table-main") as HTMLCanvasElement;
let context = canvas.getContext(
	"2d",
	{alpha: false}
) as CanvasRenderingContext2D;

context.imageSmoothingEnabled = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tableContents: (Piece|Stack)[] = [];

let center = new Vector2(canvas.width / 2, canvas.height / 2);
let offset = new Vector2(0, 0);
let pan = new Vector2(0, 0);
let panOrigin = new Vector2(0, 0);
let zoom = 1;
let zoomOrigin = 0;
let zoomCenter = new Vector2(0, 0);

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
	console.log("FPS:", frames);
	frames = 0;
}, 1000);

function render() {
	frames ++;
	context.fillStyle = "#448866";
	context.fillRect(0, 0, canvas.width, canvas.height);

	for (let tableItem of tableContents) {
		context.drawImage(
			tableItem.image,
			Math.floor((tableItem.x * zoom) + pan.x),
			Math.floor((tableItem.y * zoom) + pan.y),
			Math.floor(tableItem.w * zoom),
			Math.floor(tableItem.h * zoom),
		);
	}

	if (grabbed) {
		context.strokeStyle = "#cccc44";
		context.stroke(grabbed.boundaryPath(pan, zoom));
	}
}

function changeZoom(factor: number) {
		let oldZoom = zoom;
		zoom *= 1 + factor;

		let zoomRatio = zoom / oldZoom;
		pan.x = (pan.x - zoomCenter.x) * zoomRatio + zoomCenter.x;
		pan.y = (pan.y - zoomCenter.y) * zoomRatio + zoomCenter.y;
}

canvas.addEventListener("contextmenu", function(event) {
	event.preventDefault();
});

canvas.addEventListener("mousedown", function(event) {
	if (event.button === 2) {
		panOrigin.x = event.offsetX;
		panOrigin.y = event.offsetY;
		panning = true;
		return;
	}
	if (event.button === 1) {
		zoomOrigin = event.offsetY;
		zoomCenter = new Vector2(event.offsetX, event.offsetY);
		zooming = true;
		return;
	}
	for (let tableItem of tableContents) {
		if (context.isPointInPath(tableItem.boundaryPath(pan, zoom), event.offsetX, event.offsetY)) {
			offset.x = event.offsetX / zoom - tableItem.x;
			offset.y = event.offsetY / zoom - tableItem.y;
			grabbed = tableItem;
		}
	}
});

canvas.addEventListener("mousemove", function(event: MouseEvent) {
	if (grabbed) {
		grabbed.x = event.offsetX / zoom - offset.x;
		grabbed.y = event.offsetY / zoom - offset.y;
	}
	if (panning) {
		pan.x += event.offsetX - panOrigin.x;
		pan.y += event.offsetY - panOrigin.y;
		panOrigin.x = event.offsetX;
		panOrigin.y = event.offsetY;
	}
	if (zooming) {
		changeZoom((zoomOrigin - event.offsetY) / 200);
		zoomOrigin = event.offsetY;
	}
});

canvas.addEventListener("wheel", function(event: WheelEvent) {
	zoomCenter = new Vector2(event.offsetX, event.offsetY);
	let direction = Math.sign(event.deltaY);
	changeZoom(direction * -0.1);
});

canvas.addEventListener("mouseup", function(event: MouseEvent) {
	grabbed = null;
	panning = false;
	zooming = false;
});

function main() {
	render();
	setTimeout(() => requestAnimationFrame(main), 10);
}
