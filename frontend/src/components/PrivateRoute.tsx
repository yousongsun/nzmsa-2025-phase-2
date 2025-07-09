import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/selector/authSelectors";

const PrivateRoute = () => {
	const isAuthenticated = useAppSelector(selectIsLoggedIn);

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
