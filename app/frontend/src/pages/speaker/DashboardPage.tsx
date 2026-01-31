/**
 * Speaker Dashboard Page
 *
 * Main dashboard for authenticated speakers.
 * Placeholder for Epic 4 (Presentation CRUD).
 */

import { useAuth } from '@/hooks/useAuth'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const { speaker, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Oratify</h1>
        <div className={styles.userSection}>
          <span className={styles.userName}>{speaker?.name || speaker?.email}</span>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={styles.logoutButton}
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcome}>
          <h2>Welcome, {speaker?.name || 'Speaker'}!</h2>
          <p>Your presentations will appear here once you create them.</p>
        </div>

        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>📊</div>
          <h3>No Presentations Yet</h3>
          <p>Create your first interactive presentation to get started.</p>
          <button className={styles.createButton} disabled>
            Create Presentation (Coming Soon)
          </button>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
