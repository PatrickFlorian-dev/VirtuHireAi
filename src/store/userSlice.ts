import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
interface User {
  id: number;
  name: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

interface AuthError {
  message: string;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
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
        state.error = (action.payload as AuthError)?.message ?? "An unknown error occurred"; 
      });
  },
});

export const { logout } = userSlice.actions;

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { name: string; password: string }, { rejectWithValue }) => {
    try {

      const token = localStorage.getItem('token');

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      const decodedToken: { exp: number } = jwtDecode<{ exp: number }>(data.token);
      localStorage.setItem("tokenExpiration", (decodedToken.exp * 1000).toString());
      toast.success("Login successful! 🎉");
      return data;
    } catch (error) {
      toast.error(`Failed to login error: ${(error as Error).message}`);
      console.error("Failed to login", error); // TODO: Remove this
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerUser = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string },
  { rejectValue: AuthError }
>("user/register", async (userData, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      return thunkAPI.rejectWithValue({ message: "Registration failed" });
    }

    const data: AuthResponse = await res.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (error: unknown) {
    toast.error(`Failed to register error: ${(error as Error).message}`);
    console.error("Failed to register", error); // TODO: Remove this
    return thunkAPI.rejectWithValue({ message: (error as Error).message });
  }
});

export const refreshTokenAction = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/refresh-token", {
        method: "POST",
        credentials: "include", // Sends HTTP-only cookies with the request
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      return { token: data.accessToken, user: data.user };
    } catch (error: unknown) {
      toast.error(`Failed to refresh error: ${(error as Error).message}`); 
      console.error("Failed to refresh", error); // TODO: Remove this
      return rejectWithValue({ message: (error as Error).message });
    }
  }
);

export default userSlice.reducer;
