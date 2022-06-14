import { Piece, Stack } from "./pieces";

let knight = new Piece(
	"/static/img/kenney/PNG/Double (128px)/chess_knight.png",
	200, 50,
);
let rook = new Piece(
	"/static/img/kenney/PNG/Double (128px)/chess_rook.png",
	200, 250,
);
let die6 = new Stack([
	new Piece(
		"/static/img/d6/1.png",
		50, 50,
	),
	new Piece(
		"/static/img/d6/2.png",
		50, 50,
	),
	new Piece(
		"/static/img/d6/3.png",
		50, 50,
	),
	new Piece(
		"/static/img/d6/4.png",
		50, 50,
	),
	new Piece(
		"/static/img/d6/5.png",
		50, 50,
	),
	new Piece(
		"/static/img/d6/6.png",
		50, 50,
	),
]);

let serverRes = [die6, knight, rook];
let ws = {
	get: function() {
		return serverRes.slice();
	},
};

export { ws };
