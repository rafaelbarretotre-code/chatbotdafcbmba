const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const APP_URL = 'https://chatbotdafcbmba.lovable.app';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'Central de Ajuda DAF — CBMBA',
    backgroundColor: '#0f172a',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenuBarVisibility(false);

  const errorPage = (msg) =>
    `data:text/html;charset=utf-8,` +
    encodeURIComponent(`<!doctype html><html><head><meta charset="utf-8"><title>Sem conexão</title>
    <style>
      body{margin:0;background:#0f172a;color:#fff;font-family:Segoe UI,Arial,sans-serif;
        display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:24px}
      .card{max-width:520px}
      h1{color:#f59e0b;font-size:24px;margin-bottom:12px;text-transform:uppercase;letter-spacing:.1em}
      p{color:#cbd5e1;line-height:1.6}
      button{margin-top:24px;background:#dc2626;color:#fff;border:0;padding:12px 28px;
        font-weight:700;text-transform:uppercase;letter-spacing:.15em;cursor:pointer;border-radius:6px}
      button:hover{background:#b91c1c}
    </style></head><body><div class="card">
      <h1>Sem conexão com o servidor</h1>
      <p>Não foi possível carregar a Central de Ajuda DAF — CBMBA.<br>
      Verifique sua conexão com a internet e tente novamente.</p>
      <p style="opacity:.6;font-size:12px;margin-top:16px">${msg}</p>
      <button onclick="location.href='${APP_URL}'">Tentar novamente</button>
    </div></body></html>`);

  win.webContents.on('did-fail-load', (_e, code, desc, url, isMainFrame) => {
    if (!isMainFrame) return;
    if (code === -3) return; // aborted (normal during navigation)
    win.loadURL(errorPage(`${desc} (${code})`));
  });

  // Open external links in the default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.loadURL(APP_URL);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
