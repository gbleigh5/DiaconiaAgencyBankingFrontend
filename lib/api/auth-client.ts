import api from "@/lib/api/client";

export class AuthClient {
  login(payload: { username: string; password: string }) {
    return api.post("/auth/login/", payload);
  }
  verifyOtp(payload: { reference: string; code: string }) {
    return api.post("/auth/verify-otp/", payload);
  }
  me() {
    return api.get("/auth/me/");
  }
}

export const authClient = new AuthClient();
