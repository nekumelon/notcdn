const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('bridge', {
	takeScreenshot: () => ipcRenderer.send('takeScreenshot'),
	windowMoving: (pos) => ipcRenderer.send('windowMoving', pos),
	fullscreen: () => ipcRenderer.send('fullscreen'),
});
