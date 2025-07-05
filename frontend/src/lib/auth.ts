export const getCurrentUserId = (): number | null => {
	const token = localStorage.getItem("token");
	if (!token) return null;
	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		const nameId = payload.nameid;
		return nameId ? parseInt(nameId, 10) : null;
	} catch {
		return null;
	}
};
