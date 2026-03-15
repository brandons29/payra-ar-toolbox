import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PayraLogoFull } from "@/components/PayraLogo";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PAYRA_DEMO_URL } from "@/lib/constants";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { BlueprintGrid } from "@/components/ConstructionPatterns";
import { Loader2, Calendar } from "lucide-react";
import { SiGoogle } from "react-icons/si";

// Inline Microsoft logo – not available in react-icons/si
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 21" className={className} fill="none">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

export default function Login() {
  const { signInWithGoogle, signInWithMicrosoft, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "microsoft" | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (mode === "signup") {
      if (!fullName.trim()) {
        setError("Please enter your name");
        setSubmitting(false);
        return;
      }
      const { error: err } = await signUpWithEmail(email, password, fullName);
      if (err) {
        setError(err.message);
      } else {
        setSignupSuccess(true);
      }
    } else {
      const { error: err } = await signInWithEmail(email, password);
      if (err) setError(err.message);
    }
    setSubmitting(false);
  };

  const handleGoogle = async () => {
    setOauthLoading("google");
    await signInWithGoogle();
  };

  const handleMicrosoft = async () => {
    setOauthLoading("microsoft");
    await signInWithMicrosoft();
  };

  // If Supabase isn't configured, show setup instructions
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
        <BlueprintGrid />
        <Card className="w-full max-w-md p-6 space-y-4 relative z-10">
          <div className="text-center space-y-2">
            <PayraLogoFull />
            <p className="text-sm text-muted-foreground mt-4">
              Supabase is not configured yet. Add these environment variables to enable authentication:
            </p>
          </div>
          <div className="bg-muted rounded-md p-3 text-xs font-mono space-y-1">
            <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
            <p>VITE_SUPABASE_ANON_KEY=eyJ...</p>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            See the Supabase Setup Guide for full instructions.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <BlueprintGrid />
      <div className="w-full max-w-md space-y-4 relative z-10">
        <Card className="p-6 space-y-5">
          {/* Logo */}
          <div className="text-center space-y-1">
            <div className="flex justify-center">
              <PayraLogoFull />
            </div>
            <p className="text-sm text-muted-foreground">
              Free AR diagnostic tools for your business
            </p>
          </div>

          {signupSuccess && (
            <div className="bg-primary/10 border border-primary/20 rounded-md p-3 text-sm text-center text-primary">
              Check your email for a confirmation link, then sign in.
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleGoogle}
              disabled={!!oauthLoading}
              data-testid="button-google-login"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SiGoogle className="h-4 w-4" />
              )}
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleMicrosoft}
              disabled={!!oauthLoading}
              data-testid="button-microsoft-login"
            >
              {oauthLoading === "microsoft" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MicrosoftIcon className="h-4 w-4" />
              )}
              Continue with Microsoft
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === "signup" && (
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Smith"
                  className="text-sm"
                  data-testid="input-full-name"
                />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="text-sm"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="text-sm"
                data-testid="input-password"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive" data-testid="text-auth-error">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={submitting} data-testid="button-email-submit">
              {submitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              {mode === "signup" ? "Create Account" : "Sign In"}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="text-xs text-center text-muted-foreground">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => { setMode("signup"); setError(""); }} className="text-primary font-medium" data-testid="button-toggle-signup">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-primary font-medium" data-testid="button-toggle-login">
                  Sign in
                </button>
              </>
            )}
          </p>
        </Card>

        {/* Demo CTA below login */}
        <Card className="p-4 text-center space-y-2 bg-primary/5 border-primary/15">
          <p className="text-sm text-muted-foreground">
            Want to see Payra in action first?
          </p>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <a
              href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=login&utm_campaign=pre-signup`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar className="h-3.5 w-3.5" />
              Schedule a Demo
            </a>
          </Button>
        </Card>

        <div className="flex justify-center">
          <PerplexityAttribution />
        </div>
      </div>
    </div>
  );
}
