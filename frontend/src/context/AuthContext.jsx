import { createContext, useContext, useState } from "react";
import { loginUser, verifyLoginOtp } from "../api/authApi";

const AuthContext = createContext();

const SESSION_KEYS = {
  user: {
    token: "userToken",
    user: "userUser",
  },
  admin: {
    token: "adminToken",
    user: "adminUser",
  },
};

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    role: user.is_admin ? "admin" : "user",
  };
};

const readSessionUser = (role) => {
  try {
    const saved = localStorage.getItem(SESSION_KEYS[role].user);
    return saved ? normalizeUser(JSON.parse(saved)) : null;
  } catch {
    return null;
  }
};

const getInitialActiveUser = () => {
  const path = window.location.pathname;
  const adminUser = readSessionUser("admin");
  const regularUser = readSessionUser("user");

  if (path.startsWith("/admin")) return adminUser;
  if (path.startsWith("/dashboard")) return regularUser;
  return regularUser || adminUser;
};

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => readSessionUser("admin"));
  const [userUser, setUserUser] = useState(() => readSessionUser("user"));
  const [user, setUser] = useState(() => getInitialActiveUser());

  const saveSession = (token, rawUser) => {
    const normalizedUser = normalizeUser(rawUser);
    const role = normalizedUser.role === "admin" ? "admin" : "user";
    const keys = SESSION_KEYS[role];

    localStorage.setItem(keys.token, token);
    localStorage.setItem(keys.user, JSON.stringify(normalizedUser));
    localStorage.setItem("activeSessionRole", role);

    if (role === "admin") {
      setAdminUser(normalizedUser);
    } else {
      setUserUser(normalizedUser);
    }

    setUser(normalizedUser);
    return normalizedUser;
  };

  const login = async (formData) => {
    const res = await loginUser(formData);

    if (res?.token && res?.user) {
      saveSession(res.token, res.user);
    }

    return res;
  };

  const verifyOtpLogin = async (formData) => {
    const res = await verifyLoginOtp(formData);

    if (res?.token && res?.user) {
      saveSession(res.token, res.user);
    }

    return res;
  };

  const getSessionUser = (role) => (role === "admin" ? adminUser : userUser);

  const getSessionToken = (role) => localStorage.getItem(SESSION_KEYS[role].token);

  const updateSessionUser = (role, updates) => {
    const normalizedRole = role === "admin" ? "admin" : "user";
    const currentUser = normalizedRole === "admin" ? adminUser : userUser;
    if (!currentUser) return null;

    const nextUser = normalizeUser({ ...currentUser, ...updates });
    localStorage.setItem(SESSION_KEYS[normalizedRole].user, JSON.stringify(nextUser));

    if (normalizedRole === "admin") {
      setAdminUser(nextUser);
    } else {
      setUserUser(nextUser);
    }

    if (user?.role === normalizedRole) {
      setUser(nextUser);
    }

    return nextUser;
  };

  const logout = (role = user?.role || localStorage.getItem("activeSessionRole") || "user") => {
    const normalizedRole = role === "admin" ? "admin" : "user";
    const keys = SESSION_KEYS[normalizedRole];

    localStorage.removeItem(keys.token);
    localStorage.removeItem(keys.user);
    localStorage.removeItem("pendingLoginEmail");

    if (normalizedRole === "admin") {
      setAdminUser(null);
    } else {
      setUserUser(null);
    }

    const remainingUser = normalizedRole === "admin" ? userUser : adminUser;
    if (remainingUser) {
      localStorage.setItem("activeSessionRole", remainingUser.role);
      setUser(remainingUser);
    } else {
      localStorage.removeItem("activeSessionRole");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        userUser,
        setUser,
        login,
        verifyOtpLogin,
        logout,
        getSessionUser,
        getSessionToken,
        updateSessionUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
