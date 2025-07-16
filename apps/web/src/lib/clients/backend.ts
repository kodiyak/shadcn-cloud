function getToken() {
	return localStorage.getItem('auth_token') || undefined;
}

export const backendClient = {
	getToken,
	setToken: (token: string) => {
		localStorage.setItem('auth_token', token);
	},
};
