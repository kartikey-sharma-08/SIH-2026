import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  CreditCard,
  FileStack,
  FolderKanban,
  Gauge,
  History,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Sparkles,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { workspace, artifacts, projects, sources } from "@/data/demo";

const mainNav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/sources", label: "Sources", icon: Upload },
  { to: "/transform", label: "Transform", icon: Wand2 },
  { to: "/artifacts", label: "Artifacts", icon: FileStack },
  { to: "/history", label: "History", icon: History },
] as const;

const secondaryNav = [
  { to: "/pricing", label: "Usage", icon: Gauge },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const item = (to: string, label: string, Icon: typeof Gauge) => {
    const active = pathname === to || pathname.startsWith(to + "/");
    return (
      <Link
        key={to}
        to={to}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
          active
            ? "bg-primary/15 text-foreground ring-1 ring-primary/30"
            : "text-muted-foreground hover:bg-surface hover:text-foreground",
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {mainNav.map((n) => item(n.to, n.label, n.icon))}
      <div className="my-4 h-px bg-border" />
      {secondaryNav.map((n) => item(n.to, n.label, n.icon))}
    </nav>
  );
}

export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex min-w-0 items-center gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/20 ring-1 ring-primary/40">
        <Sparkles className="h-4 w-4 text-primary" />
      </span>
      <span className="truncate text-sm font-semibold tracking-tight">
        TransformAI
      </span>
    </Link>
  );
}

function GlobalSearch({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search projects, sources, artifacts…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {[...mainNav, ...secondaryNav].map((n) => (
            <CommandItem key={n.to} value={n.label} onSelect={() => go(n.to)}>
              <n.icon className="mr-2 h-4 w-4" />
              {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem
              key={p.id}
              value={p.name}
              onSelect={() => go(`/projects/${p.id}`)}
            >
              <FolderKanban className="mr-2 h-4 w-4" />
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Sources">
          {sources.map((s) => (
            <CommandItem
              key={s.id}
              value={s.title}
              onSelect={() => go(`/sources/${s.id}`)}
            >
              <Upload className="mr-2 h-4 w-4" />
              {s.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Artifacts">
          {artifacts.slice(0, 6).map((a) => (
            <CommandItem
              key={a.id}
              value={a.title}
              onSelect={() => go(`/artifacts/${a.id}`)}
            >
              <FileStack className="mr-2 h-4 w-4" />
              {a.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-6 border-r border-border bg-sidebar/60 px-4 py-6 backdrop-blur-xl lg:flex">
        <Brand />
        <NavList />
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Usage this month</p>
          <p className="mt-1 text-sm font-medium">
            {workspace.usage.used} / {workspace.usage.limit}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-strong">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${(workspace.usage.used / workspace.usage.limit) * 100}%`,
              }}
            />
          </div>
          <Button asChild size="sm" className="mt-3 w-full">
            <Link to="/pricing">Upgrade plan</Link>
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 border-border bg-sidebar/95 p-4 backdrop-blur-xl">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <div className="mb-6 flex items-center justify-between">
                    <Brand onClick={() => setMobileOpen(false)} />
                  </div>
                  <NavList onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>
              <div className="hidden lg:block">
                <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground">
                  {workspace.name}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="truncate">Search…</span>
              <kbd className="ml-auto hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] sm:block">
                ⌘K
              </kbd>
            </button>

            <div className="flex shrink-0 items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex-col items-start gap-0.5">
                    <span className="text-sm">Transformation complete</span>
                    <span className="text-xs text-muted-foreground">
                      6 deliverables from the Q3 incident assessment
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex-col items-start gap-0.5">
                    <span className="text-sm">1 statement requires review</span>
                    <span className="text-xs text-muted-foreground">
                      Grounding check on Executive Summary
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex-col items-start gap-0.5">
                    <span className="text-sm">Source processing failed</span>
                    <span className="text-xs text-muted-foreground">
                      Service Restoration Press Note (Draft)
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="grid h-8 w-8 place-items-center rounded-full bg-primary/20 text-xs font-medium ring-1 ring-primary/40">
                    {workspace.user.initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{workspace.user.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {workspace.user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/billing">Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login">Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:py-10">
          {children}
        </main>
      </div>

      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 p-3 backdrop-blur-xl lg:hidden">
        <Button asChild className="w-full">
          <Link to="/transform">
            <Wand2 className="mr-2 h-4 w-4" /> New Transformation
          </Link>
        </Button>
      </div>

      <button
        onClick={() => setMobileOpen(false)}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
      >
        <X />
      </button>
    </div>
  );
}
