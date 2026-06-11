const electronReload = require("electron-reload");
const electron = require("electron");
const server = require("./server");
const path = require("path");
const url = require("url");

let MainWindow = null; // Main window
const { app, BrowserWindow, ipcMain, Notification, screen } = electron;

// Production | Development
process.env.NODE_ENV = app.isPackaged ? "production" : "development";

// Disable warning message on console
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

// Autoreload in Development
if (process.env.NODE_ENV === "development") {
  const electronPath = path.join(__dirname, "node_modules", ".bin", "electron");
  const reloadIgnored = [
    /databases|[\/\\]\./,
    /node_modules|[\/\\]\./,
    /src|[\/\\]\./,
    /.gitignore/,
    /build.js/,
    /jquery.js/,
    /package-lock.json/,
    /package.json/,
    /webpack.common.js/,
  ];
  electronReload(__dirname, {
    electron: electronPath,
    ignored: reloadIgnored,
    argv: [],
  });
}

// Window maker
function createWindow(data) {
  const resolveData = Object.assign({}, data, {
    webPreferences: {
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      preload: path.join(__dirname, "preload.js"),

      // Removed in 2025
      // nodeIntegration: true,
      // webSecurity: false,
    },
    title: "UPK DAPM KERSANA",
    frame: true, // Disable Close & Minimize buton
    resizable: true,
    icon: path.join(__dirname, "./assets/icons/win/icon.ico"),
  });
  const window = new BrowserWindow({ ...resolveData });
  return window;
}

function RunApp() {
  server.init(function () {
    // Get user screen size
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    // Main window
    MainWindow = createWindow({
      height,
      width,
      minWidth: width,
      minHeight: height,
    });

    // Remove menu if production
    if (process.env.NODE_ENV == "production") {
      MainWindow.setMenu(null);
    }

    // Load HTML
    if (BrowserWindow.getAllWindows().length > 0) {
      MainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, "main.html"),
          protocol: "file:",
          slashes: true,
        }),
      );
    }

    // On close listener
    MainWindow.on("closed", () => {
      MainWindow = null;
    });
  });
}

// Entry Point
app.whenReady().then(RunApp);

app.on("window-all-closed", () => setTimeout(() => app.quit(), 3000));

// Notification
ipcMain.on("Notif", (_, { title, body }) =>
  new Notification({ title, body }).show(),
);
