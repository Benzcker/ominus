class Cell {
	constructor(x, y) {
		this.pos = {
			x: x,
			y: y
		}
		this.nation = undefined;
		this.nationIndex = 0;
		this.cellArr = 'OUTER';

		this.defense = Math.random() * 9 + 1 | 0;
		this.economy = Math.random();
	}



	get canConquer() {
		return this.isDifferent('UP') || this.isDifferent('DOWN') || this.isDifferent('LEFT') || this.isDifferent('RIGHT');
	}

	conquer(x, y, neededPower) {
		if (this.nation.power >= neededPower) {
			this.nation.power -= neededPower;
			if (continent.cells[y][x].nation) {
				for (let j = parseInt(continent.cells[y][x].nationIndex) + 1; j < continent.cells[y][x].nation.outerCells.length; j++) {
					if (j < 0) {
						j = 0;
						continent.cells[y][x].nation.outerCells[j].nationIndex--;
						console.warn("j Neg", continent.cells[y][x].nationIndex);
					} else {
						continent.cells[y][x].nation.outerCells[j].nationIndex--;
					}
				}
				continent.cells[y][x].nation.outerCells.splice(continent.cells[y][x].nationIndex, 1);
				continent.cells[y][x].nation.updateAlive();
			}


			continent.cells[y][x].nation = this.nation;
			continent.cells[y][x].nation.outerCells.push(continent.cells[y][x]);
			continent.cells[y][x].nationIndex = continent.cells[y][x].nation.outerCells.length - 1;
			continent.cells[y][x].cellArr = 'OUTER';
			continent.cells[y][x].updateNeighbours();
		}
	}

	draw() {
		if (this.nation == undefined) {
			context.fillStyle = '#fff';
		} else {
			// if (this.cellArr == 'OUTER') {
			context.fillStyle = this.nation.color;
			// } else {
			// context.fillStyle = '#000';
			// }
		}
		rect(this.pos.x * continent.scale - camOffset.x, this.pos.y * continent.scale - camOffset.y,
			continent.scale, continent.scale);
		if (continent.scale > 8) {
			context.fillStyle = '#000';
			context.strokeRect(this.pos.x * continent.scale - camOffset.x, this.pos.y * continent.scale - camOffset.y,
				continent.scale, continent.scale);
		}
	}

	isDifferent(dir) {
		switch (dir) {
			case 'UP':
				return this.pos.y > 0 && continent.cells[this.pos.y - 1][this.pos.x].nation != this.nation;
			case 'DOWN':
				return this.pos.y < continent.cells.length - 1 && continent.cells[this.pos.y + 1][this.pos.x].nation != this.nation;
			case 'LEFT':
				return this.pos.x > 0 && continent.cells[this.pos.y][this.pos.x - 1].nation != this.nation;
			case 'RIGHT':
				return this.pos.x < continent.cells[this.pos.y].length - 1 && continent.cells[this.pos.y][this.pos.x + 1].nation != this.nation;
		}
	}

	removeMyNation() {
		if (this.cellArr == 'INNER') {
			for (let k = this.nationIndex + 1; k < this.nation.innerCells.length; k++) {
				this.nation.innerCells[k].nationIndex--;
			}
			this.nation.innerCells.splice(this.nationIndex, 1);
		} else {
			for (let k = this.nationIndex + 1; k < this.nation.outerCells.length; k++) {
				this.nation.outerCells[k].nationIndex--;
			}
			this.nation.outerCells.splice(this.nationIndex, 1);
		}

		this.updateNeighbours();
	}

	tryConquer(direction) {
		let x = this.pos.x;
		let y = this.pos.y;
		switch (direction) {
			case 'LEFT':
				x--;
				break;
			case 'RIGHT':
				x++;
				break;
			case 'UP':
				y--;
				break;
			case 'DOWN':
				y++;
				break;
		}

		let neededPower = 0;
		if (continent.cells[y][x].nation != undefined &&
			neededPower == continent.cells[y][x].defense * continent.cells[y][x].nation.dna.defense | 0) {} else {
			neededPower = continent.cells[y][x].defense;
		}

		this.conquer(x, y, neededPower);
	}

	updateCellInd() {
		if (this.cellArr == 'INNER' && this.canConquer) {
			for (let k = this.nationIndex + 1; k < this.nation.innerCells.length; k++) {
				if (this.nation.innerCells[k]) this.nation.innerCells[k].nationIndex--; // If wahrscheinlich nicht benötigt
			}
			if(this.nationIndex < 0){
				console.log(this.nationIndex);
			}
			this.nation.innerCells.splice(this.nationIndex, 1);
			this.nation.outerCells.push(this);
			this.nationIndex = this.nation.outerCells.length - 1;
			this.cellArr = 'OUTER';
		} else if (this.cellArr == 'OUTER' && !this.canConquer) {
			for (let k = this.nationIndex + 1; k < this.nation.outerCells.length; k++) {
				if (this.nation.outerCells[k]) this.nation.outerCells[k].nationIndex--;
			}
			if(this.nationIndex < 0){
				console.log(this.nationIndex);
			}
			this.nation.outerCells.splice(this.nationIndex, 1);
			this.nation.innerCells.push(this);
			this.nationIndex = this.nation.innerCells.length - 1;
			this.cellArr = 'INNER';
		}
	}

	updateNeighbours() {
		if (this.pos.x > 0) {
			continent.cells[this.pos.y][this.pos.x - 1].updateCellInd();
		}
		if (this.pos.x < continent.width - 2) {
			continent.cells[this.pos.y][this.pos.x + 1].updateCellInd();
		}
		if (this.pos.y > 0) {
			continent.cells[this.pos.y - 1][this.pos.x].updateCellInd();
		}
		if (this.pos.y < continent.height - 2) {
			continent.cells[this.pos.y + 1][this.pos.x].updateCellInd();
		}
	}
}