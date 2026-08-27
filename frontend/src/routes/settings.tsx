import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, PageHeader } from "@/components/app/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { audiences, languages, tones, workspace } from "@/data/demo";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — TransformAI Demo Workspace" },
      {
        name: "description",
        content:
          "Profile, preferences, workspace defaults, security and data controls for the TransformAI demo workspace.",
      },
      { property: "og:title", content: "Settings — TransformAI" },
      {
        property: "og:description",
        content: "Profile, preferences, workspace, security and data settings.",
      },
    ],
  }),
  component: SettingsPage,
});

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SettingsPage() {
  const saved = () => toast.success("Settings saved (demo)");

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Settings"
          title="Workspace settings"
          description="Demo settings — nothing is persisted."
        />

        <Tabs defaultValue="profile">
          <TabsList className="flex w-full flex-wrap justify-start bg-surface">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-5">
            <GlassCard className="space-y-5 p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/20 text-sm font-medium ring-1 ring-primary/40">
                  {workspace.user.initials}
                </span>
                <Button variant="outline" onClick={saved}>
                  Change avatar
                </Button>
              </div>
              <Row label="Full name">
                <Input defaultValue={workspace.user.name} className="bg-surface" />
              </Row>
              <Row label="Email">
                <Input defaultValue={workspace.user.email} className="bg-surface" />
              </Row>
              <Button onClick={saved}>Save profile</Button>
            </GlassCard>
          </TabsContent>

          <TabsContent value="preferences" className="mt-5">
            <GlassCard className="space-y-5 p-5 sm:p-6">
              <Row label="Interface language">
                <Select defaultValue="English">
                  <SelectTrigger className="bg-surface">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Row>
              <Row label="Preferred tone">
                <Select defaultValue="Executive">
                  <SelectTrigger className="bg-surface">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Row>
              {[
                "Email me when a transformation completes",
                "Notify me about grounding warnings",
                "Weekly workspace digest",
              ].map((n) => (
                <div
                  key={n}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"
                >
                  <span className="min-w-0 text-sm">{n}</span>
                  <Switch defaultChecked />
                </div>
              ))}
              <Button onClick={saved}>Save preferences</Button>
            </GlassCard>
          </TabsContent>

          <TabsContent value="workspace" className="mt-5">
            <GlassCard className="space-y-5 p-5 sm:p-6">
              <Row label="Workspace name">
                <Input defaultValue={workspace.name} className="bg-surface" />
              </Row>
              <Row label="Default audience">
                <Select defaultValue="Executive">
                  <SelectTrigger className="bg-surface">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Row>
              <Row label="Default tone">
                <Select defaultValue="Professional">
                  <SelectTrigger className="bg-surface">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Row>
              <Button onClick={saved}>Save workspace</Button>
            </GlassCard>
          </TabsContent>

          <TabsContent value="security" className="mt-5">
            <GlassCard className="space-y-5 p-5 sm:p-6">
              <Row label="Current password">
                <Input type="password" defaultValue="demo-password" className="bg-surface" />
              </Row>
              <Row label="New password">
                <Input type="password" placeholder="••••••••" className="bg-surface" />
              </Row>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <div className="min-w-0">
                  <p className="text-sm">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">
                    Require a one-time code at sign-in.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-sm">Active sessions</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Chrome · Delhi, India · current session
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => toast.success("Other sessions revoked (demo)")}
                >
                  Sign out other sessions
                </Button>
              </div>
              <Button onClick={saved}>Update security</Button>
            </GlassCard>
          </TabsContent>

          <TabsContent value="data" className="mt-5">
            <GlassCard className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <div className="min-w-0">
                  <p className="text-sm">Export workspace data</p>
                  <p className="text-xs text-muted-foreground">
                    Download sources, transformations and artifacts.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => toast.success("Export started (demo)")}
                >
                  Export
                </Button>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/8 p-4">
                <div className="min-w-0">
                  <p className="text-sm">Delete account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently removes the workspace and all artifacts.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This is a demo — nothing will actually be deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => toast.success("Account deletion simulated")}
                      >
                        Delete account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
