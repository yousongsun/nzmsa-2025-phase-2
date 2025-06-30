import { Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";

function App() {
	return (
		<Routes>
			<Route path="/" element={<div>Home</div>} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<SignUp />} />
		</Routes>
	);
}

export default App;
