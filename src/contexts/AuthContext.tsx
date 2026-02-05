import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { shouldUseMockData, MOCK_PROFILE } from "@/lib/mock-data";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInAnonymously: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Offline/dev mode: bypass Supabase auth entirely.
    // IMPORTANT: Don't auto-authenticate by default.
    // This keeps login/protected-route E2E tests meaningful even in mock mode.
    // To opt into auto-login (for local demos / offline flows), set:
    //   VITE_MOCK_AUTOLOGIN=true
    if (shouldUseMockData()) {
      const autoLogin = (import.meta.env.VITE_MOCK_AUTOLOGIN ?? "false").toLowerCase() === "true";

      if (autoLogin) {
        const mockUser = {
          id: MOCK_PROFILE.id,
          email: MOCK_PROFILE.email,
          created_at: MOCK_PROFILE.created_at,
          // Minimal fields used by the app/tests
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
          role: "authenticated",
        } as unknown as User;

        setUser(mockUser);
        setSession(null);
      } else {
        setUser(null);
        setSession(null);
      }

      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (shouldUseMockData()) {
      const acceptAny = (import.meta.env.VITE_MOCK_AUTH_ACCEPT_ANY ?? "false").toLowerCase() === "true";

      // Default behavior in mock mode is *strict*: only a known credential works.
      // This keeps E2E tests (invalid credentials) meaningful.
      const isValid = acceptAny || (email === MOCK_PROFILE.email && password === "password123");

      if (!isValid) {
        return {
          error: {
            name: "AuthApiError",
            message: "Invalid login credentials",
            status: 400,
          } as unknown as AuthError,
        };
      }

      const mockUser = {
        id: MOCK_PROFILE.id,
        email,
        created_at: MOCK_PROFILE.created_at,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        role: "authenticated",
      } as unknown as User;
      setUser(mockUser);
      setSession(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (shouldUseMockData()) {
      const mockUser = {
        id: MOCK_PROFILE.id,
        email,
        created_at: MOCK_PROFILE.created_at,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        role: "authenticated",
      } as unknown as User;
      setUser(mockUser);
      setSession(null);
      return { error: null, autoLoggedIn: true } as any;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    // If signup succeeded and user has a session, they're auto-confirmed
    if (!error && data.session) {
      // User is auto-logged in (email confirmation disabled)
      return { error: null, autoLoggedIn: true };
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    if (shouldUseMockData()) {
      const mockUser = {
        id: MOCK_PROFILE.id,
        email: MOCK_PROFILE.email,
        created_at: MOCK_PROFILE.created_at,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        role: "authenticated",
      } as unknown as User;
      setUser(mockUser);
      setSession(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error };
  };

  const signInAnonymously = async () => {
    if (shouldUseMockData()) {
      const mockUser = {
        id: MOCK_PROFILE.id,
        email: MOCK_PROFILE.email,
        created_at: MOCK_PROFILE.created_at,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        role: "authenticated",
      } as unknown as User;
      setUser(mockUser);
      setSession(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signInAnonymously();
    return { error };
  };

  const signOut = async () => {
    if (shouldUseMockData()) {
      setUser(null);
      setSession(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInAnonymously,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
