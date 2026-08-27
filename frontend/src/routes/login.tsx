import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/app/ui-kit";
import { Brand } from "@/components/app/AppShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — TransformAI Demo Workspace" },
      {
        name: "description",
        content:
          "Demo sign-in screen for the TransformAI content transformation workspace.",
      },
      { property: "og:title", content: "Log in — TransformAI" },
      {
        property: "og:description",
        content: "Demo sign-in for the TransformAI workspace.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to the demo workspace."
      cta="Sign in"
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    />
  );
}

export function AuthShell({
  title,
  subtitle,
  cta,
  footer,
  withName,
}: {
  title: string;
  subtitle: string;
  cta: string;
  footer: React.ReactNode;
  withName?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Brand />
      <GlassCard className="mt-8 w-full max-w-md p-6 sm:p-8">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              toast.success("Signed in to the demo workspace");
              navigate({ to: "/dashboard" });
            }, 900);
          }}
        >
          {withName && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                defaultValue="Kartikey Sharma"
                className="bg-surface"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="kartikey@demo.transformai.app"
              className="bg-surface"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              defaultValue="demo-password"
              className="bg-surface"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {cta}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo only — no real authentication is performed.
        </p>
      </GlassCard>
    </div>
  );
}
