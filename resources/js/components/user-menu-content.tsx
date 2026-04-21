import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

interface UserMenuContentProps {
    user: User;
    setShowLogoutModal?: (show: boolean) => void;
}

export function UserMenuContent({ user, setShowLogoutModal }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const [isClicking, setIsClicking] = useState(false);

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isClicking) return;
        
        setIsClicking(true);
        
        setTimeout(() => {
            setIsClicking(false);
        }, 300);

        // Close dropdown before showing modal
        cleanup();

        if (setShowLogoutModal) {
            setShowLogoutModal(true);
        } else {
            router.post(route('logout'));
        }
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <button
                    className="w-full px-2 py-1.5 text-sm text-left flex items-center"
                    onClick={handleLogoutClick}
                >
                    <LogOut className="mr-2" />
                    Log out
                </button>
            </DropdownMenuItem>
        </>
    );
}
