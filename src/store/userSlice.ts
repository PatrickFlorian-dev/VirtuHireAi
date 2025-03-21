import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

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

// ✅ Define Error Type
interface AuthError {
  message: string;
}

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { name: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      toast.success("Login successful! 🎉"); // ✅ Show success notification
      return data;
    } catch (error) {
      toast.error((error as Error).message); // ✅ Show error notification
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
        state.error = (action.payload as AuthError)?.message ?? "An unknown error occurred"; // ✅ Prevents `undefined`
      });
  },
});

export const { logout } = userSlice.actions;

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
      return rejectWithValue({ message: (error as Error).message });
    }
  }
);

export default userSlice.reducer;
