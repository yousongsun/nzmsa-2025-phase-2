import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Navigation";
import PrivateRoute from "@/components/PrivateRoute";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import SignUp from "@/pages/SignUp";
import TripDetails from "@/pages/TripDetails";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<SignUp />} />
			<Route element={<PrivateRoute />}>
				<Route element={<Layout />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/trip/:id" element={<TripDetails />} />
					<Route path="/profile/:id" element={<Profile />} />
				</Route>
			</Route>
			<Route path="*" element={<Navigate to="/dashboard" />} />
		</Routes>
	);
}

export default App;
