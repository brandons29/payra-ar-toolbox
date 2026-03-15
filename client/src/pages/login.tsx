import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PayraLogoFull } from "@/components/PayraLogo";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PAYRA_DEMO_URL } from "@/lib/constants";
import { BlueprintGrid } from "@/components/ConstructionPatterns";
import { Loader2, ExternalLink, Shield, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Link } from "wouter";

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

type AuthMode = "login" | "signup" | "forgot";

export default function Login() {
  const { signInWithGoogle, signInWithMicrosoft, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "microsoft" | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Check URL for ?mode=signup
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("mode=signup")) {
      setMode("signup");
    }
  }, []);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError("");
    setResetSent(false);
    setSignupSuccess(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (mode === "forgot") {
      if (!email.trim()) {
        setError("Please enter your email address");
        setSubmitting(false);
        return;
      }
      const { error: err } = await resetPassword(email);
      if (err) {
        setError(err.message);
      } else {
        setResetSent(true);
      }
      setSubmitting(false);
      return;
    }

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
        <Card className="w-full max-w-md p-8 space-y-5 relative z-10">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <PayraLogoFull />
            </div>
            <p className="text-sm text-muted-foreground">
              Supabase is not configured. Add these environment variables to enable authentication:
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-xs font-mono space-y-1 border border-border/50">
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

  const headings: Record<AuthMode, { title: string; subtitle: string }> = {
    login: {
      title: "Welcome back",
      subtitle: "Sign in to continue your AR diagnostic",
    },
    signup: {
      title: "Start your free AR audit",
      subtitle: "7 diagnostic tools. Real dollar figures. No credit card required.",
    },
    forgot: {
      title: "Reset your password",
      subtitle: "We'll send a reset link to your inbox",
    },
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      <BlueprintGrid />

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative bg-gradient-to-br from-primary/5 via-background to-background items-center justify-center p-12">
        <div className="max-w-md space-y-8 relative z-10">
          <PayraLogoFull className="mb-8" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Find the cash stuck in your receivables
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Built for AR leaders at construction, distribution, and industrial companies.
            Benchmark your DSO, quantify trapped cash, and get a clear action plan — all free.
          </p>
          <div className="space-y-3 pt-4">
            {[
              "Full audit in under 10 minutes",
              "Construction, distribution & industrial benchmarks",
              "Prioritized action plan with real dollar figures",
              "No credit card — no sales pitch",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Mobile logo */}
          <div className="flex justify-center lg:hidden mb-2">
            <Link href="/">
              <PayraLogoFull />
            </Link>
          </div>

          {/* Back to landing */}
          <div className="hidden lg:block">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1" data-testid="link-back-home">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>
          </div>

          <Card className="p-7 sm:p-8 space-y-6">
            {/* Heading */}
            <div className="space-y-1.5">
              <h1 className="text-lg font-bold tracking-tight" data-testid="text-auth-heading">
                {headings[mode].title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {headings[mode].subtitle}
              </p>
            </div>

            {/* Success banners */}
            {signupSuccess && (
              <div className="bg-primary/8 border border-primary/15 rounded-lg p-3.5 text-sm text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary font-medium">
                  <Mail className="h-4 w-4" />
                  Check your email
                </div>
                <p className="text-xs text-muted-foreground">
                  We sent a confirmation link. Click it, then sign in.
                </p>
              </div>
            )}

            {resetSent && (
              <div className="bg-primary/8 border border-primary/15 rounded-lg p-3.5 text-sm text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary font-medium">
                  <Mail className="h-4 w-4" />
                  Reset link sent
                </div>
                <p className="text-xs text-muted-foreground">
                  Check your inbox for a password reset link.
                </p>
              </div>
            )}

            {/* OAuth Buttons — only for login/signup */}
            {mode !== "forgot" && (
              <>
                <div className="space-y-2.5">
                  <Button
                    variant="outline"
                    className="w-full gap-2.5 h-11"
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
                    className="w-full gap-2.5 h-11"
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
                  <span className="text-xs text-muted-foreground font-medium">or</span>
                  <Separator className="flex-1" />
                </div>
              </>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Smith"
                    className="h-11"
                    data-testid="input-full-name"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="h-11"
                  data-testid="input-email"
                />
              </div>
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-xs text-primary hover:underline font-medium"
                        data-testid="link-forgot-password"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="h-11"
                    data-testid="input-password"
                  />
                </div>
              )}

              {error && (
                <p className="text-xs text-destructive" data-testid="text-auth-error">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full h-11"
                disabled={submitting || (mode === "forgot" && resetSent)}
                data-testid="button-email-submit"
              >
                {submitting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                {mode === "signup" ? "Start My Free Audit" : mode === "forgot" ? (resetSent ? "Link Sent" : "Send Reset Link") : "Sign In"}
              </Button>
            </form>

            {/* Mode toggles */}
            <div className="text-xs text-center text-muted-foreground space-y-2">
              {mode === "login" && (
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => switchMode("signup")} className="text-primary font-medium hover:underline" data-testid="button-toggle-signup">
                    Create a free account
                  </button>
                </p>
              )}
              {mode === "signup" && (
                <p>
                  Already have an account?{" "}
                  <button onClick={() => switchMode("login")} className="text-primary font-medium hover:underline" data-testid="button-toggle-login">
                    Sign in
                  </button>
                </p>
              )}
              {mode === "forgot" && (
                <p>
                  <button onClick={() => switchMode("login")} className="text-primary font-medium hover:underline inline-flex items-center gap-1" data-testid="button-back-to-login">
                    <ArrowLeft className="h-3 w-3" /> Back to sign in
                  </button>
                </p>
              )}
            </div>
          </Card>

          {/* Demo CTA below login */}
          {mode !== "forgot" && (
            <Card className="p-4 flex items-center gap-3 border-primary/10 bg-primary/[0.03]">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground/80">
                  Prefer a guided walkthrough?
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  A Payra AR specialist can review your numbers with you.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0">
                <a
                  href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=login&utm_campaign=pre-signup`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Talk to an Expert
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </Button>
            </Card>
          )}

          {/* Security footer */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60">
            <Shield className="h-3 w-3" />
            <span>Secured with enterprise-grade encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
