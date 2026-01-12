import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SearchableSelect from '@/Components/SearchableSelect';

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
    item_count: number;
    created_at: string;
}

interface IndexProps {
    sales: {
        data: Sale[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    summary: {
        total_orders: number;
        total_sales: number;
        total_subtotal: number;
        total_tax: number;
        total_shipping: number;
    };
    filters?: {
        search?: string;
        date_from?: string;
        date_to?: string;
        order_status?: string;
        payment_status?: string;
        payment_method?: string;
    };
}

export default function Index({ sales, summary, filters = {} }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [orderStatusFilter, setOrderStatusFilter] = useState(filters.order_status || '');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(filters.payment_status || '');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState(filters.payment_method || '');
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilters = () => {
        const params: any = {};
        if (search) params.search = search;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        if (orderStatusFilter) params.order_status = orderStatusFilter;
        if (paymentStatusFilter) params.payment_status = paymentStatusFilter;
        if (paymentMethodFilter) params.payment_method = paymentMethodFilter;

        router.get('/admin/reports', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [search]);

    const handleDateFilter = () => {
        applyFilters();
    };

    const handlePerPageChange = (perPage: number) => {
        const params: any = { per_page: perPage };
        if (search) params.search = search;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        if (orderStatusFilter) params.order_status = orderStatusFilter;
        if (paymentStatusFilter) params.payment_status = paymentStatusFilter;
        if (paymentMethodFilter) params.payment_method = paymentMethodFilter;

        router.get('/admin/reports', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

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
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
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
            <Head title="Sales Reports" />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
                <p className="mt-1 text-sm text-gray-600">View and manage all sales orders</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-sm text-gray-600">Total Orders</div>
                    <div className="text-2xl font-bold text-gray-900">{summary.total_orders}</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-sm text-gray-600">Total Sales</div>
                    <div className="text-2xl font-bold text-green-600">৳{summary.total_sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-sm text-gray-600">Subtotal</div>
                    <div className="text-2xl font-bold text-gray-900">৳{summary.total_subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-sm text-gray-600">Tax</div>
                    <div className="text-2xl font-bold text-gray-900">৳{summary.total_tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-sm text-gray-600">Shipping</div>
                    <div className="text-2xl font-bold text-gray-900">৳{summary.total_shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="md:col-span-1 lg:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search Order #
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <TextInput
                                id="search"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 block w-full"
                                placeholder="Search by order number..."
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-1">
                            From Date
                        </label>
                        <TextInput
                            id="date_from"
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            onBlur={handleDateFilter}
                            className="block w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-1">
                            To Date
                        </label>
                        <TextInput
                            id="date_to"
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            onBlur={handleDateFilter}
                            className="block w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="order_status" className="block text-sm font-medium text-gray-700 mb-1">
                            Order Status
                        </label>
                        <SearchableSelect
                            id="order_status"
                            name="order_status"
                            value={orderStatusFilter || ''}
                            options={[
                                { value: '', label: 'All Statuses' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'processing', label: 'Processing' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' },
                            ]}
                            onChange={(value) => {
                                setOrderStatusFilter(value.toString());
                                const params: any = {};
                                if (search) params.search = search;
                                if (dateFrom) params.date_from = dateFrom;
                                if (dateTo) params.date_to = dateTo;
                                if (value) params.order_status = value.toString();
                                if (paymentStatusFilter) params.payment_status = paymentStatusFilter;
                                if (paymentMethodFilter) params.payment_method = paymentMethodFilter;
                                
                                router.get('/admin/reports', params, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                });
                            }}
                            placeholder="All Statuses"
                        />
                    </div>
                    <div>
                        <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Status
                        </label>
                        <SearchableSelect
                            id="payment_status"
                            name="payment_status"
                            value={paymentStatusFilter || ''}
                            options={[
                                { value: '', label: 'All Payments' },
                                { value: 'paid', label: 'Paid' },
                                { value: 'unpaid', label: 'Unpaid' },
                                { value: 'pending', label: 'Pending' },
                            ]}
                            onChange={(value) => {
                                setPaymentStatusFilter(value.toString());
                                const params: any = {};
                                if (search) params.search = search;
                                if (dateFrom) params.date_from = dateFrom;
                                if (dateTo) params.date_to = dateTo;
                                if (orderStatusFilter) params.order_status = orderStatusFilter;
                                if (value) params.payment_status = value.toString();
                                if (paymentMethodFilter) params.payment_method = paymentMethodFilter;
                                
                                router.get('/admin/reports', params, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                });
                            }}
                            placeholder="All Payments"
                        />
                    </div>
                    <div>
                        <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Method
                        </label>
                        <SearchableSelect
                            id="payment_method"
                            name="payment_method"
                            value={paymentMethodFilter || ''}
                            options={[
                                { value: '', label: 'All Methods' },
                                { value: 'cash_on_delivery', label: 'Cash on Delivery' },
                                { value: 'bank_transfer', label: 'Bank Transfer' },
                                { value: 'mobile_banking', label: 'Mobile Banking' },
                            ]}
                            onChange={(value) => {
                                setPaymentMethodFilter(value.toString());
                                const params: any = {};
                                if (search) params.search = search;
                                if (dateFrom) params.date_from = dateFrom;
                                if (dateTo) params.date_to = dateTo;
                                if (orderStatusFilter) params.order_status = orderStatusFilter;
                                if (paymentStatusFilter) params.payment_status = paymentStatusFilter;
                                if (value) params.payment_method = value.toString();
                                
                                router.get('/admin/reports', params, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                });
                            }}
                            placeholder="All Methods"
                        />
                    </div>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sales.data.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                                        No sales found
                                    </td>
                                </tr>
                            ) : (
                                sales.data.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{sale.order_number}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{sale.customer_name}</div>
                                            <div className="text-sm text-gray-500">{sale.customer_email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{sale.item_count} items</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">
                                                ৳{sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatPaymentMethod(sale.payment_method)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(sale.payment_status, 'payment')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(sale.order_status, 'order')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{sale.created_at}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={route('admin.reports.show', sale.id)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {sales.total > 0 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {sales.links[0]?.url && (
                                    <Link
                                        href={sales.links[0].url || '#'}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {sales.links[sales.links.length - 1]?.url && (
                                    <Link
                                        href={sales.links[sales.links.length - 1].url || '#'}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{sales.from || 0}</span> to{' '}
                                        <span className="font-medium">{sales.to || 0}</span> of{' '}
                                        <span className="font-medium">{sales.total}</span> results
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-700">Rows per page:</span>
                                    <select
                                        value={sales.per_page}
                                        onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                        className="border-gray-300 rounded-md text-sm"
                                    >
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {sales.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
