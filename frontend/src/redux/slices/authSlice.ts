import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { isTokenValid } from "@/lib/auth";

export interface AuthState {
	token: string | null;
	isLoggedIn: boolean;
}

const initialToken = isTokenValid() ? localStorage.getItem("token") : null;
const initialState: AuthState = {
	token: initialToken,
	isLoggedIn: !!initialToken,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginSuccess: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
			state.isLoggedIn = true;
			localStorage.setItem("token", action.payload);
		},
		logout: (state) => {
			state.token = null;
			state.isLoggedIn = false;
			localStorage.removeItem("token");
		},
	},
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
