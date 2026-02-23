/// <reference types="vite/client" />

interface FileData {
  filePath: string
  content: string
}

interface UpdateProgress {
  bytesPerSecond: number
  percent: number
  transferred: number
  total: number
}

interface UpdateInfo {
  version: string
  releaseDate: string
}

interface SaveResult {
  success: boolean
  filePath?: string
  error?: string
}

interface ReadResult {
  success: boolean
  content?: string
  error?: string
}

interface ElectronAPI {
  openFile(): Promise<FileData | null>
  saveFile(content: string, defaultPath?: string): Promise<string | null>
  saveToPath(filePath: string, content: string): Promise<SaveResult>
  readFile(filePath: string): Promise<ReadResult>
  getVersion(): Promise<string>
  getPlatform(): Promise<NodeJS.Platform>
  openExternal(url: string): Promise<void>
  onFileOpened(callback: (data: FileData) => void): () => void
  onMenuSave(callback: () => void): () => void
  onUpdateAvailable(callback: (info: UpdateInfo) => void): () => void
  onUpdateProgress(callback: (progress: UpdateProgress) => void): () => void
  onUpdateDownloaded(callback: (info: UpdateInfo) => void): () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
