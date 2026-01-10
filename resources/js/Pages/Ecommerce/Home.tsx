import { Head, Link } from '@inertiajs/react';
import EcommerceLayout from '@/Layouts/EcommerceLayout';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string;
    description?: string;
    category?: string;
}

interface HomeProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        } | null;
    };
    featuredProducts?: Product[];
}

export default function Home({ auth, featuredProducts = [] }: HomeProps) {
    // Sample products if none provided
    const products: Product[] = featuredProducts.length > 0 ? featuredProducts : [
        {
            id: 1,
            name: 'Wireless Headphones',
            slug: 'wireless-headphones',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            description: 'Premium wireless headphones with noise cancellation',
            category: 'Electronics'
        },
        {
            id: 2,
            name: 'Smart Watch',
            slug: 'smart-watch',
            price: 249.99,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
            description: 'Feature-rich smartwatch with health tracking',
            category: 'Electronics'
        },
        {
            id: 3,
            name: 'Running Shoes',
            slug: 'running-shoes',
            price: 129.99,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
            description: 'Comfortable running shoes for all terrains',
            category: 'Fashion'
        },
        {
            id: 4,
            name: 'Leather Backpack',
            slug: 'leather-backpack',
            price: 179.99,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
            description: 'Stylish leather backpack for everyday use',
            category: 'Fashion'
        },
        {
            id: 5,
            name: 'Coffee Maker',
            slug: 'coffee-maker',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1517668808823-9e24dd21b9d0?w=500',
            description: 'Automatic coffee maker for perfect brew',
            category: 'Home'
        },
        {
            id: 6,
            name: 'Yoga Mat',
            slug: 'yoga-mat',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
            description: 'Premium non-slip yoga mat',
            category: 'Fitness'
        },
    ];

    return (
        <EcommerceLayout auth={auth}>
            <Head title="Home - ShopHub" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Welcome to ShopHub
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-indigo-100">
                            Discover amazing products at best prices
                        </p>
                        <Link
                            href="/products"
                            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                    <p className="text-gray-600">Handpicked products just for you</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                        >
                            <div className="aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                                />
                            </div>
                            <div className="p-6">
                                {product.category && (
                                    <span className="text-xs text-indigo-600 font-semibold uppercase">
                                        {product.category}
                                    </span>
                                )}
                                <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-2 group-hover:text-indigo-600 transition">
                                    {product.name}
                                </h3>
                                {product.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-indigo-600">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className="text-indigo-600 group-hover:translate-x-1 transition inline-block">
                                        View Details →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/products"
                        className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        View All Products
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
                            <p className="text-gray-600">On orders over $50</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                            <p className="text-gray-600">We're here to help</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                            <p className="text-gray-600">100% secure transactions</p>
                        </div>
                    </div>
                </div>
            </section>
        </EcommerceLayout>
    );
}
