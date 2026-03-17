const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');

app.disableHardwareAcceleration();

let win;
app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 500,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  win.setIgnoreMouseEvents(true); // 点击穿透
  win.loadFile('src/index.html');

  // 注册全局 F1 用于切换模式
  globalShortcut.register('F1', () => {
    win.webContents.send('toggle-render-mode');
  });

  // F2 关闭程序
  globalShortcut.register('F2', () => {
    app.quit();
  });
});

app.on('ready', () => {
  globalShortcut.register('F2', () => {
    app.quit();  // ← 按下 F2 直接退出整个进程
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});