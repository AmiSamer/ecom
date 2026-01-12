import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SearchableSelect from '@/Components/SearchableSelect';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role: Role | null;
    status: number;
    created_at: string;
}

interface IndexProps {
    users: {
        data: User[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    roles: Role[];
    filters?: {
        search?: string;
        role_id?: string;
        status?: string;
    };
}

export default function Index({ users, roles, filters = {} }: IndexProps) {
    const [deleting, setDeleting] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role_id || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setDeleting(id);
            router.delete(`/admin/users/${id}`, {
                preserveScroll: true,
                onFinish: () => setDeleting(null),
            });
        }
    };

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            const params: any = {};
            if (search) params.search = search;
            if (roleFilter) params.role_id = roleFilter;
            if (statusFilter) params.status = statusFilter;
            
            router.get(
                '/admin/users',
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

    const handlePerPageChange = (perPage: number) => {
        const params: any = { per_page: perPage };
        if (search) params.search = search;
        if (roleFilter) params.role_id = roleFilter;
        if (statusFilter) params.status = statusFilter;
        
        router.get(
            '/admin/users',
            params,
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AdminLayout>
            <Head title="Users" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage your users</p>
                </div>
                <Link href="/admin/users/create">
                    <PrimaryButton>Add New User</PrimaryButton>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
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
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 block w-full"
                                placeholder="Search by name, email..."
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <SearchableSelect
                            id="role"
                            name="role"
                            value={roleFilter || ''}
                            options={[
                                { value: '', label: 'All Roles' },
                                ...roles.map((role) => ({
                                    value: role.id.toString(),
                                    label: role.name,
                                })),
                            ]}
                            onChange={(value) => {
                                const roleValue = value.toString();
                                setRoleFilter(roleValue);
                                const params: any = {};
                                if (search) params.search = search;
                                if (roleValue) params.role_id = roleValue;
                                if (statusFilter) params.status = statusFilter;
                                
                                router.get(
                                    '/admin/users',
                                    params,
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                        replace: true,
                                    }
                                );
                            }}
                            placeholder="All Roles"
                        />
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
                            onChange={(value) => {
                                const statusValue = value.toString();
                                setStatusFilter(statusValue);
                                const params: any = {};
                                if (search) params.search = search;
                                if (roleFilter) params.role_id = roleFilter;
                                if (statusValue) params.status = statusValue;
                                
                                router.get(
                                    '/admin/users',
                                    params,
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                        replace: true,
                                    }
                                );
                            }}
                            placeholder="All Status"
                        />
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{users.from || 0}</span> to{' '}
                    <span className="font-medium">{users.to || 0}</span> of{' '}
                    <span className="font-medium">{users.total || 0}</span> users
                </div>
                {users.total > 0 && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Rows per page:</span>
                        <select
                            value={users.per_page}
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

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
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
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <p className="mt-2 text-sm font-medium">No users found</p>
                                        <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {user.role?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.status === 1
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {user.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                {user.role_id !== 1 && (
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        disabled={deleting === user.id}
                                                        className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {deleting === user.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.total > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between items-center sm:hidden">
                            {users.last_page > 1 && users.links[0]?.url && (
                                <Link
                                    href={users.links[0].url}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                            )}
                            {users.last_page > 1 && users.links[users.links.length - 1]?.url && (
                                <Link
                                    href={users.links[users.links.length - 1].url}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-700">
                                Page <span className="font-medium">{users.current_page}</span> of{' '}
                                <span className="font-medium">{users.last_page}</span>
                            </div>
                            {users.last_page > 1 && (
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {users.links.map((link: any, index: number) => (
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
