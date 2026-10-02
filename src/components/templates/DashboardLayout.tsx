import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  actions?: ReactNode
  aside: ReactNode
  children: ReactNode
}

function DashboardLayout({ title, subtitle, actions, aside, children }: Props) {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__brand">
          <h1 className="dashboard__title">{title}</h1>
          {subtitle && <p className="dashboard__subtitle">{subtitle}</p>}
        </div>
        {actions}
      </header>

      <main className="dashboard__main">
        <aside className="dashboard__aside">{aside}</aside>
        <div className="dashboard__content">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout
