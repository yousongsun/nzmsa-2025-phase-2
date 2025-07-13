export const isTokenValid = (): boolean => {
	const token = localStorage.getItem("token");
	if (!token) return false;
	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		if (payload.exp && Date.now() >= payload.exp * 1000) {
			return false;
		}
		return true;
	} catch {
		return false;
	}
};

export const getCurrentUserId = (): number | null => {
	const token = isTokenValid() ? localStorage.getItem("token") : null;
	if (!token) return null;
	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		const nameId = payload.nameid;
		return nameId ? parseInt(nameId, 10) : null;
	} catch {
		return null;
	}
};
