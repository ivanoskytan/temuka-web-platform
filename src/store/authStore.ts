import { create } from 'zustand';
import { loginUser, registerUser } from '../services/authService';
import { jwtDecode, JwtPayload } from "jwt-decode"

interface User {
  email: string;
  token: string;
  id: number | undefined;
}

interface JwtCustomPayload extends JwtPayload {
  id: number;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  login: (payload: any) => Promise<void>;
  logout: () => void;
  register: (payload: any) => Promise<void>;
}


const useAuthStore = create<AuthState>((set) => {

    const token = localStorage.getItem("token");
    let initialUser: User | null = null;
    let initialIsLoggedIn = false;

    if (token) {
      try {
        const decodedToken =jwtDecode<JwtCustomPayload>(token);
        initialUser = { email: decodedToken.email, token, id: decodedToken.id };
        initialIsLoggedIn = true;
      } catch(err) {
        console.log("Error decoding token", err);
        localStorage.removeItem("token");
      }
    }

    return {
      user: initialUser,
      loading: false,
      error: null,
      isLoggedIn: initialIsLoggedIn,
    
      login: async (payload: any) => {
        set({ loading: true, error: null });
        try {
          const response = await loginUser(payload);
          const { token } = response;
          const decodedToken = jwtDecode<JwtCustomPayload>(token);
          set({ user: { email: payload.email, token, id: decodedToken.id }, loading: false, isLoggedIn: true });
          localStorage.setItem('token', token);
        } catch (error: any) {
          set({ loading: false, error: error.message });
        }
      },
    
      logout: () => {
        set({ user: null, isLoggedIn: false });
        localStorage.removeItem('token');
      },
    
      register: async (payload: any) => {
        set({ loading: true, error: null });
        try {
          const response = await registerUser(payload);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
          }
          set({ loading: false });
        } catch (error: any) {
          set({ loading: false, error: error.message });
        }
      },

    }

  
  });
  
  export default useAuthStore;

