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
import { RotateCcw, CheckCircle } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface Customer {
    id: number;
    name: string;
}

interface RestoreCustomerDialogProps {
    customer: Customer;
    onSuccess?: () => void;
}

export default function RestoreCustomerDialog({ customer, onSuccess }: RestoreCustomerDialogProps) {
    const [open, setOpen] = useState(false);
    const { post, processing } = useForm();

    const handleRestore = () => {
        post(`/customer/${customer.id}/restore`, {
            onSuccess: () => {
                setOpen(false);
                onSuccess?.();
            },
            onError: (errors) => {
                console.error('Restore errors:', errors);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Restore Customer
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to restore <strong>{customer.name}</strong>? This will make the customer visible in the active list again.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="default" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleRestore} 
                        disabled={processing}
                    >
                        {processing ? 'Restoring...' : 'Restore Customer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
