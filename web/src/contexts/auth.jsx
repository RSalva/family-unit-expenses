import { createContext, useState, useContext } from "react";

export const LS_USER = 'current-user';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem(LS_USER) ? 
      JSON.parse(localStorage.getItem(LS_USER)) : 
      null
  );

  const login = (user) => {
    localStorage.setItem(LS_USER, JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear(LS_USER);
  };

  const isAdmin = user?.role === "admin";

  const value = {
    user,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}