'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { Home, BarChart3, ShieldAlert, FileText, Settings, LogOut, Siren } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { PredictionListener } from './prediction-listener';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/sleep-stress', icon: BarChart3, label: 'Sleep & Stress' },
  { href: '/risk-prediction', icon: ShieldAlert, label: 'Risk Prediction' },
  { href: '/alerts', icon: Siren, label: 'Alerts' },
  { href: '/report', icon: FileText, label: 'Session Report' },
];

const bottomNavItems = [
    { href: '/settings', icon: Settings, label: 'Settings' },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  if (pathname === '/login') {
    return <>{children}</>;
  }
  
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4" onClick={() => setOpen(false)}>
                  <Logo className="h-6 w-6 text-primary" />
                  <span className="">Mindora</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      pathname === item.href && "text-primary bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <nav className="mt-auto grid gap-6 text-lg font-medium">
                {bottomNavItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href && "text-primary bg-muted"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
                 <button
                    onClick={() => {
                        logout();
                        setOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className='flex items-center gap-2 font-semibold'>
             <Logo className="h-6 w-6 text-primary" />
             <span className="hidden md:inline">Mindora</span>
          </div>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <PredictionListener />
            {children}
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r flex flex-col">
          <SidebarHeader className="flex items-center gap-2 p-4">
            <Logo className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold whitespace-nowrap">Mindora</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <div>
                        <item.icon />
                        <span>{item.label}</span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
           <SidebarContent className="mt-auto">
            <SidebarMenu>
                {bottomNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href}>
                            <SidebarMenuButton asChild isActive={pathname === item.href}>
                            <div>
                                <item.icon />
                                <span>{item.label}</span>
                            </div>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => logout()}>
                      <div>
                        <LogOut />
                        <span>Logout</span>
                      </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-4 border-b bg-background px-6">
            <ThemeToggle />
          </header>
          <SidebarInset>
            <PredictionListener />
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
