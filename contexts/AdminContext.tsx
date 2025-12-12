"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AdminContextType = {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authStatus = localStorage.getItem("pixo-admin-auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    // Password verification happens on the server
    // This function just returns true if the API accepts the password
    // The actual password check is done in /api/admin/send-otp
    try {
      const response = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: otp }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("pixo-admin-auth", "true");
        return true;
      }
      return false;
    } catch (error) {
      console.error("OTP verification error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("pixo-admin-auth");
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, verifyOTP, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}


