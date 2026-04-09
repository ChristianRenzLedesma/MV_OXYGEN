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
import { Trash2, AlertTriangle } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface Customer {
    customer_id: number;
    name: string;
}

interface DeleteCustomerDialogProps {
    customer: Customer;
    onSuccess?: () => void;
}

export default function DeleteCustomerDialog({ customer, onSuccess }: DeleteCustomerDialogProps) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/customer/${customer.customer_id}`, {
            onSuccess: () => {
                setOpen(false);
                onSuccess?.();
            },
            onError: (errors) => {
                console.error('Delete errors:', errors);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Customer
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{customer.name}</strong>? This action cannot be undone and will also delete all associated transactions.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete} 
                        disabled={processing}
                    >
                        {processing ? 'Deleting...' : 'Delete Customer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
