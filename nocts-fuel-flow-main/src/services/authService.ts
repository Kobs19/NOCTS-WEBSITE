// Mock authentication service
interface User {
  id: string;
  name: string;
  staffId: string;
  role: string;
}

interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
}

class AuthService {
  private currentUser: User | null = null;

  async login(staffId: string, password: string): Promise<LoginResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation - in real app, this would call backend API
    if (staffId === "STAFF001" && password === "admin123") {
      const user: User = {
        id: "1",
        name: "John Doe",
        staffId: "STAFF001",
        role: "Admin"
      };
      
      this.currentUser = user;
      localStorage.setItem("nocts_user", JSON.stringify(user));
      
      return {
        success: true,
        user
      };
    }

    return {
      success: false,
      message: "Invalid credentials"
    };
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem("nocts_user");
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    const stored = localStorage.getItem("nocts_user");
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();