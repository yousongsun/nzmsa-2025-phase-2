import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
	token: string | null;
	isLoggedIn: boolean;
}

const initialToken = localStorage.getItem("token");
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
