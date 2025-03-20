// Where to use useAuth.ts?
//  • Inside Navbar.tsx (to show login/logout state)
//  • Inside Profile.tsx (to display user info)

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setUser, logout } from "../store/userSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const login = (userData: { id: number; name: string }) => {
    dispatch(setUser(userData));
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
  };

  return { user, login, logout: handleLogout };
};

export default useAuth;

