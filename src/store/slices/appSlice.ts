import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  version: string
  platform: NodeJS.Platform | null
  updateAvailable: boolean
  updateDownloaded: boolean
  updateProgress: number
}

const initialState: AppState = {
  version: '',
  platform: null,
  updateAvailable: false,
  updateDownloaded: false,
  updateProgress: 0
}

export const initializeApp = createAsyncThunk(
  'app/initialize',
  async () => {
    const [version, platform] = await Promise.all([
      window.electronAPI.getVersion(),
      window.electronAPI.getPlatform()
    ])
    return { version, platform }
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUpdateAvailable: (state, action: PayloadAction<boolean>) => {
      state.updateAvailable = action.payload
    },
    setUpdateDownloaded: (state, action: PayloadAction<boolean>) => {
      state.updateDownloaded = action.payload
    },
    setUpdateProgress: (state, action: PayloadAction<number>) => {
      state.updateProgress = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initializeApp.fulfilled, (state, action) => {
      state.version = action.payload.version
      state.platform = action.payload.platform
    })
  }
})

export const { setUpdateAvailable, setUpdateDownloaded, setUpdateProgress } = appSlice.actions
export default appSlice.reducer
