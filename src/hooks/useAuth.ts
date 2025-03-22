import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshTokenAction, logout } from "../store/userSlice";
import { AppDispatch, RootState } from "../store/store";
import { isTokenExpiring } from "../utils/tokenUtils";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);
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
    if (user && isTokenExpiring()) {
      // refreshToken(); TODO: Uncomment this line + implement token refresh
    } else {
      setLoading(false);
    }
  }, [refreshToken, user, token]);

  const handleLogout = () => {
    dispatch(logout()); 
  };

  return { user, loading, logout: handleLogout };
};
