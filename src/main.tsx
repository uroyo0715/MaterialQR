import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './app/App.tsx'
import { CameraProvider } from './context/CameraContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* アプリ全体でカメラ情報を共有できるようにラップする */}
    <CameraProvider>
      <App />
    </CameraProvider>
  </StrictMode>,
)