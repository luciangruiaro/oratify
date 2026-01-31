/**
 * Root Application Component
 *
 * This component sets up:
 * - React Router for navigation
 * - Main application layout
 * - Route definitions
 *
 * Routes will be added progressively as pages are implemented.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <main className="main-content">
                <h1>Oratify</h1>
                <p>AI-powered interactive presentations</p>
              </main>
            }
          />
          {/* Routes will be added as pages are implemented */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
