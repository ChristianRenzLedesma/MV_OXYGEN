import { Head, Link } from '@inertiajs/react';
import { Package, MapPin, CheckCircle, Truck, ClipboardList, Clock, XCircle, Hash, ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';

interface Activity {
  action: string;
  description: string;
  created_at: string;
}

interface Props {
  rental?: {
    id: number;
    tracking_number: string;
    tank_type: string;
    status: string;
    pickup_type: string;
    created_at: string;
    activities?: Activity[];
    delivery_location?: { lat: number; lng: number; address: string };
    pickup_location?: { lat: number; lng: number; address: string };
  };
  not_found: boolean;
  tracking_number: string;
}

export default function TrackResult({ rental, not_found, tracking_number }: Props) {
  const [searchInput, setSearchInput] = useState(tracking_number || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/track/${searchInput.trim()}`;
    }
  };

  return (
    <>
      <Head title={not_found ? 'Track Order - Not Found' : `Track Order - ${rental?.tracking_number}`} />

      <div className="min-h-screen bg-gray-50">
        {/* Nav */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">MV Oxygen Trading</Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter tracking number (e.g. MV-O2X7K9L3)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Track
              </button>
            </form>
          </div>

          {not_found ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
              <p className="text-gray-600 mb-2">
                No order found with tracking number: <strong>{tracking_number}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Please double-check your tracking number and try again.
              </p>
            </div>
          ) : rental && (
            <>
              {/* Progress Steps */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Tracking Status</h2>
                  <p className="text-sm text-gray-500">Request #{rental.id}</p>
                </div>

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

              {/* Tracking Number Banner */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white">
                    <Hash className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium opacity-90">Tracking Number</span>
                  </div>
                  <span className="text-white font-bold text-lg tracking-wider">{rental.tracking_number}</span>
                </div>
              </div>

              {/* Details */}
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
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t mt-12 py-6">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MV Oxygen Trading. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
