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
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { Loader2, Calendar, Shield, Zap, BarChart3, ArrowRight } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useLocation } from "wouter";

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

const TRUST_ITEMS = [
  { icon: BarChart3, text: "7 diagnostic tools for your AR process" },
  { icon: Zap, text: "Instant benchmarks against your industry" },
  { icon: Shield, text: "Free, no credit card required" },
];

export default function Login() {
  const { user, loading, signInWithGoogle, signInWithMicrosoft, signInWithEmail, signUpWithEmail } = useAuth();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "microsoft" | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

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
      if (err) setError(err.message);
      else setSignupSuccess(true);
    } else {
      const { error: err } = await signInWithEmail(email, password);
      if (err) setError(err.message);
      else navigate("/dashboard");
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

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md p-6 space-y-4">
          <div className="text-center space-y-2">
            <PayraLogoFull className="justify-center" />
            <p className="text-sm text-muted-foreground mt-4">
              Supabase is not configured yet. Add these environment variables to enable authentication:
            </p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-xs font-mono space-y-1">
            <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
            <p>VITE_SUPABASE_ANON_KEY=eyJ...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" data-testid="page-login">
      {/* Left panel — hero */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        {/* Subtle grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" aria-hidden="true">
          <defs>
            <pattern id="login-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-grid)" />
        </svg>

        {/* Gradient orb accents */}
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-[#2CC5E7]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-[#1BD489]/8 blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-20">
          <div className="space-y-8 max-w-md">
            <div>
              <PayraLogoFull className="mb-6 [&_img]:brightness-0 [&_img]:invert" />
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
                Diagnose your accounts receivable in minutes
              </h1>
              <p className="text-base text-white/60 mt-3 leading-relaxed">
                Run 7 free diagnostic tools to benchmark your AR performance, identify bottlenecks, and find hidden savings.
              </p>
            </div>

            <div className="space-y-4">
              {TRUST_ITEMS.map((item, i) => (
                <div key={i} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-4.5 w-4.5 text-[#2CC5E7]" />
                  </div>
                  <span className="text-sm text-white/80">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">
                Trusted by construction, distribution, and industrial companies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 bg-background">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-2">
            <PayraLogoFull />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "signup"
                ? "Sign up to access your free AR diagnostics"
                : "Sign in to continue your AR assessment"}
            </p>
          </div>

          {signupSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 text-sm text-center text-emerald-700 dark:text-emerald-300">
              Check your email for a confirmation link, then sign in.
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-2.5">
            <Button
              variant="outline"
              className="w-full h-11 gap-2.5 text-sm font-medium"
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
              className="w-full h-11 gap-2.5 text-sm font-medium"
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
                  className="h-11 text-sm"
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
                className="h-11 text-sm"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-11 text-sm"
                data-testid="input-password"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive" data-testid="text-auth-error">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 text-sm font-medium" disabled={submitting} data-testid="button-email-submit">
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "signup" ? "Create Account" : "Sign In"}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="text-sm text-center text-muted-foreground">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => { setMode("signup"); setError(""); }} className="text-primary font-medium hover:underline" data-testid="button-toggle-signup">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-primary font-medium hover:underline" data-testid="button-toggle-login">
                  Sign in
                </button>
              </>
            )}
          </p>

          {/* Demo CTA */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center space-y-2.5">
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
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>

          <div className="flex justify-center pt-2">
            <PerplexityAttribution />
          </div>
        </div>
      </div>
    </div>
  );
}
