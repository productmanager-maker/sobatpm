export interface Expert {
  id: string;
  name: string;
  email: string;
  roles: ("mengajar" | "menilai")[];
  avatarUrl?: string | null;
}

// Swap this interface implementation to plug in Sekolahmu SSO
export interface AuthProvider {
  login(identifier: string, password: string): Promise<{ token: string; expert: Expert }>;
  logout(): Promise<void>;
  getMe(): Promise<Expert>;
}

// Dummy implementation — accepts any credentials, returns hardcoded expert
export class DummyAuthProvider implements AuthProvider {
  async login(identifier: string, password: string): Promise<{ token: string; expert: Expert }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const { data } = await res.json();
    return data;
  }

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
  }

  async getMe(): Promise<Expert> {
    const res = await fetch("/api/auth/me");
    if (!res.ok) throw new Error("Not authenticated");
    const { data } = await res.json();
    return data.expert;
  }
}

export const authProvider = new DummyAuthProvider();
