import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login as apiLogin, logout as apiLogout } from "../api/auth.js";
import { refreshOnce } from "../api/client.js";
import { clearTokens, getRefreshToken } from "../api/tokens.js";

const userFromToken = (token) => {
  const payload = jwtDecode(token);
  return { id: Number(payload.sub), role: payload.role };
};

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!getRefreshToken()) {
        setInitializing(false);
        return;
      }
      try {
        const token = await refreshOnce();
        setUser(userFromToken(token));
      } catch {
        clearTokens();
      } finally {
        setInitializing(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const token = await apiLogin(email, password);
    setUser(userFromToken(token));
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {initializing ? (
        <div className="app-loading" role="status" aria-label="Loading">
          <span className="spinner" aria-hidden="true" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);