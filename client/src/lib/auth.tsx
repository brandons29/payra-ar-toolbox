import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import type { User, Session, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Extract OAuth tokens from URL. Supabase implicit grant flow appends tokens
 * to the hash: #access_token=xxx&refresh_token=xxx&...
 * Since we use hash routing (#/path), the tokens could appear as:
 *   - site.com/#access_token=...  (direct)
 *   - site.com/#/login#access_token=... (unlikely but possible)
 * Also check the full href in case tokens ended up in the query string.
 */
function extractOAuthTokens(): { access_token: string; refresh_token: string } | null {
  const fullUrl = window.location.href;

  // Look for access_token anywhere in the URL (hash or query)
  if (!fullUrl.includes("access_token=")) return null;

  // Find the access_token segment and parse from there
  const idx = fullUrl.indexOf("access_token=");
  const tokenString = fullUrl.substring(idx);
  const params = new URLSearchParams(tokenString);

  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (access_token && refresh_token) {
    return { access_token, refresh_token };
  }
  return null;
}

/** Clean tokens out of the URL after we've captured them */
function cleanUrlTokens() {
  // Replace the hash with just the dashboard route
  try {
    window.history.replaceState(null, "", window.location.pathname + "#/dashboard");
  } catch {
    window.location.hash = "/dashboard";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;
    let mounted = true;

    async function initAuth() {
      try {
        // 1. Check for OAuth callback tokens in the URL
        const tokens = extractOAuthTokens();
        if (tokens) {
          const { data, error } = await client.auth.setSession({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          });

          if (!error && data.session && mounted) {
            setSession(data.session);
            setUser(data.session.user);
            cleanUrlTokens();
            setLoading(false);
            return;
          }
          // If setSession failed, fall through to normal flow
          if (error) {
            console.warn("OAuth token session failed:", error.message);
          }
          // Clean URL even on error so we don't loop
          cleanUrlTokens();
        }

        // 2. Check for existing session (in-memory storage)
        const { data: { session: existingSession } } = await client.auth.getSession();
        if (mounted) {
          setSession(existingSession);
          setUser(existingSession?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.warn("Auth init error:", err);
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event, s) => {
        if (mounted) {
          setSession(s);
          setUser(s?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });
  };

  const signInWithMicrosoft = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo: window.location.origin + window.location.pathname,
        scopes: "email profile openid",
      },
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) return { error: { message: "Auth not configured" } as AuthError };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (!supabase) return { error: { message: "Auth not configured" } as AuthError };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error };
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signInWithMicrosoft,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
