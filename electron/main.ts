import { app, BrowserWindow, ipcMain, dialog, Menu, shell, protocol } from 'electron'
import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

log.transports.file.level = 'info'
log.transports.console.level = 'debug'

log.info('Application starting...')

autoUpdater.logger = log

let mainWindow: BrowserWindow | null = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// Must be called before app.whenReady()
protocol.registerSchemesAsPrivileged([
  { scheme: 'local-video', privileges: { secure: true, standard: true } }
])

function createWindow() {
  log.info('Creating main window...')

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    show: false,
    backgroundColor: '#ffffff'
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    log.info('Window ready to show')
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  createMenu()
}

function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Load Video File',
          submenu: [
            {
              label: 'Local Video File...',
              click: () => handleLoadVideoFile()
            },
            {
              label: 'Online URL...',
              click: () => mainWindow?.webContents.send('menu-load-video-online')
            }
          ]
        },
        {
          label: 'Save File',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu-save')
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Manucap',
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: 'info',
              title: 'About Manucap',
              message: 'Manucap Desktop',
              detail: `Version: ${app.getVersion()}`
            })
          }
        },
        {
          label: 'Check for Updates',
          click: () => autoUpdater.checkForUpdatesAndNotify()
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

async function handleLoadVideoFile() {
  if (!mainWindow) return

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'mov', 'webm', 'ogv', 'm4v', 'flv', 'wmv'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (!result.canceled && result.filePaths.length > 0) {
    mainWindow.webContents.send('video-load-local', result.filePaths[0])
    log.info('Video file selected:', result.filePaths[0])
  }
}

async function handleOpenFile() {
  if (!mainWindow) return

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Manucap Projects', extensions: ['manucap', 'mcp'] },
      { name: 'JSON', extensions: ['json'] }
    ]
  })

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0]
    try {
      const content = await readFile(filePath, 'utf-8')
      mainWindow.webContents.send('file-opened', { filePath, content })
      log.info('File opened:', filePath)
    } catch (error) {
      log.error('Error reading file:', error)
      dialog.showErrorBox('Error', `Failed to read file: ${error}`)
    }
  }
}

ipcMain.handle('dialog:openFile', async () => {
  if (!mainWindow) return null

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Manucap Projects', extensions: ['manucap', 'mcp'] },
      { name: 'JSON', extensions: ['json'] }
    ]
  })

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0]
    const content = await readFile(filePath, 'utf-8')
    log.info('File opened via IPC:', filePath)
    return { filePath, content }
  }
  return null
})

ipcMain.handle('dialog:openVideoFile', async () => {
  if (!mainWindow) return null

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'mov', 'webm', 'ogv', 'm4v', 'flv', 'wmv'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (!result.canceled && result.filePaths.length > 0) {
    log.info('Video file opened via IPC:', result.filePaths[0])
    return result.filePaths[0]
  }
  return null
})

ipcMain.handle('dialog:saveFile', async (_, { content, defaultPath }) => {
  if (!mainWindow) return null

  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath,
    filters: [
      { name: 'Manucap Projects', extensions: ['manucap'] },
      { name: 'JSON', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (!result.canceled && result.filePath) {
    await writeFile(result.filePath, content, 'utf-8')
    log.info('File saved via IPC:', result.filePath)
    return result.filePath
  }
  return null
})

ipcMain.handle('file:save', async (_, { filePath, content }) => {
  try {
    await writeFile(filePath, content, 'utf-8')
    log.info('File saved:', filePath)
    return { success: true, filePath }
  } catch (error) {
    log.error('Error saving file:', error)
    return { success: false, error: String(error) }
  }
})

ipcMain.handle('file:read', async (_, filePath: string) => {
  try {
    const content = await readFile(filePath, 'utf-8')
    log.info('File read:', filePath)
    return { success: true, content }
  } catch (error) {
    log.error('Error reading file:', error)
    return { success: false, error: String(error) }
  }
})

ipcMain.handle('app:getVersion', () => app.getVersion())

ipcMain.handle('app:getPlatform', () => process.platform)

ipcMain.handle('shell:openExternal', async (_, url: string) => {
  await shell.openExternal(url)
})

process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error)
  dialog.showErrorBox('Unexpected Error', `An unexpected error occurred: ${error.message}`)
  app.exit(1)
})

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled rejection:', reason)
})

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info?.version)
  mainWindow?.webContents.send('update-available', info)
})

autoUpdater.on('update-not-available', () => {
  log.info('Update not available')
})

autoUpdater.on('download-progress', (progress) => {
  log.info('Download progress:', progress.percent)
  mainWindow?.webContents.send('update-progress', progress)
})

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info)
  mainWindow?.webContents.send('update-downloaded', info)
})

autoUpdater.on('error', (error) => {
  log.error('Auto-updater error:', error)
})

app.whenReady().then(() => {
  log.info('App ready')

  // Serve local video files — registerFileProtocol delegates to Chromium's native
  // file handler which correctly handles range requests needed for seeking
  protocol.registerFileProtocol('local-video', (request, callback) => {
    const filePath = decodeURIComponent(request.url.slice('local-video://'.length))
    callback({ path: filePath })
  })

  createWindow()

  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify()
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  log.info('All windows closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  log.info('Application quitting...')
})
