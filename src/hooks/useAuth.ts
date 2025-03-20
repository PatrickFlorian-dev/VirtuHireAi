// Where to use useAuth.ts?
//  • Inside Navbar.tsx (to show login/logout state)
//  • Inside Profile.tsx (to display user info)

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return { user, login, logout };
};

export default useAuth;
