let	canvas = document.getElementById("table-main");
let	context	= canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height =	window.innerHeight;

let	handle = {
	radius:	20,
	x: canvas.width	/ 2,
	y: canvas.height / 2,
	boundary: null,
	grabbed: false
};

handle.boundary	= new Path2D();
handle.boundary.rect(
	handle.x - handle.radius,
	handle.y - handle.radius,
	handle.radius *	2,
	handle.radius *	2
);

let	offset = {};

animate();

function render() {
	context.clearRect(0, 0,	canvas.width, canvas.height);

	context.fillStyle =	"#333333";
	context.beginPath();
	context.arc(handle.x, handle.y,	handle.radius, 0, Math.PI *	2, false);
	context.fill();

	if (handle.grabbed)	{
		context.strokeStyle	= "#cccc44";
		context.stroke(handle.boundary);
	}
}

canvas.addEventListener("mousedown", function(event) {
	if(context.isPointInPath(handle.boundary, event.offsetX, event.offsetY)) {
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("mouseup", onMouseUp);
		offset.x = event.clientX - handle.x;
		offset.y = event.clientY - handle.y;
		handle.boundary	= new Path2D();
		handle.boundary.rect(
			handle.x - handle.radius,
			handle.y - handle.radius,
			handle.radius *	2,
			handle.radius *	2
		);
		handle.grabbed = true;
	}
});

function onMouseMove(event)	{
	handle.x = event.clientX - offset.x;
	handle.y = event.clientY - offset.y;
	handle.boundary	= new Path2D();
	handle.boundary.rect(
		handle.x - handle.radius,
		handle.y - handle.radius,
		handle.radius *	2,
		handle.radius *	2
	);
}

function onMouseUp(event) {
	canvas.removeEventListener("mousemove",	onMouseMove);
	canvas.removeEventListener("mouseup", onMouseUp);
	handle.grabbed = false;
}

function animate() {
	render();
	requestAnimationFrame(animate);
}
