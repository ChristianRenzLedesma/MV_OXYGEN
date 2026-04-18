import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { UserSidebar } from '@/components/user-sidebar';
import { usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    
    // Check if user is admin using same logic as User model's isAdmin() method
    const isAdmin = user?.role === 'admin' || 
                   (user?.email && (
                       user.email === 'admin@example.com' ||
                       user.email === 'admin@mvoxygen.com' ||
                       user.email === 'superadmin@mvoxygen.com' ||
                       user.email.endsWith('@admin.mvoxygen.com')
                   ));

    // Use UserSidebar for customer users, AppSidebar for admin users
    if (!isAdmin) {
        return (
            <AppShell variant="sidebar">
                <UserSidebar />
                <AppContent variant="sidebar">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </AppContent>
            </AppShell>
        );
    }

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
