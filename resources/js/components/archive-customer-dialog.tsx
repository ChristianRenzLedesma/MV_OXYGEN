import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Archive, AlertTriangle } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface Customer {
    id: number;
    name: string;
}

interface ArchiveCustomerDialogProps {
    customer: Customer;
    onSuccess?: () => void;
}

export default function ArchiveCustomerDialog({ customer, onSuccess }: ArchiveCustomerDialogProps) {
    const [open, setOpen] = useState(false);
    const { post, processing } = useForm();

    const handleArchive = () => {
        post(`/customer/${customer.id}/archive`, {
            onSuccess: () => {
                setOpen(false);
                onSuccess?.();
            },
            onError: (errors) => {
                console.error('Archive errors:', errors);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                    <Archive className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-5 w-5" />
                        Archive Customer
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to archive <strong>{customer.name}</strong>? This will hide the customer from the active list but can be restored later.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={handleArchive} 
                        disabled={processing}
                    >
                        {processing ? 'Archiving...' : 'Archive Customer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
