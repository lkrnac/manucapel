import { configureStore } from '@reduxjs/toolkit'
import fileReducer from './slices/fileSlice'
import appReducer from './slices/appSlice'
import { Reducers as manuCapReducers } from 'manucap'

export const store = configureStore({
  reducer: {
    file: fileReducer,
    app: appReducer,
    ...manuCapReducers
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
