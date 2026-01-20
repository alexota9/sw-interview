import { useState } from 'react'
import Dashboard from './dashboard.jsx'
import Presentation from './Presentation.jsx'
import './App.css'

function App() {
  const [view, setView] = useState('presentation');

  return (
    <>
      <div style={{ display: view === 'dashboard' ? 'block' : 'none' }}>
        <Dashboard />

        {/* Floating Start Presentation Button */}
        <button
          onClick={() => setView('presentation')}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: '#5e2d91',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            zIndex: 200, // Above dashboard header
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>📺</span> Start Presentation
        </button>
      </div>

      {view === 'presentation' && (
        <Presentation onExit={() => setView('dashboard')} />
      )}
    </>
  )
}

export default App
