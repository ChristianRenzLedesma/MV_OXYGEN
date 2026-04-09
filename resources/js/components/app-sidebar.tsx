import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Package, ShoppingCart, Users, BarChart3, Settings, FileText, RefreshCw } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Customer',
        url: '/customer',
        icon: Users,
    },
    {
        title: 'Rentals',
        url: '/rentals',
        icon: Package,
    },
    {
        title: 'Refills',
        url: '/refills',
        icon: RefreshCw,
    },
    {
        title: 'Inventory',
        url: '/inventory',
        icon: FileText,
    },
    {
        title: 'Reports',
        url: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
    }
];

const footerNavItems: NavItem[] = [
    // Repository and documentation items removed
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
