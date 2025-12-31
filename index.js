const { app, BrowserWindow } = require('electron');
const { createWindow } = require('./main');

// Connexion DB
require('./database');

// Reload en développement
require('electron-reload')(__dirname);

app.whenReady().then(() => {
  createWindow();
});

// Fermeture propre
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
