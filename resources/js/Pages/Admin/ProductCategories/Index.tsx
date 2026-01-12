import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SearchableSelect from '@/Components/SearchableSelect';

interface Category {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    sku: string | null;
    status: number;
    created_at: string;
}

interface IndexProps {
    categories: {
        data: Category[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters?: {
        search?: string;
        status?: string;
    };
}

export default function Index({ categories, filters = {} }: IndexProps) {
    const [deleting, setDeleting] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    // Safety check for categories data - Inertia may pass paginator differently
    const categoriesData = (categories?.data && Array.isArray(categories.data)) 
        ? categories.data 
        : (Array.isArray(categories) ? categories : []);
    
    // Debug logging
    console.log('Full categories prop:', categories);
    console.log('Categories data:', categoriesData);
    console.log('Categories data length:', categoriesData.length);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            setDeleting(id);
            router.delete(`/admin/categories/${id}`, {
                preserveScroll: true,
                onFinish: () => setDeleting(null),
            });
        }
    };

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            const params: any = {};
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            
            router.get(
                '/admin/categories',
                params,
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [search]);

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        const params: any = {};
        if (search) params.search = search;
        if (value) params.status = value;
        
        router.get(
            '/admin/categories',
            params,
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            '/admin/categories',
            { search, status: statusFilter, per_page: perPage },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AdminLayout>
            <Head title="Product Categories" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Categories</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage your product categories</p>
                </div>
                <Link href="/admin/categories/create">
                    <PrimaryButton>Add New Category</PrimaryButton>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search
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
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                className="pl-10 block w-full"
                                placeholder="Search by name, description, or SKU..."
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <SearchableSelect
                            id="status"
                            name="status"
                            value={statusFilter || ''}
                            options={[
                                { value: '', label: 'All Status' },
                                { value: '1', label: 'Active' },
                                { value: '2', label: 'Inactive' },
                            ]}
                            onChange={(value) => handleStatusFilter(value.toString())}
                            placeholder="All Status"
                        />
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            {categories && (
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium">{categories.from || 0}</span> to{' '}
                        <span className="font-medium">{categories.to || 0}</span> of{' '}
                        <span className="font-medium">{categories.total || 0}</span> categories
                    </div>
                    {categories.total > 0 && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Rows per page:</span>
                            <select
                                value={categories.per_page}
                                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    )}
                </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!categoriesData || categoriesData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="mt-2 text-sm font-medium">No categories found</p>
                                        <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            ) : (
                                categoriesData.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="h-16 w-16 object-cover rounded-lg shadow-sm"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                            {category.description && (
                                                <div className="text-sm text-gray-500 truncate max-w-xs mt-1">
                                                    {category.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {category.sku || <span className="text-gray-400">-</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    category.status === 1
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {category.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(category.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/admin/categories/${category.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    disabled={deleting === category.id}
                                                    className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deleting === category.id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {categories.total > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between items-center sm:hidden">
                            {categories.last_page > 1 && categories.links[0]?.url && (
                                <Link
                                    href={categories.links[0].url}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                            )}
                            {categories.last_page > 1 && categories.links[categories.links.length - 1]?.url && (
                                <Link
                                    href={categories.links[categories.links.length - 1].url}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-700">
                                Page <span className="font-medium">{categories.current_page}</span> of{' '}
                                <span className="font-medium">{categories.last_page}</span>
                            </div>
                            {categories.last_page > 1 && (
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {categories.links.map((link: any, index: number) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
