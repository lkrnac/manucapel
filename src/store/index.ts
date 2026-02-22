import { configureStore } from '@reduxjs/toolkit'
import fileReducer from './slices/fileSlice'
import appReducer from './slices/appSlice'

export const store = configureStore({
  reducer: {
    file: fileReducer,
    app: appReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['file/setContent']
      }
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
