import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';

export default function UserDashboardTest() {
    return (
        <UserLayout>
            <Head title="Test Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">Test User Dashboard</h1>
                <p>If you can see this, the layout is working.</p>
            </div>
        </UserLayout>
    );
}
