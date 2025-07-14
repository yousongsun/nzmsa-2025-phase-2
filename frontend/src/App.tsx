import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Navigation";
import PrivateRoute from "@/components/PrivateRoute";
import ProfileRedirect from "@/components/ProfileRedirect";
import Dashboard from "@/pages/Dashboard";
import Following from "@/pages/Following";
import Login from "@/pages/Login";
import Posts from "@/pages/Posts";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
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
					<Route path="/posts" element={<Posts />} />
					<Route path="/trip/:id" element={<TripDetails />} />
					<Route path="/profile" element={<ProfileRedirect />} />
					<Route path="/profile/:id" element={<Profile />} />
					<Route path="/following" element={<Following />} />
					<Route path="/settings" element={<Settings />} />
				</Route>
			</Route>
			<Route path="*" element={<Navigate to="/dashboard" />} />
		</Routes>
	);
}

export default App;
