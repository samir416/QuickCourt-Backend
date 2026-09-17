import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("qc_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const normalized = {
          ...parsed,
          id: parsed.userId || parsed.id,
          userId: parsed.userId || parsed.id
        };
        setUser(normalized);
      } catch(err) {
        console.error("Failed to parse user session", err);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const normalizedUser = {
      ...userData,
      id: userData.userId || userData.id,
      userId: userData.userId || userData.id
    };
    setUser(normalizedUser);
    localStorage.setItem("qc_user", JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("qc_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
