import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface FileState {
  filePath: string | null
  content: string
  isDirty: boolean
  isLoading: boolean
  error: string | null
}

const initialState: FileState = {
  filePath: null,
  content: '',
  isDirty: false,
  isLoading: false,
  error: null
}

export const openFile = createAsyncThunk(
  'file/open',
  async () => {
    const result = await window.electronAPI.openFile()
    return result
  }
)

export const saveFile = createAsyncThunk(
  'file/save',
  async ({ content, defaultPath }: { content: string; defaultPath?: string }) => {
    const filePath = await window.electronAPI.saveFile(content, defaultPath)
    return filePath
  }
)

export const saveToPath = createAsyncThunk(
  'file/saveToPath',
  async ({ filePath, content }: { filePath: string; content: string }) => {
    const result = await window.electronAPI.saveToPath(filePath, content)
    return result
  }
)

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload
      state.isDirty = true
    },
    setFilePath: (state, action: PayloadAction<string | null>) => {
      state.filePath = action.payload
    },
    clearFile: (state) => {
      state.filePath = null
      state.content = ''
      state.isDirty = false
      state.error = null
    },
    markSaved: (state) => {
      state.isDirty = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(openFile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(openFile.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.filePath = action.payload.filePath
          state.content = action.payload.content
          state.isDirty = false
        }
      })
      .addCase(openFile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to open file'
      })
      .addCase(saveFile.fulfilled, (state, action) => {
        if (action.payload) {
          state.filePath = action.payload
          state.isDirty = false
        }
      })
      .addCase(saveToPath.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isDirty = false
        } else {
          state.error = action.payload.error || 'Failed to save file'
        }
      })
  }
})

export const { setContent, setFilePath, clearFile, markSaved } = fileSlice.actions
export default fileSlice.reducer
