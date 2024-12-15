import React, { createContext, useEffect, useState } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage when the component mounts
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // If user data is found in localStorage, set the user state
    if (name && role && token) {
      setUser({
        name,
        role,
        token,
      });
    }
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const login = (userData) => {
    // Set the user data in state and localStorage upon login
    setUser(userData);
    localStorage.setItem("name", userData.name);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    // Remove user data from localStorage and clear the user state upon logout
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
