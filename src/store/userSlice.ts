import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { UserState } from "../interfaces/userTypes";
import { AuthResponse } from "../interfaces/generalTypes";
import { User } from "../interfaces/userTypes";
import axiosClient from "../api/axiosClient";

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { 
    username: string; password: string; showToast: true;
    successMessage: "Login successful 🎉"; errorMessage: "Failed to login 🚫" }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post<AuthResponse>("/auth/login", credentials);
      const data = response.data;

      const decodedToken: { exp: number } = jwtDecode<{ exp: number }>(data.token);
      localStorage.setItem("tokenExpiration", (decodedToken.exp * 1000).toString());
      localStorage.setItem("token", data.token);
      return data;

    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: User & { showToast: true; successMessage: string; errorMessage: string }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post<AuthResponse>("/auth/register", userData);
      const data = response.data;
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const refreshTokenAction = createAsyncThunk(
  "user/refreshToken",
  async (_: { showToast: true; successMessage: string; errorMessage: string }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post<{ token: string; user: User }>("/auth/refresh-token");
      const data = response.data;
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      // Notice: logout toast is handled in the axios interceptor
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshTokenAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenAction.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(refreshTokenAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
