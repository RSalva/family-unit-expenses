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
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="fa fa-piggy-bank me-2"></i> Family Unit Expenses
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#main-navbar" 
          aria-controls="main-navbar" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="main-navbar">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                {/* Users control */}
                {isAdmin && (
                  <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    <i className="fa fa-user-circle me-1"></i> Users control
                  </Link>
                  </li>
                )}
                

                {/* Units Link */}
                <li className="nav-item">
                  <Link className="nav-link" to="/units">
                    <i className="fa fa-home me-1"></i> Units
                  </Link>
                </li>

                {/* Profile Dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user-circle me-1"></i> {user.name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="fa fa-user me-2"></i> Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="fa fa-sign-out-alt me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                {/* Login Link */}
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fa fa-sign-in-alt me-1"></i> Log In
                  </Link>
                </li>

                {/* Register Link */}
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="fa fa-user-plus me-1"></i> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;