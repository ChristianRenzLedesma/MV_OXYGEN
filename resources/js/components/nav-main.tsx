import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.disabled ? (
                            <SidebarMenuButton className="opacity-50 cursor-not-allowed">
                                {item.icon && <item.icon />}
                                <span className="flex-1">{item.title}</span>
                                <Badge variant="secondary" className="text-xs">
                                    Soon
                                </Badge>
                            </SidebarMenuButton>
                        ) : (
                            <SidebarMenuButton 
                                asChild 
                                isActive={item.url === page.url}
                            >
                                <Link 
                                    href={item.url} 
                                    prefetch={false}
                                    onClick={() => console.log(`Link clicked: ${item.title} -> ${item.url}`)}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
