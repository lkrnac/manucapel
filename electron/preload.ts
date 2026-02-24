import { contextBridge, ipcRenderer } from 'electron'

export interface FileData {
  filePath: string
  content: string
}

export interface SaveResult {
  success: boolean
  filePath?: string
  error?: string
}

export interface ReadResult {
  success: boolean
  content?: string
  error?: string
}

export interface UpdateProgress {
  bytesPerSecond: number
  percent: number
  transferred: number
  total: number
}

export interface UpdateInfo {
  version: string
  releaseDate: string
}

const electronAPI = {
  openFile: (): Promise<FileData | null> => ipcRenderer.invoke('dialog:openFile'),
  openVideoFile: (): Promise<string | null> => ipcRenderer.invoke('dialog:openVideoFile'),
  saveFile: (content: string, defaultPath?: string): Promise<string | null> =>
    ipcRenderer.invoke('dialog:saveFile', { content, defaultPath }),
  saveToPath: (filePath: string, content: string): Promise<SaveResult> =>
    ipcRenderer.invoke('file:save', { filePath, content }),
  readFile: (filePath: string): Promise<ReadResult> =>
    ipcRenderer.invoke('file:read', filePath),

  getVersion: (): Promise<string> => ipcRenderer.invoke('app:getVersion'),
  getPlatform: (): Promise<NodeJS.Platform> => ipcRenderer.invoke('app:getPlatform'),

  openExternal: (url: string): Promise<void> => ipcRenderer.invoke('shell:openExternal', url),

  onFileOpened: (callback: (data: FileData) => void) => {
    const listener = (_: Electron.IpcRendererEvent, data: FileData) => callback(data)
    ipcRenderer.on('file-opened', listener)
    return () => ipcRenderer.removeListener('file-opened', listener)
  },

  onMenuSave: (callback: () => void) => {
    const listener = () => callback()
    ipcRenderer.on('menu-save', listener)
    return () => ipcRenderer.removeListener('menu-save', listener)
  },

  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => {
    const listener = (_: Electron.IpcRendererEvent, info: UpdateInfo) => callback(info)
    ipcRenderer.on('update-available', listener)
    return () => ipcRenderer.removeListener('update-available', listener)
  },

  onUpdateProgress: (callback: (progress: UpdateProgress) => void) => {
    const listener = (_: Electron.IpcRendererEvent, progress: UpdateProgress) => callback(progress)
    ipcRenderer.on('update-progress', listener)
    return () => ipcRenderer.removeListener('update-progress', listener)
  },

  onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => {
    const listener = (_: Electron.IpcRendererEvent, info: UpdateInfo) => callback(info)
    ipcRenderer.on('update-downloaded', listener)
    return () => ipcRenderer.removeListener('update-downloaded', listener)
  },

  onVideoLoadLocal: (callback: (filePath: string) => void) => {
    const listener = (_: Electron.IpcRendererEvent, filePath: string) => callback(filePath)
    ipcRenderer.on('video-load-local', listener)
    return () => ipcRenderer.removeListener('video-load-local', listener)
  },

  onMenuLoadVideoOnline: (callback: () => void) => {
    const listener = () => callback()
    ipcRenderer.on('menu-load-video-online', listener)
    return () => ipcRenderer.removeListener('menu-load-video-online', listener)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
