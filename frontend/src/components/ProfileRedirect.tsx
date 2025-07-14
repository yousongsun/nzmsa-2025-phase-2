import { Navigate } from "react-router-dom";
import { getCurrentUserId } from "@/lib/auth";

const ProfileRedirect = () => {
	const currentUserId = getCurrentUserId();

	if (!currentUserId) {
		// If no user is logged in, redirect to login
		return <Navigate to="/login" replace />;
	}

	// Redirect to the current user's profile
	return <Navigate to={`/profile/${currentUserId}`} replace />;
};

export default ProfileRedirect;
