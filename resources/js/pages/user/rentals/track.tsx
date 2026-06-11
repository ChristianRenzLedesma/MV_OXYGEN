import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, MapPin, CheckCircle, Truck, ArrowLeft, ClipboardList, Clock, XCircle, Hash } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface Activity {
  action: string;
  description: string;
  created_at: string;
}

interface Props {
  breadcrumbs?: BreadcrumbItem[];
  rental?: {
    id: number;
    tracking_number?: string;
    tank_type: string;
    status: string;
    pickup_type: string;
    created_at: string;
    activities?: Activity[];
    delivery_location?: {
      lat: number;
      lng: number;
      address: string;
    };
    pickup_location?: {
      lat: number;
      lng: number;
      address: string;
    };
  };
}

export default function RentalTracking({ 
  breadcrumbs = [{ title: 'Dashboard', href: '/user/dashboard' }],
  rental 
}: Props) {
  const breadcrumbsWithTrack: BreadcrumbItem[] = [
    ...breadcrumbs,
    { title: 'Track Delivery', href: `/user/rentals/${rental?.id}/track` }
  ];

  if (!rental) {
    return (
      <AppLayout>
        <Head title="Rental Not Found" />
        <div className="min-h-screen bg-gray-50 p-6 w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Rental Not Found</h1>
            <a href="/user/dashboard" className="text-blue-600 hover:text-blue-800">
              Return to Dashboard
            </a>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head title={`Track Delivery - ${rental.tank_type}`} />
      <div className="min-h-screen bg-gray-50 p-6 w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Breadcrumbs breadcrumbs={breadcrumbsWithTrack} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Delivery</h1>
              <p className="text-gray-600">
                {rental.tank_type} - {rental.pickup_type === 'delivery' ? 'Delivery' : 'Pickup'}
              </p>
            </div>
            <a
              href="/user/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </a>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Tracking Status</h2>
            <p className="text-sm text-gray-500">Request #{rental.id} &middot; {new Date(rental.created_at).toLocaleDateString()}</p>
          </div>

          {/* Horizontal Steps */}
          <div className="flex items-center justify-center">
            {[
              { key: 'ordered', label: 'Ordered', icon: CheckCircle },
              { key: 'packed', label: 'Packed', icon: ClipboardList },
              { key: 'in_transit', label: 'In Transit', icon: Truck },
              { key: 'delivered', label: 'Delivered', icon: MapPin },
            ].map((step, index) => {
              const isActive = 
                step.key === 'ordered' 
                  ? ['pending', 'approved', 'in_transit', 'delivered'].includes(rental.status)
                  : step.key === 'packed'
                    ? ['approved', 'in_transit', 'delivered'].includes(rental.status)
                    : step.key === 'in_transit'
                      ? ['in_transit', 'delivered'].includes(rental.status)
                      : rental.status === 'delivered';
              const isCompleted =
                step.key === 'ordered'
                  ? ['approved', 'in_transit', 'delivered'].includes(rental.status)
                  : step.key === 'packed'
                    ? ['in_transit', 'delivered'].includes(rental.status)
                    : step.key === 'in_transit'
                      ? rental.status === 'delivered'
                      : rental.status === 'delivered';

              return (
                <div key={step.key} className="flex items-center">
                  {/* Step Circle + Label */}
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className={`mt-2 text-sm font-semibold text-center ${
                      isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                    {step.key === 'packed' && rental.status === 'approved' && (
                      <span className="mt-1 text-xs text-orange-600 font-medium text-center">Preparing your order</span>
                    )}
                    {step.key === 'in_transit' && rental.status === 'in_transit' && (
                      <span className="mt-1 text-xs text-orange-600 font-medium">Your order is on the way!</span>
                    )}
                    {step.key === 'delivered' && rental.status === 'delivered' && (
                      <span className="mt-1 text-xs text-green-600 font-medium text-center max-w-[120px]">Delivery complete!</span>
                    )}
                  </div>
                  {/* Connector line */}
                  {index < 3 && (
                    <div className={`w-16 h-1 mx-1.5 rounded ${
                      index === 0
                        ? (['approved', 'in_transit', 'delivered'].includes(rental.status) ? 'bg-green-500' : 'bg-gray-300')
                        : index === 1
                          ? (['in_transit', 'delivered'].includes(rental.status) ? 'bg-green-500' : 'bg-gray-300')
                          : (rental.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300')
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tracking Number */}
        {rental.tracking_number && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-white">
                <Hash className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium opacity-90">Tracking Number</span>
              </div>
              <span className="text-white font-bold text-lg tracking-wider">{rental.tracking_number}</span>
            </div>
          </div>
        )}

        {/* Delivery Status Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {rental.pickup_type === 'delivery' && rental.delivery_location && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-500" />
                Delivery Address
              </h3>
              <p className="text-gray-600">{rental.delivery_location.address}</p>
            </div>
          )}

          {rental.pickup_type === 'pickup' && rental.pickup_location && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2 text-red-500" />
                Pickup Location
              </h3>
              <p className="text-gray-600">{rental.pickup_location.address}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-500" />
              Tank Details
            </h3>
            <p className="text-gray-600">{rental.tank_type}</p>
            <p className="text-sm text-gray-500 mt-1">
              Type: {rental.pickup_type === 'delivery' ? 'Delivery' : 'Pickup'}
            </p>
          </div>
        </div>

        {/* Activity Log */}
        {rental.activities && rental.activities.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Activity Timeline
            </h3>
            <div className="relative">
              {rental.activities.map((activity, index) => {
                const getIcon = () => {
                  switch (activity.action) {
                    case 'rental_request': return CheckCircle;
                    case 'rental_approved': return CheckCircle;
                    case 'rental_dispatched': return Truck;
                    case 'rental_rejected': return XCircle;
                    case 'rental_completed': return MapPin;
                    default: return Clock;
                  }
                };
                const getColor = () => {
                  switch (activity.action) {
                    case 'rental_request': return 'bg-blue-500';
                    case 'rental_approved': return 'bg-green-500';
                    case 'rental_dispatched': return 'bg-orange-500';
                    case 'rental_rejected': return 'bg-red-500';
                    case 'rental_completed': return 'bg-green-500';
                    default: return 'bg-gray-500';
                  }
                };
                const Icon = getIcon();

                return (
                  <div key={index} className="flex items-start mb-6 last:mb-0">
                    {index < rental.activities.length - 1 && (
                      <div className="absolute left-[19px] ml-0.5 w-0.5 h-14 bg-gray-300" style={{ marginTop: '44px' }} />
                    )}
                    <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${getColor()} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm text-gray-900 font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(activity.created_at).toLocaleDateString('en-PH', {
                          year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
