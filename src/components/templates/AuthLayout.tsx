import type { ReactNode } from 'react'

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-layout">
      <div className="auth-layout__card">{children}</div>
    </main>
  )
}

export default AuthLayout
