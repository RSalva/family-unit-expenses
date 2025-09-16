import { Navigate } from "react-router";
import { useAuth } from "../contexts/auth";

export function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (role && user) {
    if (user.role === role) {
      return children;
    } else {
      return <Navigate to="/forbidden" />;
    }  
  } else if (user) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;