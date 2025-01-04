import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CassettePlayer from './components/CassettePlayer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Obliger</h1>
      <CassettePlayer />
    </>
  )
}

export default App
