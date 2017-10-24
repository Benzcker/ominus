document.addEventListener('keydown', event => {
	if (event.keyCode == 37) {
		camDir.x = 0.1;
	} else if (event.keyCode == 39) {
		camDir.x = -0.1;
	} else if (event.keyCode == 40) {
		camDir.y = -0.1;
	} else if (event.keyCode == 38) {
		camDir.y = 0.1;
	} else if (event.keyCode == 107) {
		DOMscale.value = constrain(parseInt(DOMscale.value) + 1, 4, 100);
	} else if (event.keyCode == 109) {
		DOMscale.value = constrain(DOMscale.value - 1, 4, 100);
	} else {
		//console.log(event.keyCode);
	}
});

document.addEventListener('keyup', event => {
	if (event.keyCode == 37 && camDir.x > 0) {
		camDir.x = 0;
	} else if (event.keyCode == 39 && camDir.x < 0) {
		camDir.x = 0;
	} else if (event.keyCode == 40 && camDir.y < 0) {
		camDir.y = 0;
	} else if (event.keyCode == 38 && camDir.y > 0) {
		camDir.y = 0;
	}
});



function constrain(nr, min, max) {
	if (min > max) {
		return nr;
	} else if (nr < min) {
		return min;
	} else if (nr > max) {
		return max;
	}
	return nr;
}

function randomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let c = 0; c < 6; c++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}