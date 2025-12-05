import { useEffect } from 'react'
import MainPage from './pages/main'

function App() {
  // Apply dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return <MainPage />
}

export default App


