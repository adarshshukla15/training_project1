export default function Header({ title, userName, onMenuClick }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-button menu-toggle"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <div>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="profile">
        <span className="avatar">{userName.slice(0, 2).toUpperCase()}</span>
        <div className="profile-copy">
          <div className="profile-name">{userName}</div>
          <div className="profile-role">Manager</div>
        </div>
      </div>
    </header>
  )
}
