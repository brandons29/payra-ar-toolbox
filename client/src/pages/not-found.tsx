import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-4">
        <div className="text-4xl font-bold text-muted-foreground/30">404</div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/dashboard">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
        </Button>
      </Card>
    </div>
  );
}
