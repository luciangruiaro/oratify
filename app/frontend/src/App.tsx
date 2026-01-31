/**
 * Root Application Component
 *
 * This component sets up:
 * - React Router for navigation
 * - Redux Provider for state management
 * - Auth initialization on mount
 * - Route definitions with protection
 */

import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ResetPasswordPage, ResetPasswordConfirmPage } from '@/pages/auth/ResetPasswordPage'
import { DashboardPage } from '@/pages/speaker/DashboardPage'
import { ComposerPage } from '@/pages/speaker/ComposerPage'
import { PresentationSettingsPage } from '@/pages/speaker/PresentationSettingsPage'

/**
 * App content with routing - must be inside Provider
 */
function AppContent() {
  const { initializeAuth, isAuthenticated, isInitialized } = useAuth()

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              isInitialized && isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/reset-password/confirm" element={<ResetPasswordConfirmPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/presentations/:id/edit"
            element={
              <ProtectedRoute>
                <ComposerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/presentations/:id/settings"
            element={
              <ProtectedRoute>
                <PresentationSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

/**
 * Root App component with Provider wrapper
 */
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
