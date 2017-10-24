let ausgabe;

class Continent {
	constructor(width, height) {
		this.createNew(width, height);

		this.scale = 20;
	}

	createNew(width, height) {
		this.width = width;
		this.height = height;
		this.cells = new Array(height);
		for (let i = 0; i < height; i++) {
			this.cells[i] = new Array(width);
		}
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				this.cells[y][x] = new Cell(x, y);
			}
		}
	}

	draw() {
		context.lineWidth = this.scale / 10 | 0;
		for (let y = constrain((camOffset.y / continent.scale | 0), 0, this.cells.length - 1); y < constrain((((camOffset.y + canvas.height) / continent.scale | 0) + 1), 0, this.cells.length); y++) {
			for (let x = constrain((camOffset.x / continent.scale | 0), 0, this.cells[y].length); x < constrain((((camOffset.x + canvas.width) / continent.scale | 0) + 1), 0, this.cells[y].length); x++) {
				this.cells[y][x].draw();
			}
		}
		// nations.forEach(nation =>{
		// 	nation.outerCells.forEach(cell =>{
		// 		cell.draw();
		// 	});
		// });
	}
}