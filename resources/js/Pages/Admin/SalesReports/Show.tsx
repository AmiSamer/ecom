import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

interface SaleItem {
    id: number;
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    subtotal: number;
    product?: {
        id: number;
        name: string;
        slug: string;
        image: string | null;
    } | null;
}

interface Sale {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    subtotal: number;
    tax: number;
    shipping_cost: number;
    payment_method: string;
    payment_status: string;
    order_status: string;
    shipping_address: string;
    contact_phone: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    items: SaleItem[];
}

interface ShowProps {
    sale: Sale;
}

export default function Show({ sale }: ShowProps) {
    const getStatusBadge = (status: string, type: 'order' | 'payment') => {
        const colors: { [key: string]: string } = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            paid: 'bg-green-100 text-green-800',
            unpaid: 'bg-red-100 text-red-800',
        };

        return (
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </span>
        );
    };

    const formatPaymentMethod = (method: string) => {
        return method.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <AdminLayout>
            <Head title={`Order ${sale.order_number}`} />

            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                        <p className="mt-1 text-sm text-gray-600">Order #{sale.order_number}</p>
                    </div>
                    <Link href={route('admin.reports.index')}>
                        <PrimaryButton>Back to Reports</PrimaryButton>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sale.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {item.product?.image && (
                                                        <img
                                                            src={`/storage/${item.product.image}`}
                                                            alt={item.product_name}
                                                            className="h-12 w-12 object-cover rounded-md mr-4"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.product_name}
                                                        </div>
                                                        {item.product && (
                                                            <Link
                                                                href={route('products.show', item.product.slug)}
                                                                className="text-sm text-indigo-600 hover:text-indigo-900"
                                                                target="_blank"
                                                            >
                                                                View Product
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    ৳{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.quantity}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    ৳{item.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Shipping Address</label>
                                <p className="mt-1 text-sm text-gray-900">{sale.shipping_address}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                                <p className="mt-1 text-sm text-gray-900">{sale.contact_phone}</p>
                            </div>
                            {sale.notes && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Notes</label>
                                    <p className="mt-1 text-sm text-gray-900">{sale.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Order Status</label>
                                <div className="mt-2">
                                    {getStatusBadge(sale.order_status, 'order')}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Payment Status</label>
                                <div className="mt-2">
                                    {getStatusBadge(sale.payment_status, 'payment')}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Payment Method</label>
                                <p className="mt-1 text-sm text-gray-900">{formatPaymentMethod(sale.payment_method)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Name</label>
                                <p className="mt-1 text-sm text-gray-900">{sale.customer_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="mt-1 text-sm text-gray-900">{sale.customer_email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Subtotal</span>
                                <span className="text-sm font-medium text-gray-900">
                                    ৳{sale.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Tax</span>
                                <span className="text-sm font-medium text-gray-900">
                                    ৳{sale.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Shipping Cost</span>
                                <span className="text-sm font-medium text-gray-900">
                                    ৳{sale.shipping_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between">
                                    <span className="text-base font-semibold text-gray-900">Total</span>
                                    <span className="text-lg font-bold text-green-600">
                                        ৳{sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Dates */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Dates</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Order Date</label>
                                <p className="mt-1 text-sm text-gray-900">{sale.created_at}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                <p className="mt-1 text-sm text-gray-900">{sale.updated_at}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
