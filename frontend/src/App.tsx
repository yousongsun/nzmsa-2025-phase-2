import { Route, Routes } from "react-router";
import Login from "@/pages/Login";

function App() {
	return (
		<Routes>
			<Route path="/" element={<div>Home</div>} />
			<Route path="/login" element={<Login />} />
		</Routes>
	);
}

export default App;
