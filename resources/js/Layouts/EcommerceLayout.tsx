import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';

interface EcommerceLayoutProps {
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

export default function EcommerceLayout({ children }: EcommerceLayoutProps) {
    const [cartCount, setCartCount] = useState(0);
    const auth = (usePage().props as unknown as PageProps).auth;

    useEffect(() => {
        if (auth?.user) {
            fetchCartCount();
        }
    }, [auth?.user]);

    useEffect(() => {
        // Listen for cart update events
        const handleCartUpdate = () => {
            if (auth?.user) {
                fetchCartCount();
            }
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [auth?.user]);

    const fetchCartCount = async () => {
        try {
            const response = await fetch('/api/cart');
            const data = await response.json();
            setCartCount(data.item_count || 0);
        } catch (error) {
            // Silently fail - cart count is not critical
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Ecommerce Store" />
            
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="text-2xl font-bold text-indigo-600">ShopHub</span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition">
                                Home
                            </Link>
                            <Link href="#" className="text-gray-700 hover:text-indigo-600 transition">
                                Products
                            </Link>
                            <Link href="#" className="text-gray-700 hover:text-indigo-600 transition">
                                About
                            </Link>
                            <Link href="#" className="text-gray-700 hover:text-indigo-600 transition">
                                Contact
                            </Link>
                        </nav>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-4">
                            {/* Cart */}
                            <Link href={auth?.user ? route('cart.index') : route('login')} className="relative p-2 text-gray-700 hover:text-indigo-600 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Auth */}
                            {auth?.user ? (
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition focus:outline-none">
                                                <span className="font-medium">{auth.user.name}</span>
                                                <svg
                                                    className="h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                Profile
                                            </Dropdown.Link>
                                            {auth.user && auth.user.role_id === 1 && (
                                                <Dropdown.Link href={route('dashboard')}>
                                                    Dashboard
                                                </Dropdown.Link>
                                            )}
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <Link href={route('login')} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                                        Login
                                    </Link>
                                    <Link href={route('register')} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">ShopHub</h3>
                            <p className="text-gray-400 text-sm">
                                Your one-stop shop for quality products at great prices.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/" className="hover:text-white">Home</Link></li>
                                <li><Link href="#" className="hover:text-white">Products</Link></li>
                                <li><Link href="#" className="hover:text-white">About Us</Link></li>
                                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Customer Service</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-white">Shipping Info</Link></li>
                                <li><Link href="#" className="hover:text-white">Returns</Link></li>
                                <li><Link href="#" className="hover:text-white">FAQ</Link></li>
                                <li><Link href="#" className="hover:text-white">Support</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Connect</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-white">Facebook</Link></li>
                                <li><Link href="#" className="hover:text-white">Twitter</Link></li>
                                <li><Link href="#" className="hover:text-white">Instagram</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
