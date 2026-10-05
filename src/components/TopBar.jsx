export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar__crumbs">
        <span>Dashboard</span>
        <span className="topbar__sep" aria-hidden="true">/</span>
        <strong>Post Compliance Audit</strong>
      </div>
      <div className="topbar__right">
        <span className="topbar__brand">RTW Verification</span>
      </div>
    </header>
  )
}
