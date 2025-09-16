import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../../contexts/auth";
import * as UsersApi from "../../../services/users-api";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await UsersApi.logout();
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <Link className="navbar-brand" to="/">Family Unit Expenses</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-navbar" aria-controls="main-navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="main-navbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (<li className="nav-item"><NavLink className="nav-link" to="/users">Users</NavLink></li>)}
          </ul>
          <ul className="navbar-nav">
            {!user && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/profile">{user.username}</NavLink></li>
                <li className="nav-item"><button className="nav-link" onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;