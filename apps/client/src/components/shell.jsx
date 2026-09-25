import React from 'react';
import { Link } from 'react-router-dom';

const NAV = [
  { to: '/', key: 'dashboard', label: 'Dashboard', index: '01' },
  { to: '/workflows', key: 'workflows', label: 'Workflows', index: '02' },
  { to: '/builder', key: 'builder', label: 'Builder', index: '03' },
  { to: '/logs', key: 'logs', label: 'Logs', index: '04' },
  { to: '/projects', key: 'projects', label: 'Projects', index: '05' },
  { to: '/settings', key: 'settings', label: 'Settings', index: '06' },
  { to: '/account', key: 'account', label: 'Account', index: '07' },
];

const HAIRLINE = '1px solid rgba(255,255,255,0.08)';

export function Sidebar({ active, mobileOpen, onClose, onNavigate }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[232px] bg-coal flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static shrink-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ borderRight: HAIRLINE }}
    >
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-[13px] font-bold"
            style={{ background: '#84A98C', color: '#1C1917' }}
          >
            E
          </div>
          <div>
            <p className="text-[13px] font-bold tracking-tight leading-none text-cream">Engine Core</p>
            <p className="text-[10px] font-medium text-smoke mt-1 tracking-wide font-mono">v2.4.0</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-[13px] font-medium text-sand hover:text-cream px-2 py-1">
          Close
        </button>
      </div>

      <nav className="px-3 mt-6 space-y-[2px]">
        <p className="label-caps px-2 mb-2">Workspace</p>
        {NAV.map((item) => {
          const isActive = active === item.key;
          return (
            <Link
              key={item.key}
              to={item.to}
              onClick={onNavigate}
              className="flex items-baseline gap-3 px-2 py-[7px] rounded-md text-[13px] transition-colors"
              style={
                isActive
                  ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F1EA', fontWeight: 600 }
                  : { border: '1px solid transparent', color: '#A8A29E', fontWeight: 500 }
              }
            >
              <span className="font-mono text-[10px] opacity-60">{item.index}</span>
              <span>{item.label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sage" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 py-5" style={{ borderTop: HAIRLINE }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-[11px] font-semibold text-cream"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
          >
            AR
          </div>
          <div>
            <p className="text-[12px] font-semibold leading-none text-cream">A. Rivero</p>
            <p className="text-[10px] text-smoke mt-1">Admin</p>
          </div>
        </div>
        <p className="text-[10px] text-smoke mt-4 font-mono">Operational — 99.9%</p>
      </div>
    </aside>
  );
}

export function Topbar({ title, meta, children, onMenu }) {
  return (
    <header
      className="h-[60px] bg-coal/90 backdrop-blur px-5 lg:px-8 flex items-center gap-4 sticky top-0 z-20"
      style={{ borderBottom: HAIRLINE }}
    >
      <button onClick={onMenu} className="lg:hidden text-[13px] font-medium text-sand">
        Menu
      </button>
      <div className="min-w-0">
        <h1 className="text-[15px] font-bold tracking-tight leading-none truncate text-cream">{title}</h1>
        {meta && <p className="text-[11px] text-sand mt-1 truncate">{meta}</p>}
      </div>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </header>
  );
}

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder || 'Search'}
      className="field !w-[220px] hidden sm:block"
    />
  );
}

export function SlidePanel({ open, title, meta, onClose, children, footer, wide }) {
  return (
    <div
      className={`fixed inset-y-0 right-0 bg-panel z-[150] flex flex-col transition-transform duration-200 ${
        open ? 'translate-x-0' : 'translate-x-full'
      } ${wide ? 'w-[420px]' : 'w-[340px]'}`}
      style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="px-5 py-4 flex items-start justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="min-w-0">
          <h3 className="text-[13px] font-bold tracking-tight text-cream">{title}</h3>
          {meta && <p className="text-[11px] text-smoke mt-1 font-mono truncate">{meta}</p>}
        </div>
        <button onClick={onClose} className="text-[12px] font-medium text-sand hover:text-cream px-2 py-1 shrink-0">
          Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">{children}</div>
      {footer && (
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}

export function StatusDot({ tone = 'idle' }) {
  const map = { active: '#84A98C', error: '#C96A5E', idle: '#78716C', warm: '#D4A373' };
  return <span className="inline-block w-[7px] h-[7px] rounded-full shrink-0" style={{ background: map[tone] || map.idle }} />;
}

export function Page({ active, title, meta, actions, search, children, mobileOpen, setMobileOpen }) {
  return (
    <div className="flex min-h-screen bg-base text-cream">
      <Sidebar active={active} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} meta={meta} onMenu={() => setMobileOpen(!mobileOpen)}>
          {search}
          {actions}
        </Topbar>
        <div className="flex-1 px-5 lg:px-8 py-6 max-w-6xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
