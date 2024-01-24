const {
	app,
	BrowserWindow,
	ipcMain,
	screen,
	globalShortcut,
} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const screenshot = require('screenshot-desktop');
const { uploadImage } = require('./web/aws');
const sharp = require('sharp');

if (isDev) {
	require('electron-reloader')(module, {
		debug: true,
		watchRenderer: true,
	});
}

const BORDER_SIZE = 5;

function windowMoving(event, { mouseX, mouseY }) {
	const webContents = event.sender;
	const window = BrowserWindow.fromWebContents(webContents);

	const { x, y } = screen.getCursorScreenPoint();
	window.setPosition(x - mouseX, y - mouseY);
}

async function takeScreenshot(event) {
	const webContents = event.sender;
	const window = BrowserWindow.fromWebContents(webContents);

	const winBounds = window.getBounds();
	let currentDisplay = screen.getDisplayNearestPoint({
		x: winBounds.x,
		y: winBounds.y,
	});

	if (currentDisplay.label === 'Built-in Retina Display') {
		currentDisplay.label = 'Color LCD';
	}

	const windowPosition = window.getPosition();
	let x = windowPosition[0] + BORDER_SIZE; // add padding from border
	let y = windowPosition[1] + BORDER_SIZE; // add padding from border

	const windowSize = window.getSize();
	const width = windowSize[0] - BORDER_SIZE * 2; // subtract padding from border
	const height = windowSize[1] - BORDER_SIZE * 2; // subtract padding from border

	x = x - currentDisplay.bounds.x;
	y = y - currentDisplay.bounds.y;

	const displays = await screenshot.listDisplays();

	const display = displays.find((display) => {
		return display.name === currentDisplay.label;
	});

	let image = await screenshot({
		format: 'png',
		screen: display.id,
	});

	console.log(x, y, width, height, currentDisplay.bounds);

	image = await sharp(image)
		.resize({
			width: currentDisplay.size.width,
			height: currentDisplay.size.height,
		})
		.extract({
			left: x,
			top: y,
			width,
			height,
		})
		.png()
		.toBuffer();

	await uploadImage(image);
}

let previousFullscreenSizeX, previousFullscreenSizeY;
let previousFullscreenPositionX, previousFullscreenPositionY;

function fullscreen(event) {
	const webContents = event.sender;
	const window = BrowserWindow.fromWebContents(webContents);

	const winBounds = window.getBounds();
	previousFullscreenSizeX = winBounds.width;
	previousFullscreenSizeY = winBounds.height;

	const windowPosition = window.getPosition();
	previousFullscreenPositionX = windowPosition[0];
	previousFullscreenPositionY = windowPosition[1];

	const primaryDisplay = screen.getPrimaryDisplay();

	if (
		window.size.width === primaryDisplay.size.width &&
		window.size.height === primaryDisplay.size.height
	) {
		window.setSize(previousFullscreenSizeX, previousFullscreenSizeY);
		window.setPosition(
			previousFullscreenPositionX,
			previousFullscreenPositionY
		);

		return;
	}

	window.setSize(primaryDisplay.size.width, primaryDisplay.size.height);

	window.setPosition(0, 0);
}

function createWindow() {
	if (BrowserWindow.getAllWindows().length !== 0) return;

	const window = new BrowserWindow({
		width: 600,
		height: 600,
		transparent: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	const { x, y } = screen.getCursorScreenPoint();
	window.setPosition(x - 300, y - 300);

	window.setAlwaysOnTop(true, 'screen-saver');

	ipcMain.on('windowMoving', windowMoving);
	ipcMain.on('takeScreenshot', takeScreenshot);
	ipcMain.on('fullscreen', fullscreen);

	window.loadFile(path.join(__dirname, 'cropper/index.html'));
}

function activate() {
	globalShortcut.register('CommandOrControl+Y', createWindow);
}

function windowsClosed(event) {
	event.preventDefault();
	event.returnValue = false;
}

async function init() {
	await app.whenReady();

	app.on('activate', activate);
	app.on('window-all-closed', windowsClosed);
}

init();
