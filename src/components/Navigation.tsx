import { NavLink } from 'react-router-dom'
import { Brain, LayoutDashboard, CheckSquare, PenSquare } from 'lucide-react'

export function Navigation() {
  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Task Manager', to: '/tasks', icon: CheckSquare },
    { label: 'Study Canvas', to: '/canvas', icon: PenSquare }
  ]

  return (
    <nav className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-xl font-bold text-[var(--text-primary)]">
          <Brain className="w-7 h-7 text-[var(--color-primary)]" />
          Proactive AI Workspace
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1 rounded-full px-4 py-2 transition ${isActive ? 'bg-[var(--color-primary)] text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
