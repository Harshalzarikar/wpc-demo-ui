import { cx } from '../utils.js'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">WPC</span>
        <div className="sidebar__brandText">
          <strong>WPC AI</strong>
          <span>Post Compliance</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        <a className="sidebar__link" href="#dashboard">
          <span className="sidebar__icon" aria-hidden="true">▦</span>
          Dashboard
        </a>
        <a className="sidebar__link" href="#past-audits">
          <span className="sidebar__icon" aria-hidden="true">🗂</span>
          Past Audits
        </a>
        <button type="button" className="sidebar__newBtn">
          <span aria-hidden="true">＋</span> New Audit
        </button>
      </nav>

      <div className="sidebar__section">
        <p className="sidebar__sectionLabel">Verification</p>

        <button type="button" className="sidebar__newCheck">
          <span aria-hidden="true">＋</span> New Check
        </button>

        <div className="sidebar__records">
          <span className="sidebar__recordsLabel">All Records</span>
          <div className="sidebar__badges">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={cx('sidebar__badge', n === 1 && 'is-active')}>
                {n}
              </span>
            ))}
          </div>
        </div>

        <a className="sidebar__link is-active" href="#post-compliance">
          <span className="sidebar__icon" aria-hidden="true">◧</span>
          Post Compliance
        </a>
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <span className="sidebar__avatar">A</span>
          <span>Akshat</span>
        </div>
        <button type="button" className="sidebar__signout">
          Sign Out
        </button>
      </div>
    </aside>
  )
}
