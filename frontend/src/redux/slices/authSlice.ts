import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { isTokenValid } from "@/lib/auth";
import type { User } from "@/models/user";

export interface AuthState {
	token: string | null;
	isLoggedIn: boolean;
	user: User | null;
	isAuthenticated: boolean;
}

const initialToken = isTokenValid() ? localStorage.getItem("token") : null;
const initialState: AuthState = {
	token: initialToken,
	isLoggedIn: !!initialToken,
	user: null,
	isAuthenticated: !!initialToken,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginSuccess: (
			state,
			action: PayloadAction<{ token: string; user: User }>,
		) => {
			state.token = action.payload.token;
			state.user = action.payload.user;
			state.isLoggedIn = true;
			state.isAuthenticated = true;
			localStorage.setItem("token", action.payload.token);
		},
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		logout: (state) => {
			state.token = null;
			state.user = null;
			state.isLoggedIn = false;
			state.isAuthenticated = false;
			localStorage.removeItem("token");
		},
	},
});

export const { loginSuccess, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
