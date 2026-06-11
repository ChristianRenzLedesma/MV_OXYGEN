<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Customer;
use App\Models\RentalRequest;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
         return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $billingInfo = [];
        $totalOutstandingBalance = 0;

        if ($request->user()) {
            $customer = Customer::where('name', $request->user()->name)->first();

            if ($customer) {
                $approvedRentals = RentalRequest::with(['rental'])
                    ->where('customer_id', $customer->id)
                    ->where('status', 'approved')
                    ->get();

                foreach ($approvedRentals as $rentalRequest) {
                    if ($rentalRequest->rental) {
                        $rental = $rentalRequest->rental;
                        $totalAmount = $rental->total_amount ?? 0;
                        $depositAmount = $rental->deposit_amount ?? 0;
                        $remainingBalance = max($totalAmount - $depositAmount, 0);

                        if ($remainingBalance > 0) {
                            $billingInfo[] = [
                                'rental_request_id' => $rentalRequest->id,
                                'tank_type' => $rentalRequest->tank_type,
                                'total_amount' => $totalAmount,
                                'deposit_amount' => $depositAmount,
                                'remaining_balance' => $remainingBalance,
                                'status' => $rentalRequest->status,
                                'pickup_date' => $rental->pickup_date,
                            ];
                        }
                    }
                }
                $totalOutstandingBalance = array_sum(array_column($billingInfo, 'remaining_balance'));
            }
        }

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'billingInfo' => $billingInfo,
            'totalOutstandingBalance' => $totalOutstandingBalance,
        ]);
    }
}
