import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role?: {
        id: number;
        name: string;
    } | null;
}

interface PageProps {
    auth: {
        user: AuthUser | null;
    };
    [key: string]: any;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const auth = (usePage().props as unknown as PageProps).auth;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigation = [
        {
            name: 'Product Categories',
            href: '/admin/categories',
            iconColor: 'text-pink-400',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
        },
        {
            name: 'Products',
            href: '/admin/products',
            iconColor: 'text-blue-400',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            name: 'Users',
            href: '/admin/users',
            iconColor: 'text-green-400',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            name: 'Sale Reports',
            href: '/admin/reports',
            iconColor: 'text-yellow-400',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Admin Dashboard" />
            
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 text-white transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between px-6 border-b border-indigo-800">
                        <Link href={route('dashboard')} className="flex items-center space-x-2">
                            <span className="text-xl font-bold">Admin Panel</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-white hover:text-gray-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-3 py-4">
                        <Link
                            href={route('dashboard')}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                route().current('dashboard')
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                            }`}
                        >
                            <svg className="w-6 h-6 text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        {navigation.map((item) => {
                            const isActive = window.location.pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-indigo-800 text-white'
                                            : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                                    }`}
                                >
                                    <span className={isActive ? 'text-white' : item.iconColor}>{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="border-t border-indigo-800 p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center">
                                <span className="text-sm font-semibold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link
                                href={route('profile.edit')}
                                className="flex-1 text-center px-3 py-2 text-sm bg-indigo-800 hover:bg-indigo-700 rounded-lg transition"
                            >
                                Profile
                            </Link>
                            <Link
                                href={route('home')}
                                className="flex-1 text-center px-3 py-2 text-sm bg-indigo-800 hover:bg-indigo-700 rounded-lg transition"
                            >
                                Homepage
                            </Link>
                        </div>
                        <button
                            onClick={() => router.post(route('logout'))}
                            className="w-full mt-2 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition text-center"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`lg:pl-64 transition-all duration-300`}>
                {/* Top Bar */}
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center space-x-4">
                            <Link href={route('home')} className="text-gray-600 hover:text-indigo-600 transition">
                                View Store
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Sidebar Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
