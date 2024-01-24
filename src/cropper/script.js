const content = document.querySelector('.content');

let mouseDown;
let mouseX, mouseY;

function takeScreenshot(e) {
	if (e.key === 'Enter') {
		window.bridge.takeScreenshot();

		window.close();
	} else if (e.key === 'Escape') {
		window.close();
	}
}

function onMouseDown(e) {
	mouseX = e.clientX;
	mouseY = e.clientY;

	requestAnimationFrame(moveWindow);
}

function onMouseUp() {
	cancelAnimationFrame(animationId);
}

function moveWindow() {
	window.bridge.windowMoving({ mouseX, mouseY });
	animationId = requestAnimationFrame(moveWindow);
}

function fullscreen(event) {
	if (event.detail === 2) {
		window.bridge.fullscreen();
	}
}

content.addEventListener('mousedown', onMouseDown);
content.addEventListener('mouseup', onMouseUp);
content.addEventListener('click', fullscreen);

window.addEventListener('keyup', takeScreenshot);
