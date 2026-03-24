export const tokenStorage = {
  getAccessToken: () => (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null),
  getRefreshToken: () => (typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  },
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
