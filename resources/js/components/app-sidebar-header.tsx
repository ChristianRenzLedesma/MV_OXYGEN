import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Search } from 'lucide-react';
import { Notifications } from '@/components/notifications';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center gap-2">
                    <img 
                        src="/images/mv-oxygen-logo.png" 
                        alt="MV Oxygen Trading Logo" 
                        className="w-8 h-8"
                    />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
            
            {/* Search Bar - Center */}
            <div className="flex-1 flex justify-center">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
            
            {/* Notifications - Right */}
            <div className="flex items-center gap-2">
                <Notifications />
            </div>
        </header>
    );
}
