export const isTokenValid = (): boolean => {
	const token = localStorage.getItem("token");
	if (!token) return false;

	try {
		// JWT tokens have 3 parts separated by dots
		const parts = token.split(".");
		if (parts.length !== 3) return false;

		const payload = JSON.parse(atob(parts[1]));

		// Check if token has expired
		if (payload.exp && Date.now() >= payload.exp * 1000) {
			return false;
		}

		return true;
	} catch (error) {
		console.error("Error validating token:", error);
		return false;
	}
};

export const getCurrentUserId = (): number | null => {
	const token = localStorage.getItem("token");
	if (!token || !isTokenValid()) return null;

	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;

		const payload = JSON.parse(atob(parts[1]));

		// Try different claim names for user ID
		const userId =
			payload.nameid ||
			payload.userid ||
			payload.user_id ||
			payload[
				"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
			];

		if (userId) {
			const parsedId = parseInt(userId, 10);
			return Number.isNaN(parsedId) ? null : parsedId;
		}

		return null;
	} catch (error) {
		console.error("Error parsing token:", error);
		return null;
	}
};

export const getCurrentUserEmail = (): string | null => {
	const token = localStorage.getItem("token");
	if (!token || !isTokenValid()) return null;

	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;

		const payload = JSON.parse(atob(parts[1]));

		// Try different claim names for email
		return (
			payload.email ||
			payload.sub ||
			payload[
				"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
			] ||
			null
		);
	} catch (error) {
		console.error("Error parsing token for email:", error);
		return null;
	}
};

export const getTokenPayload = (): any => {
	const token = localStorage.getItem("token");
	if (!token || !isTokenValid()) return null;

	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;

		return JSON.parse(atob(parts[1]));
	} catch (error) {
		console.error("Error parsing token payload:", error);
		return null;
	}
};
