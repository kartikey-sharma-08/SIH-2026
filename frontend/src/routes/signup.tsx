import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — TransformAI Demo Workspace" },
      {
        name: "description",
        content:
          "Demo sign-up screen for the TransformAI content transformation workspace.",
      },
      { property: "og:title", content: "Create account — TransformAI" },
      {
        property: "og:description",
        content: "Demo sign-up for the TransformAI workspace.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <AuthShell
      withName
      title="Create your workspace"
      subtitle="Start transforming sources in the demo workspace."
      cta="Create account"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    />
  );
}
