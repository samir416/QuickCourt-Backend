import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("qc_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch(err) {
        console.error("Failed to parse user session", err);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("qc_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("qc_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
