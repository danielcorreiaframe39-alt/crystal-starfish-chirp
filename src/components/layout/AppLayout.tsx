import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  ClipboardList,
  ArrowUpRight,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const navItems = [
  {
    title: "Resumo",
    description: "Indicadores gerais e proximos passos.",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Colaboradores",
    description: "Convites, status e feedbacks.",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Quizzes",
    description: "Conteudos e mapeamentos ativos.",
    href: "/quizzes",
    icon: ClipboardList,
  },
  {
    title: "Traits",
    description: "Biblioteca de tracos comportamentais.",
    href: "/traits",
    icon: Sparkles,
  },
];

const AppLayout = () => {
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PT";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="gap-3 border-b border-sidebar-border/60 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold leading-tight">PsyTrack</p>
              <p className="text-xs text-muted-foreground">
                Avaliacoes psicologicas
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <ArrowUpRight className="size-3.5" />
            Nova acao
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegacao</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.href}
                      className="flex items-center gap-2"
                      end={item.href === "/"}
                    >
                      <item.icon className="size-4" />
                      <div className="flex flex-col gap-0.5">
                        <span>{item.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border/60 px-3 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/20 px-3 py-2">
            <Avatar className="size-9 border border-primary/10">
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-semibold">
                {profile?.full_name ?? "Conta PsyTrack"}
              </span>
              <span className="text-xs text-muted-foreground">
                {profile?.company_name ?? "Workspace"}
              </span>
            </div>
            <Badge variant="outline" className="text-[11px] capitalize">
              {profile?.role ?? "usuario"}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground"
            onClick={signOut}
          >
            Sair
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-muted/30">
        <header className="flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="lg:hidden" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex flex-1 flex-col">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              PsyTrack
            </p>
            <p className="font-semibold">
              Insights sobre cultura e desenvolvimento
            </p>
          </div>
          <div className="hidden gap-2 md:flex">
            <Button variant="outline" size="sm">
              Exportar
            </Button>
            <Button size="sm">Novo insight</Button>
          </div>
        </header>
        <main
          className={cn(
            "flex flex-1 flex-col gap-6 px-4 pb-8 pt-6",
            "lg:px-8 lg:pb-10",
          )}
        >
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
