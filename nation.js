class Nation {
	constructor(index, dna) {
		this.index = index | 0;

		this.color = randomColor();
		this.outerCells = [];
		this.innerCells = [];
		this.dna = new Dna(dna);

		this.friends = [];
		this.enemys = [];

		this.economy = 0;
		this.power = 0;

		this.pull = {
			x: 0,
			y: 0,
		};
	}

	conquerRandom() {
		let dirs = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
		let index = Math.random() * this.outerCells.length | 0;
		let maxIterations = this.outerCells.length;
		while (!this.outerCells[index].canConquer && maxIterations > 0) {
			maxIterations--;
			index = Math.random() * this.outerCells.length | 0;
		}
		if (maxIterations > 0) {
			let rnd = Math.random() * dirs.length | 0;
			let success = true;
			while (!this.outerCells[index].isDifferent(dirs[rnd]) && success) {
				dirs.splice(rnd, 1);
				rnd = Math.random() * dirs.length | 0;

				if(dirs.length == 0){
					success = false;
				}
			}
			if (success) {
				this.outerCells[index].tryConquer(dirs[rnd]);
			}
		}
	}

	nextTurn() {
		this.outerCells.forEach(cell => {
			this.power += cell.economy * this.dna.economy;
		});
		this.innerCells.forEach(cell => {
			this.power += cell.economy * this.dna.economy;
		});
		//this.power = constrain(this.power, 0, 100);



		if (this.pull.x == 0 && this.pull.y == 0) {
			let rndTries = this.outerCells.length;
			while (this.power > 20 && rndTries > 0) {
				rndTries--;
				this.conquerRandom();
			}
		}
	}

	updateAlive() {
		if (this.outerCells.length == 0) {
			for (let j = parseInt(this.index) + 1; j < nations.length; j++) {
				nations[j].index--;
			}
			nations.splice(this.index, 1);
		}
	}
}

class Dna {
	constructor(oldDna) {
		if (oldDna) {
			this.economy = oldDna.economy
			this.defense = oldDna.defense;
			this.agress = oldDna.agress;
			this.fear = oldDna.fear;
		} else {
			this.economy = Math.random() / 2 + 0.75;
			this.defense = Math.random() * 2;
			this.agress = Math.random();
			this.fear = Math.random();
		}
	}
}