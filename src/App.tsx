import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks/useRedux'
import {
  // openFile,
  saveFile,
  setContent,
  clearFile
} from './store/slices/fileSlice'
import { initializeApp, setUpdateAvailable, setUpdateDownloaded, setUpdateProgress } from './store/slices/appSlice'
import TestApp from "@/TestApp.tsx";

function App() {
  const dispatch = useAppDispatch()
  const {
    filePath,
    content,
    // isDirty
  } = useAppSelector((state) => state.file)
  // const {
  //   // version,
  //   updateAvailable,
  //   updateDownloaded,
  //   updateProgress
  // } = useAppSelector((state) => state.app)

  useEffect(() => {
    dispatch(initializeApp())

    const unsubscribeFileOpened = window.electronAPI.onFileOpened((data) => {
      dispatch(clearFile())
      dispatch(setContent(data.content))
    })

    const unsubscribeMenuSave = window.electronAPI.onMenuSave(() => {
      handleSave()
    })

    const unsubscribeUpdateAvailable = window.electronAPI.onUpdateAvailable(() => {
      dispatch(setUpdateAvailable(true))
    })

    const unsubscribeUpdateDownloaded = window.electronAPI.onUpdateDownloaded(() => {
      dispatch(setUpdateDownloaded(true))
    })

    const unsubscribeUpdateProgress = window.electronAPI.onUpdateProgress((progress) => {
      dispatch(setUpdateProgress(progress.percent))
    })

    return () => {
      unsubscribeFileOpened()
      unsubscribeMenuSave()
      unsubscribeUpdateAvailable()
      unsubscribeUpdateDownloaded()
      unsubscribeUpdateProgress()
    }
  }, [dispatch])

  // const handleOpen = () => {
  //   dispatch(openFile())
  // }

  const handleSave = () => {
    dispatch(saveFile({ content, defaultPath: filePath || undefined }))
  }

  // const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   dispatch(setContent(e.target.value))
  // }

  return (
    // <div className="app">
    //   <main className="app-main">
        <TestApp />
    //   </main>
    //
    //   {updateAvailable && !updateDownloaded && (
    //     <div className="update-banner">
    //       <span>Update available! Downloading... {updateProgress.toFixed(0)}%</span>
    //     </div>
    //   )}
    //
    //   {updateDownloaded && (
    //     <div className="update-banner success">
    //       <span>Update downloaded. Restart to apply.</span>
    //     </div>
    //   )}
    // </div>
  )
}

export default App
