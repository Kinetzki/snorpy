import { app, BrowserWindow } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { ProxyManager } from "./proxy-manager";
import { CertManager } from './cert-manager';
import { Repeater } from './repeater';

const require = createRequire(import.meta.url);
const currentDirName = path.dirname(fileURLToPath(import.meta.url));

(globalThis as any).__dirname = currentDirName;
(globalThis as any).__filename = fileURLToPath(import.meta.url);

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let proxyManager: ProxyManager | null;
let repeater: Repeater | null;

async function createWindow() {
  win = new BrowserWindow({
    backgroundColor: '#1c1c22',
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  if (!proxyManager) {
    const certPath = CertManager.getInternalPath("certs");

    const { cert, key } = await CertManager.makeCerts(certPath);
    proxyManager = new ProxyManager(win.webContents, {
      cert,
      key
    });

  } else {
    proxyManager.setWebContents(win.webContents)
  }

  if (!repeater) {
    repeater = new Repeater(win.webContents);
  } else {
    repeater.setWebContents(win.webContents);
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    
    app.quit()
    
    win = null
  }
})

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow()
  }
})

app.on('before-quit', async (event) => {
  if (proxyManager) {
    event.preventDefault();
    try {
      await proxyManager.stop();
      console.log("Proxy stopped successfully")
    } catch (error) {
      console.error("Failed to stop proxy", error)
    } finally {
      app.removeAllListeners('before-quit');
      app.quit()
    }
  }
})

app.whenReady().then(createWindow)
