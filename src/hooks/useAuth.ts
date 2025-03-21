import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshTokenAction, logout } from "../store/userSlice"; // ✅ Import logout
import { AppDispatch, RootState } from "../store/store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [loading, setLoading] = useState(true);

  const refreshToken = useCallback(async () => {
    try {
      await dispatch(refreshTokenAction()).unwrap();
    } catch (error) {
      console.error("Failed to refresh token", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // TODOL add a check for the user object token to prevent unnecessary refreshes
    if (user) {
      refreshToken();
    } else {
      setLoading(false);
    }
  }, [refreshToken, user]);

  const handleLogout = () => {
    dispatch(logout()); 
  };

  return { user, loading, logout: handleLogout };
};
