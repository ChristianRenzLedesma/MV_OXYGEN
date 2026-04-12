import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Package, ShoppingCart, User, Settings, Home, PlusCircle, History } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/user/dashboard',
        icon: Home,
    },
    {
        title: 'New Request',
        url: '/user/rentals/create',
        icon: PlusCircle,
    },
    {
        title: 'My Rentals',
        url: '/user/rentals',
        icon: Package,
    },
    {
        title: 'History',
        url: '/user/history',
        icon: History,
    },
    {
        title: 'Settings',
        url: '/user/settings',
        icon: Settings,
    }
];

const footerNavItems: NavItem[] = [
    // Repository and documentation items removed
];

export function UserSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/user/dashboard" prefetch>
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
